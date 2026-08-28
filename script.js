// ==========================================
// 1. ÁUDIOS E ELEMENTOS DO POMODORO
// ==========================================
const alarme = new Audio('Som/pop-up.mp3');
const concluir = new Audio('Som/Completo.mp3');

alarme.preload = 'auto';
concluir.preload = 'auto';

// FUNÇÃO PARA CARREGAR E APLICAR O VOLUME SALVO
function carregarVolumeSalvo() {
    const volumeSalvo = localStorage.getItem('volumePomodoro');
    if (volumeSalvo !== null) {
        const volumeFloat = parseFloat(volumeSalvo) / 100;
        alarme.volume = volumeFloat;
        concluir.volume = volumeFloat;
        return volumeSalvo;
    }
    return 70; // Volume padrão (70%) se nada foi salvo ainda
}

// Aplica o volume assim que o script carrega em qualquer tela
carregarVolumeSalvo();

// Seleção dos elementos do Pomodoro
const elementoTempo = document.getElementById('Tempo');
const botaoIniciarPausar = document.getElementById('IniciarPausar');
const botaoPular = document.getElementById('PularTempo');
const botaoReiniciar = document.getElementById('ReiniciarTempo');
const dots = document.querySelectorAll('.dot');
const circuloTimer = document.getElementById('circulo-timer');

// Definição dos tempos (em segundos)
const TEMPO_FOCO = 25 * 60;   // 25 minutos
const TEMPO_PAUSA = 5 * 60;   // 5 minutos

const cicloModos = [TEMPO_FOCO, TEMPO_PAUSA, TEMPO_FOCO];
let indiceCicloAtual = 0; 

let tempoRestante = cicloModos[indiceCicloAtual];
let timerId = null;

const CIRCUNFERENCIA = 2 * Math.PI * 92; 

// ==========================================
// 2. FUNÇÕES DO TEMPORIZADOR
// ==========================================

function atualizarIndicadores() {
    if (!dots.length) return;
    dots.forEach((dot, index) => {
        if (index === indiceCicloAtual) {
            dot.classList.add('ativo');
        } else {
            dot.classList.remove('ativo');
        }
    });
}

function atualizarProgressoCirculo() {
    if (!circuloTimer) return;
    const tempoTotalDoCiclo = cicloModos[indiceCicloAtual];
    const fracao = tempoRestante / tempoTotalDoCiclo;
    const offset = CIRCUNFERENCIA * (1 - fracao);
    circuloTimer.style.strokeDashoffset = offset;
}

function atualizarDisplay() {
    if (!elementoTempo) return;
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = Math.floor(tempoRestante % 60);
    
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');
    
    elementoTempo.textContent = `${minutosFormatados}:${segundosFormatados}`;
    atualizarProgressoCirculo();
}

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

function tocarSom(audioObj) {
    // Garante que o volume mais recente salvo seja aplicado antes de tocar
    carregarVolumeSalvo();
    audioObj.currentTime = 0;
    audioObj.play().catch(err => console.log("Aguardando interação para reproduzir o som."));
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
    clearInterval(timerId);
    timerId = null;
    tempoRestante = cicloModos[indiceCicloAtual];
    atualizarDisplay();
}

function reiniciarSequenciaCompleta() {
    clearInterval(timerId);
    timerId = null;
    indiceCicloAtual = 0;
    tempoRestante = cicloModos[0];
    atualizarDisplay();
    atualizarIndicadores();
}

// Eventos do Pomodoro
if (botaoIniciarPausar) botaoIniciarPausar.addEventListener('click', alternarTimer);

if (botaoReiniciar) {
    botaoReiniciar.addEventListener('click', (evento) => {
        if (evento.detail === 2) {
            reiniciarSequenciaCompleta();
        } else if (evento.detail === 1) {
            reiniciarTimer();
        }
    });
}

if (botaoPular) {
    botaoPular.addEventListener('click', () => {
        clearInterval(timerId);
        timerId = null;
        avancarProximoCiclo();
    });
}

// Inicialização das exibições
atualizarDisplay();
atualizarIndicadores();

// ==========================================
// 3. CÓDIGO DAS CONFIGURAÇÕES (COM LOCALSTORAGE)
// ==========================================
{
    const toggleTema = document.getElementById('toggleTema');
    const rangeVolume = document.querySelector('.range-volume');
    const iconeSom = document.querySelector('.icone-som');
    const btnIdioma = document.querySelector('.botao-idioma');

    // Se estiver na tela de configurações, ajusta a barra para o valor salvo
    if (rangeVolume) {
        const volumeSalvo = carregarVolumeSalvo();
        rangeVolume.value = volumeSalvo;

        if (iconeSom) {
            iconeSom.textContent = volumeSalvo == 0 ? '🔇' : '🔊';
        }

        // Salva o novo valor no LocalStorage sempre que o usuário move o slider
        rangeVolume.addEventListener('input', (e) => {
            const valor = e.target.value;
            localStorage.setItem('volumePomodoro', valor);
            
            const volumeFloat = parseFloat(valor) / 100;
            alarme.volume = volumeFloat;
            concluir.volume = volumeFloat;

            if (iconeSom) {
                iconeSom.textContent = valor == 0 ? '🔇' : '🔊';
            }
        });

        // Testa o som ao soltar a barra
        rangeVolume.addEventListener('change', () => {
            tocarSom(alarme);
        });
    }

    // Alternar Tema
    if (toggleTema) {
        toggleTema.addEventListener('change', () => {
            const labelTema = toggleTema.closest('.opcao-item')?.querySelector('span');
            if (toggleTema.checked) {
                document.body.style.backgroundColor = '#333333';
                document.body.style.color = '#ffffff';
                if (labelTema) labelTema.textContent = 'Tema: Escuro';
            } else {
                document.body.style.backgroundColor = '#ffffff';
                document.body.style.color = '#333333';
                if (labelTema) labelTema.textContent = 'Tema: Claro';
            }
        });
    }

    // Alternar Idioma
    if (btnIdioma) {
        const textoIdioma = btnIdioma.querySelector('span:first-child');
        btnIdioma.addEventListener('click', () => {
            if (textoIdioma && textoIdioma.textContent.includes('ING')) {
                textoIdioma.textContent = 'POR';
            } else if (textoIdioma) {
                textoIdioma.textContent = 'ING';
            }
        });
    }
}
// ==========================================
// APLICAR TEMA SALVO (Roda em todas as páginas)
// ==========================================
function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('temaPomodoro') || 'escuro';
    const toggleTema = document.getElementById('toggleTema');
    const labelTema = toggleTema?.closest('.opcao-item')?.querySelector('span');

    // Elementos das imagens dos botões inferiores
    const imgPular = document.querySelector('#PularTempo img');
    const imgReiniciar = document.querySelector('#ReiniciarTempo img');

    if (temaSalvo === 'claro') {
        document.body.classList.add('tema-claro');
        if (toggleTema) toggleTema.checked = false;
        if (labelTema) labelTema.textContent = 'Tema: Claro';

        // Troca as imagens para a versão preta
        if (imgPular) imgPular.src = 'img/pular.png'; // Nome da sua imagem preta de pular
        if (imgReiniciar) imgReiniciar.src = 'img/reiniciar.png'; // Nome da sua imagem preta de reiniciar

    } else {
        document.body.classList.remove('tema-claro');
        if (toggleTema) toggleTema.checked = true;
        if (labelTema) labelTema.textContent = 'Tema: Escuro';

        // Volta as imagens para a versão branca
        if (imgPular) imgPular.src = 'img/pularW.png';
        if (imgReiniciar) imgReiniciar.src = 'img/reiniciarW.png';
    }
}

// Executa ao carregar a página
carregarTemaSalvo();

// Na seção das configurações:
{
    const toggleTema = document.getElementById('toggleTema');

    if (toggleTema) {
        toggleTema.addEventListener('change', () => {
            if (toggleTema.checked) {
                localStorage.setItem('temaPomodoro', 'escuro');
            } else {
                localStorage.setItem('temaPomodoro', 'claro');
            }
            // Aplica a mudança imediatamente
            carregarTemaSalvo();
        });
    }
}