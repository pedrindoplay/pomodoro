const alarme = new Audio('../Som/pop-up.mp3');
const concluir = new Audio('../Som/Completo.mp3')
// Seleção dos elementos do HTML
const elementoTempo = document.getElementById('Tempo');
const botaoIniciarPausar = document.getElementById('IniciarPausar');
const botaoPular = document.getElementById('PularTempo');
const botaoReiniciar = document.getElementById('ReiniciarTempo');
const dots = document.querySelectorAll('.dot');

// Definição dos tempos (em segundos)
const TEMPO_FOCO = 25 * 60;   // 25 minutos
const TEMPO_PAUSA = 5 * 60;   // 5 minutos

// Sequência exata de 3 ciclos: Foco (25m) -> Pausa (5m) -> Foco (25m)
const cicloModos = [TEMPO_FOCO, TEMPO_PAUSA, TEMPO_FOCO];
let indiceCicloAtual = 0; 

let tempoRestante = cicloModos[indiceCicloAtual];
let timerId = null;

// Atualiza o estado visual das bolinhas
function atualizarIndicadores() {
    dots.forEach((dot, index) => {
        if (index === indiceCicloAtual) {
            dot.classList.add('ativo');
        } else {
            dot.classList.remove('ativo');
        }
    });
}

// Atualiza o texto do cronômetro (MM:SS)
function atualizarDisplay() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');
    
    elementoTempo.textContent = `${minutosFormatados}:${segundosFormatados}`;
}

// Alterna entre Iniciar e Pausar
function alternarTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            if (tempoRestante > 0) {
                tempoRestante--;
                atualizarDisplay();
            } else {
                clearInterval(timerId);
                timerId = null;
                avancarProximoCiclo();
            }
        }, 1000);
    } else {
        clearInterval(timerId);
        timerId = null;
    }
}

// Avança para a próxima etapa do ciclo
function avancarProximoCiclo() {
    indiceCicloAtual++;

    

    if (indiceCicloAtual < cicloModos.length) {
        alarme.play();
        tempoRestante = cicloModos[indiceCicloAtual];
        atualizarDisplay();
        atualizarIndicadores();
    } else {
        concluir.play();
        alert("Parabéns! Você completou os 3 ciclos do Pomodoro.");
        reiniciarSequenciaCompleta();
    }
}

// Reinicia apenas o tempo do ciclo atual
function reiniciarTimer() {
    clearInterval(timerId);
    timerId = null;
    tempoRestante = cicloModos[indiceCicloAtual];
    atualizarDisplay();
}

// Reinicia TODOS os ciclos de volta ao início
function reiniciarSequenciaCompleta() {
    clearInterval(timerId);
    timerId = null;
    indiceCicloAtual = 0;
    tempoRestante = cicloModos[0];
    atualizarDisplay();
    atualizarIndicadores();
}

// Eventos de clique
botaoIniciarPausar.addEventListener('click', alternarTimer);

// Lógica de 1 clique (reinicia ciclo atual) ou 2 cliques (reinicia todos os ciclos)
botaoReiniciar.addEventListener('click', (evento) => {
    if (evento.detail === 2) {
        reiniciarSequenciaCompleta();
    } else if (evento.detail === 1) {
        reiniciarTimer();
    }
});

botaoPular.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    avancarProximoCiclo();
});

// Inicialização da tela
atualizarDisplay();
atualizarIndicadores();