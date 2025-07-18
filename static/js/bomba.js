const fios = ["verde", "roxo", "amarelo", "laranja", "ciano"]

let arrayFios = []
let fioCortado;
let indiceArray = 0
let ordemGerada = ordemFios()
const dicasFio = gerarDicasFio(ordemGerada);
    function cortarFioVerde(texto) {
      reproduzirSomCorte()
      let imgFioVerde = document.getElementById('fioVerdeCortado')
      imgFioVerde.src = 'static/imagens/verde.png'
      fioCortado = 0
      document.getElementById('fioverde').onclick = null
      explodirBomba(fioCortado)
    }
    function cortarFioRoxo(texto) {
      reproduzirSomCorte()
      let imgFioRoxo = document.getElementById('fioRoxoCortado')
      imgFioRoxo.src = 'static/imagens/roxo.png'
      fioCortado = 1
      document.getElementById('fioroxo').onclick = null
      explodirBomba(fioCortado)
    }
    function cortarFioAmarelo(texto) {
      reproduzirSomCorte()
      let imgFioAmarelo = document.getElementById('fioAmareloCortado')
      imgFioAmarelo.src = 'static/imagens/amarelo.png'
      fioCortado = 2
      document.getElementById('fioamarelo').onclick = null
      explodirBomba(fioCortado)
    }
    function cortarFioLaranja(texto) {
      reproduzirSomCorte()
      let imgFioLaranja = document.getElementById('fioLaranjaCortado')
      imgFioLaranja.src = 'static/imagens/laranja.png'
      fioCortado = 3
      document.getElementById('fiolaranja').onclick = null
      explodirBomba(fioCortado)
    }
    function cortarFioCiano(texto) {
      reproduzirSomCorte()
      let imgFioCiano = document.getElementById('fioCianoCortado')
      imgFioCiano.src = 'static/imagens/ciano.png'
      fioCortado = 4
      document.getElementById('fiociano').onclick = null
      explodirBomba(fioCortado)
    }
        
    function ordemFios(){
      
      while (arrayFios.length < 5){
        let numeroAleatorio = Math.floor(Math.random() * 5)
        
        if (arrayFios.indexOf(numeroAleatorio) == -1){
          arrayFios.push(numeroAleatorio)
        }
        console.log(arrayFios)
        
      }
      return arrayFios;
    }
    
    function explodirBomba(fioCortado){
      let imagemBomba = document.getElementById('imagem1')
      
      if (ordemGerada[indiceArray] == fioCortado){
        
        indiceArray++
      } else{
        
        document.getElementById("imagem1").style.display = "none";
        clearInterval(intervalo)       
        pararSomTimer()
        document.getElementById("explosao").style.display = "block"
       
        reproduzirExpl()

        jogarNovamente.style.display = "inline-block";
        
        return;
      }
      if (indiceArray == ordemGerada.length){
        
        clearInterval(intervalo)
        pararSomTimer()
        reproduzirSomFinal()
        const emoji = document.getElementById("emoji");
        emoji.classList.remove("escondido");
        emoji.style.display = "block";
        document.getElementById("endmsg").style.display="block";
        jogarNovamente.style.display = "inline-block";
        const nome = prompt("Digite seu nome para salvar no ranking:")
        const tempoMaximo = 300
        const tempoRestante = tempo

        const pontuacao = calcularPontuacao(tempoMaximo, tempoRestante, nivel)
        const dificuldade = nivel

        if (nome) {
          salvarPontuacao(nome, pontuacao, dificuldade)
        }
       
                       
        return;
      }
    }
    
       
    
desativarFios()

