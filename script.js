// ==========================================
// 1. ÁUDIOS E ESTADO DO TEMPORIZADOR
// ==========================================
const alarme = new Audio('Som/pop-up.mp3');
const concluir = new Audio('Som/Completo.mp3');
alarme.preload = concluir.preload = 'auto';

// Tempos (em segundos) e Ciclos
const TEMPO_FOCO = 25 * 60;
const TEMPO_PAUSA = 5 * 60;
const cicloModos = [TEMPO_FOCO, TEMPO_PAUSA, TEMPO_FOCO];

let indiceCicloAtual = 0;
let tempoRestante = cicloModos[0];
let timerId = null;
const CIRCUNFERENCIA = 2 * Math.PI * 92;

// ==========================================
// 2. ELEMENTOS DO DOM (CACHE)
// ==========================================
const elementoTempo = document.getElementById('Tempo');
const botaoIniciarPausar = document.getElementById('IniciarPausar');
const imgTomate = document.querySelector('#IniciarPausar img');
const botaoPular = document.getElementById('PularTempo');
const botaoReiniciar = document.getElementById('ReiniciarTempo');
const imgPular = document.querySelector('#PularTempo img');
const imgReiniciar = document.querySelector('#ReiniciarTempo img');
const dots = document.querySelectorAll('.dot');
const circuloTimer = document.getElementById('circulo-timer');

// Elementos de Configuração
const toggleTema = document.getElementById('toggleTema');
const rangeVolume = document.querySelector('.range-volume');
const iconeSom = document.querySelector('.icone-som');
const btnIdioma = document.querySelector('.botao-idioma');

// ==========================================
// 3. PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================
function carregarVolume() {
    const volumeSalvo = localStorage.getItem('volumePomodoro') ?? 70;
    const volFloat = parseFloat(volumeSalvo) / 100;
    alarme.volume = concluir.volume = volFloat;

    if (rangeVolume) rangeVolume.value = volumeSalvo;
    if (iconeSom) iconeSom.textContent = volumeSalvo == 0 ? '🔇' : '🔊';
    return volumeSalvo;
}

function carregarTema() {
    const temaSalvo = localStorage.getItem('temaPomodoro') || 'escuro';
    const eClaro = temaSalvo === 'claro';
    const labelTema = toggleTema?.closest('.opcao-item')?.querySelector('span');

    document.body.classList.toggle('tema-claro', eClaro);

    if (toggleTema) toggleTema.checked = !eClaro;
    if (labelTema) labelTema.textContent = `Tema: ${eClaro ? 'Claro' : 'Escuro'}`;
    if (imgPular) imgPular.src = eClaro ? 'img/pular.png' : 'img/pularW.png';
    if (imgReiniciar) imgReiniciar.src = eClaro ? 'img/reiniciar.png' : 'img/reiniciarW.png';
}

function tocarSom(audio) {
    carregarVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ==========================================
// 4. LÓGICA DO TEMPORIZADOR
// ==========================================
function atualizarDisplay() {
    if (!elementoTempo) return;
    const min = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
    const seg = String(Math.floor(tempoRestante % 60)).padStart(2, '0');
    elementoTempo.textContent = `${min}:${seg}`;

    if (circuloTimer) {
        const offset = CIRCUNFERENCIA * (1 - (tempoRestante / cicloModos[indiceCicloAtual]));
        circuloTimer.style.strokeDashoffset = offset;
    }
}

function atualizarIndicadores() {
    dots.forEach((dot, idx) => dot.classList.toggle('ativo', idx === indiceCicloAtual));
}

function resetarEstadoBotaoTomate() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (imgTomate) imgTomate.src = '../img/BotaoTomatePlay.png';
}

function alternarTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            if (tempoRestante > 0) {
                tempoRestante--;
                atualizarDisplay();
            } else {
                resetarEstadoBotaoTomate();
                avancarProximoCiclo();
            }
        }, 1000);

        if (imgTomate) imgTomate.src = '../img/BotaoTomatePause.png';
    } else {
        resetarEstadoBotaoTomate();
    }
}

function avancarProximoCiclo() {
    indiceCicloAtual++;
    if (indiceCicloAtual < cicloModos.length) {
        tocarSom(alarme);
        tempoRestante = cicloModos[indiceCicloAtual];
        atualizarDisplay();
        atualizarIndicadores();
    } else {
        tocarSom(concluir);
        alert("Parabéns! Você completou os 3 ciclos do Pomodoro.");
        reiniciarSequenciaCompleta();
    }
}

function reiniciarTimer() {
    resetarEstadoBotaoTomate();
    tempoRestante = cicloModos[indiceCicloAtual];
    atualizarDisplay();
}

function reiniciarSequenciaCompleta() {
    resetarEstadoBotaoTomate();
    indiceCicloAtual = 0;
    tempoRestante = cicloModos[0];
    atualizarDisplay();
    atualizarIndicadores();
}

// ==========================================
// 5. EVENTOS E INICIALIZAÇÃO
// ==========================================
if (botaoIniciarPausar) botaoIniciarPausar.addEventListener('click', alternarTimer);

if (botaoReiniciar) {
    botaoReiniciar.addEventListener('click', (e) => {
        e.detail === 2 ? reiniciarSequenciaCompleta() : reiniciarTimer();
    });
}

if (botaoPular) {
    botaoPular.addEventListener('click', () => {
        resetarEstadoBotaoTomate();
        avancarProximoCiclo();
    });
}

// Configurações (Volume, Tema e Idioma)
if (rangeVolume) {
    rangeVolume.addEventListener('input', (e) => {
        localStorage.setItem('volumePomodoro', e.target.value);
        carregarVolume();
    });
    rangeVolume.addEventListener('change', () => tocarSom(alarme));
}

if (toggleTema) {
    toggleTema.addEventListener('change', () => {
        localStorage.setItem('temaPomodoro', toggleTema.checked ? 'escuro' : 'claro');
        carregarTema();
    });
}

if (btnIdioma) {
    btnIdioma.addEventListener('click', () => {
        const span = btnIdioma.querySelector('span:first-child');
        if (span) span.textContent = span.textContent.includes('ING') ? 'POR' : 'ING';
    });
}

// Inicializa a interface
carregarVolume();
carregarTema();
atualizarDisplay();
atualizarIndicadores();