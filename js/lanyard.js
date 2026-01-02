/**
 * Lanyard Badge - Vanilla JS + Three.js
 * Simulates rope physics using Verlet Integration for a lightweight "Badge" effect.
 */

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

class LanyardBadge {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.texturePath = options.texture || 'img/glx-badge_v2.jpg';
        
        // Configuration
        this.damping = 0.98; // Air resistance (higher = more swing)
        this.stiffness = 0.1; // Rope stiffness
        this.segments = 10;
        this.ropeLength = 15;
        this.gravity = new THREE.Vector3(0, -0.5, 0);
        
        // State
        this.mouse = new THREE.Vector2();
        this.isDragging = false;
        this.dragOffset = new THREE.Vector3();
        this.raycaster = new THREE.Raycaster();
        
        this.init();
    }

    async init() {
        // 1. Setup Scene
        this.scene = new THREE.Scene();
        
        // 2. Setup Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.z = 35; // Zoom out to see rope

        // 3. Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // 4. Load Texture
        const textureLoader = new THREE.TextureLoader();
        const badgeTexture = await new Promise(resolve => 
            textureLoader.load(this.texturePath, resolve)
        );
        badgeTexture.colorSpace = THREE.SRGBColorSpace;

        // 5. Create Rope (Verlet Particles)
        this.particles = [];
        for (let i = 0; i < this.segments; i++) {
            this.particles.push({
                x: 0, y: (this.segments - i) * (this.ropeLength / this.segments) - 10, z: 0,
                oldX: 0, oldY: (this.segments - i) * (this.ropeLength / this.segments) - 10, oldZ: 0,
                pinned: i === 0 // Pin the top
            });
        }

        // 6. Create Badge Mesh
        // Front (Image)
        const geometry = new THREE.BoxGeometry(7, 10, 0.2); // Card dimensions
        // Material with texture on front (index 4) and back (5), dark on sides
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
        const badgeMat = new THREE.MeshStandardMaterial({ 
            map: badgeTexture, 
            roughness: 0.2,
            metalness: 0.1 
        });
        
        this.badgeMesh = new THREE.Mesh(geometry, [
            darkMat, darkMat, darkMat, darkMat, badgeMat, badgeMat
        ]);
        this.scene.add(this.badgeMesh);

        // Rope visual
        const ropeGeometry = new THREE.BufferGeometry();
        const ropeMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 2 });
        this.ropeMesh = new THREE.Line(ropeGeometry, ropeMaterial);
        this.scene.add(this.ropeMesh);

        // 7. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 5, 10);
        this.scene.add(dirLight);

        // 8. Events
        window.addEventListener('resize', () => this.onResize());
        this.container.addEventListener('mousemove', e => this.onMouseMove(e));
        this.container.addEventListener('mousedown', e => this.onMouseDown(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
        
        // Touch support
        this.container.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });
        this.container.addEventListener('touchstart', e => {
            const touch = e.touches[0];
            this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
        }, { passive: false });

        // Start Loop
        this.animate();
    }

    updatePhysics() {
        // Verlet Integration
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            if (p.pinned) continue;

            const vx = (p.x - p.oldX) * this.damping;
            const vy = (p.y - p.oldY) * this.damping;
            const vz = (p.z - p.oldZ) * this.damping;

            p.oldX = p.x;
            p.oldY = p.y;
            p.oldZ = p.z;

            // Apply dragging force if holding bottom particle (badge)
            if (this.isDragging && i === this.particles.length - 1) {
                // Determine target drag position
                // (Simplified: track mouse on Z=0 plane roughly)
                const vec = new THREE.Vector3();
                const pos = new THREE.Vector3();
                
                vec.set(
                    (this.mouse.x * 2) - 1,
                    -(this.mouse.y * 2) + 1,
                    0.5
                );
                
                vec.unproject(this.camera);
                vec.sub(this.camera.position).normalize();
                
                const distance = -this.camera.position.z / vec.z;
                pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
                
                p.x += (pos.x - p.x) * 0.2; // Spring pull to mouse
                p.y += (pos.y - p.y) * 0.2;
                p.z += (pos.z - p.z) * 0.2;
            } else {
                p.x += vx + this.gravity.x;
                p.y += vy + this.gravity.y;
                p.z += vz + this.gravity.z;
            }
        }

        // Constraints (Rope Segments)
        for (let j = 0; j < 5; j++) { // Iterate for stability
            for (let i = 0; i < this.particles.length - 1; i++) {
                const p1 = this.particles[i];
                const p2 = this.particles[i+1];
                
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dz = p2.z - p1.z;
                
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const diff = (this.ropeLength / this.segments) - dist;
                const percent = diff / dist / 2;
                
                const offsetX = dx * percent;
                const offsetY = dy * percent;
                const offsetZ = dz * percent;
                
                if (!p1.pinned) {
                    p1.x -= offsetX;
                    p1.y -= offsetY;
                    p1.z -= offsetZ;
                }
                
                if (!p2.pinned) { // Usually bottom free
                    p2.x += offsetX;
                    p2.y += offsetY;
                    p2.z += offsetZ;
                }
            }
        }
    }

    updateVisuals() {
        // Update Rope Line
        const points = this.particles.map(p => new THREE.Vector3(p.x, p.y, p.z));
        this.ropeMesh.geometry.setFromPoints(points);
        
        // Update Badge Position (Last Particle)
        const lastP = this.particles[this.particles.length - 1];
        const prevP = this.particles[this.particles.length - 2];
        
        this.badgeMesh.position.set(lastP.x, lastP.y - 5.5, lastP.z); // -5.5 to center geometry
        
        // Dynamic Rotation based on movement and rope angle
        const dx = lastP.x - prevP.x;
        const dz = lastP.z - prevP.z;
        
        // Rotate to face velocity/drag
        this.badgeMesh.rotation.z = -dx * 0.5;
        this.badgeMesh.rotation.x = dz * 0.5;
        
        // Add subtle constant rotation
        this.badgeMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
    }

    animate() {
        this.updatePhysics();
        this.updateVisuals();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    onMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height;
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
    }

    onMouseUp() {
        this.isDragging = false;
        this.container.style.cursor = 'grab';
    }

    onResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
}

// Global exposure
// We load it as module in HTML
window.LanyardBadge = LanyardBadge;
