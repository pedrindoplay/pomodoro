// Timer
const alarme = new Audio('Som/pop-up.mp3');
const concluir = new Audio('Som/Completo.mp3');
const TEMPO_FOCO = 25 * 60;
const TEMPO_PAUSA = 5 * 60;
const cicloModos = [TEMPO_FOCO, TEMPO_PAUSA, TEMPO_FOCO];
let indiceCicloAtual = 0;
let tempoRestante = cicloModos[0];
let timerId = null;
const CIRCUNFERENCIA = 2 * Math.PI * 92;

// Elementos
const elementoTempo = document.getElementById('Tempo');
const botaoIniciarPausar = document.getElementById('IniciarPausar');
const imgTomate = document.querySelector('#IniciarPausar img');
const botaoPular = document.getElementById('PularTempo');
const botaoReiniciar = document.getElementById('ReiniciarTempo');
const imgPular = document.querySelector('#PularTempo img');
const imgReiniciar = document.querySelector('#ReiniciarTempo img');
const dots = document.querySelectorAll('.dot');
const circuloTimer = document.getElementById('circulo-timer');
const toggleTema = document.getElementById('toggleTema');
const rangeVolume = document.querySelector('.range-volume');
const iconeSom = document.querySelector('.icone-som');
const btnIdioma = document.querySelector('.botao-idioma');

const textos = {
    pt: { homeTitle: 'Pomodoro', settingsTitle: 'Configurações', aboutTitlePage: 'Sobre', skip: 'Pular', restart: 'Reiniciar', settings: 'Configurações', about: 'Sobre', theme: 'Tema', dark: 'Escuro', light: 'Claro', aboutTitle: 'O que é o pomodoro?', aboutTextOne: 'O método Pomodoro é uma técnica de gestão de tempo super simples e eficaz para aumentar o foco e evitar a procrastinação. Ele foi criado no final dos anos 1980 por Francesco Cirillo.', aboutTextTwo: 'O nome “Pomodoro” vem daquele famoso timer de cozinha em formato de tomate que o criador usava quando estudante.', complete: 'Parabéns! Você completou os 3 ciclos do Pomodoro.' },
    en: { homeTitle: 'Pomodoro', settingsTitle: 'Settings', aboutTitlePage: 'About', skip: 'Skip', restart: 'Restart', settings: 'Settings', about: 'About', theme: 'Theme', dark: 'Dark', light: 'Light', aboutTitle: 'What is the Pomodoro?', aboutTextOne: 'The Pomodoro method is a simple and effective time-management technique for improving focus and avoiding procrastination. It was created by Francesco Cirillo in the late 1980s.', aboutTextTwo: 'The name “Pomodoro” comes from the tomato-shaped kitchen timer that its creator used as a student.', complete: 'Congratulations! You completed all 3 Pomodoro cycles.' }
};
let idiomaAtual = localStorage.getItem('idiomaPomodoro') || 'pt';

// Idioma
function traduzirPagina() {
    const texto = textos[idiomaAtual];
    const titulos = { home: 'homeTitle', settings: 'settingsTitle', about: 'aboutTitlePage' };
    document.documentElement.lang = idiomaAtual === 'pt' ? 'pt-br' : 'en';
    document.title = texto[titulos[document.body.dataset.page]] || 'Pomodoro';
    document.querySelectorAll('[data-i18n]').forEach((elemento) => { elemento.textContent = texto[elemento.dataset.i18n]; });
    if (btnIdioma) btnIdioma.querySelector('#textoIdioma').textContent = idiomaAtual === 'pt' ? 'ING' : 'POR';
}

// Preferências
function carregarVolume() {
    const volume = localStorage.getItem('volumePomodoro') ?? 70;
    alarme.volume = concluir.volume = Number(volume) / 100;
    if (rangeVolume) rangeVolume.value = volume;
    if (iconeSom) iconeSom.textContent = volume == 0 ? '×' : '◖)))';
}
function carregarTema() {
    const claro = localStorage.getItem('temaPomodoro') === 'claro';
    document.body.classList.toggle('tema-claro', claro);
    if (toggleTema) toggleTema.checked = !claro;
    const labelTema = document.getElementById('labelTema');
    if (labelTema) labelTema.textContent = `${textos[idiomaAtual].theme}: ${claro ? textos[idiomaAtual].light : textos[idiomaAtual].dark}`;
    if (imgPular) imgPular.src = claro ? 'img/pular.png' : 'img/pularW.png';
    if (imgReiniciar) imgReiniciar.src = claro ? 'img/reiniciar.png' : 'img/reiniciarW.png';
}
function tocarSom(audio) { carregarVolume(); audio.currentTime = 0; audio.play().catch(() => {}); }

// Funções
function atualizarDisplay() {
    if (!elementoTempo) return;
    const min = String(Math.floor(tempoRestante / 60)).padStart(2, '0');
    const seg = String(tempoRestante % 60).padStart(2, '0');
    elementoTempo.textContent = `${min}:${seg}`;
    if (circuloTimer) circuloTimer.style.strokeDashoffset = CIRCUNFERENCIA * (1 - tempoRestante / cicloModos[indiceCicloAtual]);
}
function atualizarIndicadores() { dots.forEach((dot, indice) => dot.classList.toggle('ativo', indice === indiceCicloAtual)); }
function pararTimer() { clearInterval(timerId); timerId = null; if (imgTomate) imgTomate.src = 'img/BotaoTomatePlay.png'; }
function avancarProximoCiclo() {
    indiceCicloAtual += 1;
    if (indiceCicloAtual < cicloModos.length) { tocarSom(alarme); tempoRestante = cicloModos[indiceCicloAtual]; atualizarDisplay(); atualizarIndicadores(); }
    else { tocarSom(concluir); alert(textos[idiomaAtual].complete); reiniciarSequenciaCompleta(); }
}
function alternarTimer() {
    if (timerId) { pararTimer(); return; }
    timerId = setInterval(() => { if (tempoRestante > 0) { tempoRestante -= 1; atualizarDisplay(); } else { pararTimer(); avancarProximoCiclo(); } }, 1000);
    if (imgTomate) imgTomate.src = 'img/BotaoTomatePause.png';
}
function reiniciarTimer() { pararTimer(); tempoRestante = cicloModos[indiceCicloAtual]; atualizarDisplay(); }
function reiniciarSequenciaCompleta() { pararTimer(); indiceCicloAtual = 0; tempoRestante = cicloModos[0]; atualizarDisplay(); atualizarIndicadores(); }

// Eventos
botaoIniciarPausar?.addEventListener('click', alternarTimer);
botaoPular?.addEventListener('click', () => { pararTimer(); avancarProximoCiclo(); });
botaoReiniciar?.addEventListener('click', (evento) => { evento.detail === 2 ? reiniciarSequenciaCompleta() : reiniciarTimer(); });
rangeVolume?.addEventListener('input', (evento) => { localStorage.setItem('volumePomodoro', evento.target.value); carregarVolume(); });
rangeVolume?.addEventListener('change', () => tocarSom(alarme));
toggleTema?.addEventListener('change', () => { localStorage.setItem('temaPomodoro', toggleTema.checked ? 'escuro' : 'claro'); carregarTema(); });
btnIdioma?.addEventListener('click', () => { idiomaAtual = idiomaAtual === 'pt' ? 'en' : 'pt'; localStorage.setItem('idiomaPomodoro', idiomaAtual); traduzirPagina(); carregarTema(); });

carregarVolume();
traduzirPagina();
carregarTema();
atualizarDisplay();
atualizarIndicadores();
