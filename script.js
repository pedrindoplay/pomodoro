<<<<<<< HEAD
// Timer
=======
// ==========================================
// 1. ÁUDIOS E ESTADO DO TEMPORIZADOR
// ==========================================
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
const alarme = new Audio('Som/pop-up.mp3');
const concluir = new Audio('Som/Completo.mp3');
alarme.preload = concluir.preload = 'auto';

<<<<<<< HEAD
const TEMPO_FOCO = 25 * 60;
=======
// Tempos (em segundos) e Ciclos
const TEMPO_FOCO = 25 * 60;
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
const TEMPO_PAUSA = 5 * 60;
const cicloModos = [TEMPO_FOCO, TEMPO_PAUSA, TEMPO_FOCO];

let indiceCicloAtual = 0;
let tempoRestante = cicloModos[0];
let timerId = null;
const CIRCUNFERENCIA = 2 * Math.PI * 92;

<<<<<<< HEAD
// Elementos
=======
// ==========================================
// 2. ELEMENTOS DO DOM (CACHE)
// ==========================================
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
const elementoTempo = document.getElementById('Tempo');
const botaoIniciarPausar = document.getElementById('IniciarPausar');
const imgTomate = document.querySelector('#IniciarPausar img');
const botaoPular = document.getElementById('PularTempo');
const botaoReiniciar = document.getElementById('ReiniciarTempo');
const imgPular = document.querySelector('#PularTempo img');
const imgReiniciar = document.querySelector('#ReiniciarTempo img');
const dots = document.querySelectorAll('.dot');
const circuloTimer = document.getElementById('circulo-timer');

<<<<<<< HEAD
const toggleTema = document.getElementById('toggleTema');
const rangeVolume = document.querySelector('.range-volume');
const iconeSom = document.querySelector('.icone-som');
const btnIdioma = document.querySelector('.botao-idioma');

const textos = {
    pt: {
        homeTitle: 'Pomodoro', settingsTitle: 'Configurações', aboutTitlePage: 'Sobre',
        skip: 'Pular', restart: 'Reiniciar', settings: 'Configurações', about: 'Sobre',
        theme: 'Tema', dark: 'Escuro', light: 'Claro',
        aboutTitle: 'O que é o pomodoro?',
        aboutTextOne: 'O método Pomodoro é uma técnica de gestão de tempo super simples e eficaz para aumentar o foco e evitar a procrastinação. Ele foi criado no final dos anos 1980 por Francesco Cirillo.',
        aboutTextTwo: 'O nome “Pomodoro” vem daquele famoso timer de cozinha em formato de tomate que o criador usava quando estudante.',
        complete: 'Parabéns! Você completou os 3 ciclos do Pomodoro.'
    },
    en: {
        homeTitle: 'Pomodoro', settingsTitle: 'Settings', aboutTitlePage: 'About',
        skip: 'Skip', restart: 'Restart', settings: 'Settings', about: 'About',
        theme: 'Theme', dark: 'Dark', light: 'Light',
        aboutTitle: 'What is the Pomodoro?',
        aboutTextOne: 'The Pomodoro method is a simple and effective time-management technique for improving focus and avoiding procrastination. It was created by Francesco Cirillo in the late 1980s.',
        aboutTextTwo: 'The name “Pomodoro” comes from the tomato-shaped kitchen timer that its creator used as a student.',
        complete: 'Congratulations! You completed all 3 Pomodoro cycles.'
    }
};

let idiomaAtual = localStorage.getItem('idiomaPomodoro') || 'pt';

function traduzirPagina() {
    const texto = textos[idiomaAtual];
    const pagina = document.body.dataset.page;

    const titulos = { home: 'homeTitle', settings: 'settingsTitle', about: 'aboutTitlePage' };
    document.documentElement.lang = idiomaAtual === 'pt' ? 'pt-br' : 'en';
    document.title = texto[titulos[pagina]] || 'Pomodoro';
    document.querySelectorAll('[data-i18n]').forEach((elemento) => {
        elemento.textContent = texto[elemento.dataset.i18n];
    });
    if (btnIdioma) btnIdioma.querySelector('#textoIdioma').textContent = idiomaAtual === 'pt' ? 'ING' : 'POR';
}

// Preferências
=======
// Elementos de Configuração
const toggleTema = document.getElementById('toggleTema');
const rangeVolume = document.querySelector('.range-volume');
const iconeSom = document.querySelector('.icone-som');
const btnIdioma = document.querySelector('.botao-idioma');

// ==========================================
// 3. PERSISTÊNCIA (LOCALSTORAGE)
// ==========================================
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
function carregarVolume() {
    const volumeSalvo = localStorage.getItem('volumePomodoro') ?? 70;
    const volFloat = parseFloat(volumeSalvo) / 100;
    alarme.volume = concluir.volume = volFloat;

    if (rangeVolume) rangeVolume.value = volumeSalvo;
<<<<<<< HEAD
    if (iconeSom) iconeSom.textContent = volumeSalvo == 0 ? '×' : '◖)))';
=======
    if (iconeSom) iconeSom.textContent = volumeSalvo == 0 ? '🔇' : '🔊';
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
    return volumeSalvo;
}

function carregarTema() {
    const temaSalvo = localStorage.getItem('temaPomodoro') || 'escuro';
    const eClaro = temaSalvo === 'claro';
    const labelTema = toggleTema?.closest('.opcao-item')?.querySelector('span');

    document.body.classList.toggle('tema-claro', eClaro);

    if (toggleTema) toggleTema.checked = !eClaro;
<<<<<<< HEAD
    if (labelTema) {
        const texto = textos[idiomaAtual];
        labelTema.textContent = `${texto.theme}: ${eClaro ? texto.light : texto.dark}`;
    }
=======
    if (labelTema) labelTema.textContent = `Tema: ${eClaro ? 'Claro' : 'Escuro'}`;
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
    if (imgPular) imgPular.src = eClaro ? 'img/pular.png' : 'img/pularW.png';
    if (imgReiniciar) imgReiniciar.src = eClaro ? 'img/reiniciar.png' : 'img/reiniciarW.png';
}

function tocarSom(audio) {
    carregarVolume();
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

<<<<<<< HEAD
// Funções
=======
// ==========================================
// 4. LÓGICA DO TEMPORIZADOR
// ==========================================
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
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
    if (imgTomate) imgTomate.src = 'img/BotaoTomatePlay.png';
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

        if (imgTomate) imgTomate.src = 'img/BotaoTomatePause.png';
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
<<<<<<< HEAD
        alert(textos[idiomaAtual].complete);
=======
        alert("Parabéns! Você completou os 3 ciclos do Pomodoro.");
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
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

<<<<<<< HEAD
// Eventos
=======
// ==========================================
// 5. EVENTOS E INICIALIZAÇÃO
// ==========================================
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
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

<<<<<<< HEAD
if (rangeVolume) {
=======
// Configurações (Volume, Tema e Idioma)
if (rangeVolume) {
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
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

<<<<<<< HEAD
if (btnIdioma) {
    btnIdioma.addEventListener('click', () => {
        idiomaAtual = idiomaAtual === 'pt' ? 'en' : 'pt';
        localStorage.setItem('idiomaPomodoro', idiomaAtual);
        traduzirPagina();
        carregarTema();
    });
}

carregarVolume();
traduzirPagina();
carregarTema();
atualizarDisplay();
atualizarIndicadores();
=======
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
>>>>>>> b6fd8a0809e3a3555fff5a1a0bbe07030d53fd8e
