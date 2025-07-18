
let intervalo
let tempo = 300
const somTimer = new Audio("static/sons/somTimer.mp3")
function ouvirTimer(){
    somTimer.loop=true
    somTimer.play()
}
function pararSomTimer(){
    somTimer.pause()
}
function inicioTimer(botao){
    botao.classList.add("oculto")
    ouvirTimer()
    const timerDisplay = document.getElementById("timer-display")
    mostrarDesafio("desafio1")
    document.getElementById("bDesafio1").classList.remove("oculto");

    intervalo = setInterval(() => {
        const minutos = Math.floor(tempo/60)
        const segundos = tempo % 60
        timerDisplay.innerHTML = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        ativarFios()
    if (tempo <= 0) {
        clearInterval(intervalo);
        pararSomTimer()
        reproduzirExpl()
        document.getElementById("imagem1").style.display = "none";
        document.getElementById("explosao").style.display = "block"
        document.getElementById("bReiniciar").style.display = "inline-block";
        
    }
    tempo--
}, 1000); // 1000 ms = 1 segundo
}

