
//ver Deasfio func sortearPalavra para definir qual lista manter/facil ou nao
const somErro = new Audio("static/sons/somErro.mp3")
const somExplosao = new Audio("static/sons/somExpl.mp3")
const somAplauso = new Audio("static/sons/aplausos.mp3")
const somCorte = new Audio("static/sons/somCorte.mp3")
const somFinal = new Audio("static/sons/somFinal.mp3")

//LISTAS de palavras EXCLUIDAS para integrar os dados pelo BACK com FLASK
function reproduzirSomErro(){
  somErro.play()
}
function reproduzirExpl(){
  setTimeout(()=>{//faz um delay definido pelo tempo a seguir(em miliseg.)
  
    somExplosao.play()
  },2350)
  
}
function reproduzirAplausos(){
  somAplauso.play()
}

function reproduzirSomCorte(){
  somCorte.play()
}
function reproduzirSomFinal(){
  somFinal.play()
}

// mudando ONCLICK por addEventListener:
document.addEventListener("DOMContentLoaded", function() {
    // Listeners de botões
    document.getElementById("bDesafio1").addEventListener("click", sortearPalavra);
    document.getElementById("verResposta").addEventListener("click", verificarRespostaPalavra);
    document.getElementById("bCalculos").addEventListener("click", mostrarCalculo);
    document.getElementById("resultadoCalculo").addEventListener("click", verificarCalculo);
    document.getElementById("bNumeros").addEventListener("click", mostrarAdivinhaNum);
    document.getElementById("bResultadoPalpite").addEventListener("click", verificarPalpite);
    document.getElementById("bDesafio4").addEventListener("click", criarQuadrados);
    document.getElementById("bIniciarSequencia").addEventListener("click", iniciarSequenciaCores);
    document.getElementById("btnLimparCores").addEventListener("click", function(){
      limparCores()
});
    document.getElementById("verRespostaSequencia").addEventListener("click", function(){
      verificarCoresUsuario();
    });
    document.getElementById("bDesafio4").addEventListener("click", () => {
  // Esconde o botão
  document.getElementById("bDesafio4").classList.add("oculto");
  document.getElementById("bDesafio4").classList.remove("visivel");

  // Mostra o conteúdo do desafio 4
  document.getElementById("quadrados").classList.remove("oculto");
  document.getElementById("quadrados").classList.add("visivel");
  const quadradoMaior = document.getElementById("quadradoMaior");
  quadradoMaior.classList.add("visivel");
});
  ativarEnter("respostaPalavra", "verResposta");
  ativarEnter("conta", "resultadoCalculo");
  ativarEnter("palpiteNumSort", "bResultadoPalpite");
    
});



function mostrarDesafio(idDesafio) {
  // Seleciona todos os elementos com a classe 'desafio'
  const desafios = document.querySelectorAll('.desafio');
  
  desafios.forEach(desafio => {
    if (desafio.id === idDesafio) {
      desafio.classList.add('ativo');   // Mostra o desafio atual
    } else {
      desafio.classList.remove('ativo'); // Esconde os demais
    }
  });
}
function ativarEnter(inputId, botaoId) {
  const input = document.getElementById(inputId);
  const botao = document.getElementById(botaoId);

  if (input && botao) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        botao.click();
      }
    });
  }
}
  
function gerarDicasFio(ordemGerada){
  const dicasFio = Array(5);
  const posicoes = ["primeiro", "segundo", "antepenúltimo", "penúltimo", "último"]
  ordemGerada.forEach((indiceCor, i) => {
    const cor = fios[indiceCor].toUpperCase();
    dicasFio[indiceCor] = `${cor} É O ${posicoes[i].toUpperCase()} FIO A SER CORTADO.`;
  });
  
  return dicasFio;
}

  
  
function embaralharLetras(str){    
  const arr = str.split("");
  for (let i = arr.length-1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  
  return arr.join("")
}
  
function desativarFios(){
  document.getElementById("fioverde").onclick = null;
  document.getElementById("fioroxo").onclick = null;
  document.getElementById("fioamarelo").onclick = null;
  document.getElementById("fiolaranja").onclick = null;
  document.getElementById("fiociano").onclick = null;
  
  }
function ativarFios(){
  
  document.getElementById('fioverde').onclick = () => cortarFioVerde("Cortou o fio verde!");
  document.getElementById('fioroxo').onclick = () => cortarFioRoxo("Cortou o fio roxo!");
  document.getElementById('fioamarelo').onclick = () => cortarFioAmarelo("Cortou o fio amarelo!");
  document.getElementById('fiolaranja').onclick = () => cortarFioLaranja("Cortou o fio laranja!");
  document.getElementById('fiociano').onclick = () => cortarFioCiano("Cortou o fio ciano!");
}
async function verificarRespostaPalavra(){
  const input = document.getElementById("respostaPalavra")
  const resposta = input.value
  input.value = "";
  
  try {
      const response = await fetch('/validar_resposta', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              resposta: resposta,
              palavra_atual: palavraOriginal // Variável que você já tem no front
          })
      });
        const resultado = await response.json();
        document.getElementById("resultado").textContent = resultado.mensagem;

        if (resultado.acerto){
          reproduzirAplausos()
          mostrarDesafio("desafio2");
          document.getElementById("bCalculos").classList.remove("oculto");
          document.getElementById("dicaFio1").textContent = dicasFio[0]
    
        }else{
          reproduzirSomErro()
          tempo -= 10
          sortearPalavra()
        }
} catch (error) {
        console.error('Erro:', error);
        document.getElementById("resultado").textContent = "Erro ao validar resposta";
}
}
function mostrarRegrasJogo(){
  const regrasJogo = document.getElementById("regrasJogo")
  regrasJogo.classList.toggle("visivel");
  
}


async function verificarCalculo() {
  const input = document.getElementById("conta");
  const respostaUsuario = parseFloat(input.value);
  input.value = "";

  try {
    const response = await fetch("/validar_calculo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        resposta_usuario: respostaUsuario,
        desafio: desafioAtual
      })
    });

    const resultado = await response.json();
    const resultadoCalc = document.getElementById("resultadoCalc");

    if (resultado.acerto) {
      resultadoCalc.textContent = `Parabéns. Matemática é com você!\nDica está acima da bomba\n`;
      reproduzirAplausos();
      mostrarDesafio("desafio3");
      document.getElementById("bNumeros").classList.remove("oculto");
      document.getElementById("dicaFio2").textContent = dicasFio[1];
    } else {
      resultadoCalc.textContent = `Resposta errada. Você perdeu 10 segundos.\nRespire fundo e tente novamente`;
      tempo -= 10;
      reproduzirSomErro();
      mostrarCalculo(); // gera novo desafio
    }
  } catch (erro) {
    console.error("Erro ao verificar cálculo:", erro);
    document.getElementById("resultadoCalc").textContent = "Erro de conexão.";
  }
}


const cores = ["red", "blue", "green", "yellow", "purple"]
const sequenciaCores = []

const areaQuadrados = document.getElementById("areaQuadrados") 
const coresUsuario =[]
let tamanhoSequencia = 5;

if (nivel === "medio") {
  tamanhoSequencia = 6;
} else if (nivel === "dificil") {
  tamanhoSequencia = 7;
}


function criarQuadrados(){
  areaQuadrados.innerHTML=""
  for (let linha = 0; linha < cores.length; linha++){
    const celulas = document.createElement("div");
    const cor = cores[linha];
    celulas.classList.add("celulas")
    areaQuadrados.appendChild(celulas)
    celulas.style.backgroundColor = cor
    celulas.dataset.cor = cor
    celulas.addEventListener("click", () => {
      
        coresUsuario.push(cor);
        const quadrado = document.getElementById("quadradoMaior");
        quadrado.style.backgroundColor = cor;

  // Depois de 00ms, volta para branco (ou qualquer cor neutra)
        setTimeout(() => {
        quadrado.style.backgroundColor = "white";
  }, 200);
}); // salva clique
   
  }
document.getElementById("quadrados").classList.remove("oculto");
document.getElementById("quadradoMaior").classList.remove("oculto");
document.getElementById("bDesafio4").classList.add("oculto");
}


function iniciarSequenciaCores(){
  const quadrado = document.getElementById("quadradoMaior");
  quadrado.classList.remove("oculto");
  let indice = 0;
  sequenciaCores.length = 0; // limpa antes
  

  let intervaloCor = setInterval(() => {
    if (indice >= tamanhoSequencia) {
      clearInterval(intervaloCor);
      quadrado.style.backgroundColor = "white"; // volta ao normal
      return;
    }
    const cor = cores[Math.floor(Math.random() * cores.length)];
    sequenciaCores.push(cor);
    quadrado.style.backgroundColor = cor;
    setTimeout(() => {
      quadrado.style.backgroundColor = "white";
    }, 300);
    indice++;
  }, 700);
}
function verificarCoresUsuario(){
  const resultado = document.getElementById("resultadoSequencia");
  const acertou = JSON.stringify(coresUsuario) === JSON.stringify(sequenciaCores);
  if (acertou){
    resultado.textContent = `Já é possível desarmar a bomba. Boa sorte!`
    reproduzirAplausos()
    document.getElementById("dicaFio4").textContent = dicasFio[3]
    
  }else{
    resultado.textContent = "Sequencia errada. Voce perdeu 10 segundos. Verifique o timer e tente novamente"
    tempo -= 10
    reproduzirSomErro()
    //iniciarSequenciaCores()

  }


  coresUsuario.length = 0;
}
function limparCores(){
  coresUsuario.length = 0
  const resultado = document.getElementById("resultadoSequencia");
  resultado.textContent = "Tentativa reiniciada. Clique nas cores novamente"
}

//PARA REINICIAR JOGO
const jogarNovamente = document.createElement("button")
jogarNovamente.textContent = "Jogar Novamente"
jogarNovamente.style.display="none"
jogarNovamente.id = "bReiniciar"
jogarNovamente.addEventListener("click", () => {
window.location.href = "/reiniciar"; // Recarrega a página
});

document.querySelector(".painelDesafios").appendChild(jogarNovamente);

//Placar
function calcularPontuacao(tempoMaximo, tempoRestante, nivelAtual) {
  // Base da pontuação: quanto mais tempo sobrar, maior a pontuação
  let base = tempoRestante / tempoMaximo;  // valor entre 0 e 1

  // Multiplicador por dificuldade
  let multiplicador = 1;
  if (nivelAtual === 'facil') multiplicador = 1;
  else if (nivelAtual === 'medio') multiplicador = 1.5;
  else if (nivelAtual === 'dificil') multiplicador = 2;

  // Calcula a pontuação final como inteiro
  let pontos = Math.floor(base * 1000 * multiplicador);

  return pontos;  // Exemplo: 0 a 2000 pontos
}


function salvarPontuacao(nome, pontuacao, dificuldade) {
    fetch('/salvar_pontuacao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome,
        pontuacao: pontuacao,
        dificuldade: dificuldade
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status) {
        console.log(data.status)
        alert("Pontuação salva com sucesso!")
        // Redirecionar para o ranking, se quiser
        window.location.href = "/ranking"
      } else {
        alert("Erro ao salvar pontuação: " + (data.erro || "Erro desconhecido."))
      }
    })
    .catch(error => {
      console.error("Erro na requisição:", error)
      alert("Erro de comunicação com o servidor.")
    })
  }