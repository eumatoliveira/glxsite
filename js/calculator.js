/**
 * LSS 4.0 Calculator Logic & Charts - GLX Partners
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is required for the calculator.');
        return;
    }

    // --- State & Constants ---
    const state = {
        faturamento: 150000,
        desperdicio: 15,
        margem: 10,
        recuperacaoLSS: 0.60 // A metodologia LSS 4.0 costuma recuperar 60% do desperdício
    };

    // --- Elements ---
    const elements = {
        sliderFaturamento: document.getElementById('calc-faturamento'),
        sliderDesperdicio: document.getElementById('calc-desperdicio'),
        sliderMargem: document.getElementById('calc-margem'),
        inputFaturamento: document.getElementById('input-faturamento'),
        inputDesperdicio: document.getElementById('input-desperdicio'),
        inputMargem: document.getElementById('input-margem'),
        resultDinheiroMesa: document.getElementById('result-dinheiro-mesa'),
        resultNovaMargem: document.getElementById('result-nova-margem')
    };

    // --- Formatters ---
    const formatBRL = (val) => {
        if (val >= 1000000000) return `R$ ${(val / 1000000000).toFixed(1)}B`;
        if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
    };

    const formatNumber = (val) => new Intl.NumberFormat('pt-BR').format(val);
    const parseNumber = (str) => {
        let clean = str.replace(/[R$\s.]/g, '').replace(',', '.').toLowerCase();
        let multiplier = 1;
        if (clean.endsWith('k')) { multiplier = 1000; clean = clean.slice(0, -1); }
        else if (clean.endsWith('m')) { multiplier = 1000000; clean = clean.slice(0, -1); }
        else if (clean.endsWith('b')) { multiplier = 1000000000; clean = clean.slice(0, -1); }
        return (parseFloat(clean) || 0) * multiplier;
    };

    const updateCalculations = () => {
        const faturamentoAnual = state.faturamento * 12;
        const perdaAnualTotal = faturamentoAnual * (state.desperdicio / 100);
        const valorRecuperavel = perdaAnualTotal * state.recuperacaoLSS;
        
        const ganhoMargemPontos = (state.desperdicio / 100) * state.recuperacaoLSS * 100;
        const novaMargemFinal = state.margem + ganhoMargemPontos;

        // Update results
        elements.resultDinheiroMesa.textContent = formatBRL(valorRecuperavel);
        elements.resultNovaMargem.textContent = `${novaMargemFinal.toFixed(1)}%`;
        
        updateCharts(valorRecuperavel, state.margem, novaMargemFinal);
    };

    // --- Sync Functions ---
    const syncUI = (source) => {
        if (source === 'faturamento') {
            elements.inputFaturamento.value = formatNumber(state.faturamento);
            elements.sliderFaturamento.value = state.faturamento;
        } else if (source === 'desperdicio') {
            elements.inputDesperdicio.value = state.desperdicio;
            elements.sliderDesperdicio.value = state.desperdicio;
        } else if (source === 'margem') {
            elements.inputMargem.value = state.margem;
            elements.sliderMargem.value = state.margem;
        }
        updateCalculations();
    };

    // --- Listeners ---
    // Sliders
    elements.sliderFaturamento.addEventListener('input', (e) => {
        state.faturamento = parseFloat(e.target.value);
        elements.inputFaturamento.value = formatNumber(state.faturamento);
        updateCalculations();
    });

    elements.sliderDesperdicio.addEventListener('input', (e) => {
        state.desperdicio = parseFloat(e.target.value);
        elements.inputDesperdicio.value = state.desperdicio;
        updateCalculations();
    });

    elements.sliderMargem.addEventListener('input', (e) => {
        state.margem = parseFloat(e.target.value);
        elements.inputMargem.value = state.margem;
        updateCalculations();
    });

    // Text Inputs
    elements.inputFaturamento.addEventListener('change', (e) => {
        state.faturamento = Math.min(1000000000, parseNumber(e.target.value));
        syncUI('faturamento');
    });

    elements.inputDesperdicio.addEventListener('change', (e) => {
        state.desperdicio = Math.min(100, parseNumber(e.target.value));
        syncUI('desperdicio');
    });

    elements.inputMargem.addEventListener('change', (e) => {
        state.margem = Math.min(100, parseNumber(e.target.value));
        syncUI('margem');
    });

    // --- Charts ---
    let lineChart, radarChart;

    const initCharts = () => {
        // Line Chart
        const lineCtx = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Início', ...Array.from({length: 12}, (_, i) => `Mês ${i + 1}`)],
                datasets: [
                    {
                        label: 'Operação Atual',
                        data: [],
                        borderColor: '#94a3b8',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        tension: 0.4
                    },
                    {
                        label: 'Operação LSS 4.0',
                        data: [],
                        borderColor: '#7c3aed',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        ticks: { callback: value => formatBRL(value) } 
                    },
                    x: { grid: { display: false } }
                }
            }
        });

        // Radar Chart
        const radarCtx = document.getElementById('radarChart').getContext('2d');
        radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Eficiência (TAT)', 'Satisfação (NPS)', 'Digitalização', 'Previsibilidade', 'Controle de Custos', 'Engajamento'],
                datasets: [
                    {
                        label: 'Clínica Tradicional',
                        data: [40, 50, 30, 20, 45, 35],
                        backgroundColor: 'rgba(148, 163, 184, 0.2)',
                        borderColor: '#94a3b8',
                        pointBackgroundColor: '#94a3b8'
                    },
                    {
                        label: 'Clínica LSS 4.0',
                        data: [95, 90, 85, 92, 88, 90],
                        backgroundColor: 'rgba(124, 58, 237, 0.2)',
                        borderColor: '#7c3aed',
                        pointBackgroundColor: '#7c3aed'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0,0,0,0.05)' },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { display: false }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    };

    const updateCharts = (valorRecuperavelAnual, margemAtual, novaMargem) => {
        const mesARecuperar = valorRecuperavelAnual / 12;
        const faturamentoMensal = state.faturamento;
        
        const dataAtual = [0];
        const dataLSS = [0];
        
        let acumuladoAtual = 0;
        let acumuladoLSS = 0;

        for (let i = 1; i <= 12; i++) {
            acumuladoAtual += faturamentoMensal * (margemAtual / 100);
            acumuladoLSS += faturamentoMensal * (novaMargem / 100);
            dataAtual.push(acumuladoAtual);
            dataLSS.push(acumuladoLSS);
        }

        lineChart.data.datasets[0].data = dataAtual;
        lineChart.data.datasets[1].data = dataLSS;
        lineChart.update();
    };

    // Initialize
    initCharts();
    syncUI('faturamento');
    syncUI('desperdicio');
    syncUI('margem');
});
