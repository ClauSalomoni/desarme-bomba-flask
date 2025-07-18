
let palavraOriginal = ""

async function sortearPalavra() {
  try {
    const resposta = await fetch("/palavra_aleatoria");
    const dados = await resposta.json();
    
    const dica = dados.dica;
    palavraOriginal = dados.palavra
  
    let palavraMisturada = embaralharLetras(palavraOriginal);
    while(palavraMisturada.toLowerCase() === palavraOriginal.toLocaleLowerCase()){
      palavraMisturada = embaralharLetras(palavraOriginal)
    }
  
  document.getElementById("palavra").style.display = "block"
  document.getElementById("dica-palavra").textContent = `${dica}`
  document.getElementById("palavra-embaralhada").textContent = `${palavraMisturada.toUpperCase()}`
  document.getElementById("bDesafio1").style.display = "none"
  document.getElementById("respostaPalavra").focus();
  } catch (error) {
    console.error("Erro ao buscar palavra:", error);
    document.getElementById("dica-palavra").textContent = "Erro ao carregar palavra";
  }
}
window.sortearPalavra = sortearPalavra;

let desafioAtual = null
function mostrarCalculo(){
  const n1 = Math.floor(Math.random() * 100)
  const n2 = Math.floor(Math.random() * 10) + 1
  const n3 = Math.floor(Math.random() * 10) + 1
  let operacoesDisponiveis;
  if(nivel === 'facil'){
    operacoesDisponiveis = ['+', '-'];
  } else if(nivel === 'medio'){
    operacoesDisponiveis = ['+', '-', '*'];
  } else if(nivel === 'dificil'){
    operacoesDisponiveis = ['+', '-', '*', '/'];
  } else {
    operacoesDisponiveis = ['+', '-']; // fallback
  }
  const operacao1 = operacoesDisponiveis[Math.floor(Math.random()*operacoesDisponiveis.length)];
  let operacao2 = null;
  document.getElementById("calculo").style.display = "block";
  document.getElementById("bCalculos").style.display = "none"

  
  
  if (nivel === 'facil') {
    let a = n1, b = n2;

    if (operacao1 === '/') {
      // divisão segura
      b = Math.floor(Math.random() * 9) + 1; // de 1 a 9
      a = b * (Math.floor(Math.random() * 10) + 1); // múltiplo de b
    }
    desafioAtual = {
      nivel: 'facil',
      a1: a,
      b1: b,
      operacao1: operacao1
    };

    document.getElementById("labelConta").textContent = `Calcule: ${a} ${operacao1} ${b}:`;
    
  } else {
    const operacao2 = operacoesDisponiveis[Math.floor(Math.random() * operacoesDisponiveis.length)];

    let a1 = n1, b1 = n2;
    let a2 = null, b2 = n3;

    if (operacao1 === '/') {
      b1 = Math.floor(Math.random() * 9) + 1;
      a1 = b1 * (Math.floor(Math.random() * 10) + 1);
    }

    if (operacao2 === '/') {
      b2 = Math.floor(Math.random() * 9) + 1;
      a2 = b2 * (Math.floor(Math.random() * 10) + 1);
      
    } 
    desafioAtual = {
      nivel: nivel,
      a1: a1,
      b1: b1,
      operacao1: operacao1,
      operacao2: operacao2,
      a2: a2,
      b2: b2
    };
    document.getElementById("labelConta").textContent =
      `Calcule: (${a1} ${operacao1} ${b1}) ${operacao2} ${b2}:`;
    }
  document.getElementById("conta").focus();
}  

// mudanças

async function mostrarAdivinhaNum() {
  try {
    const resposta = await fetch('/iniciar_adivinha', { method: 'POST' });
    const dados = await resposta.json();
    document.getElementById("numeroSorteadoRegras").textContent = dados.msg;
    registroPalpite = [];
    document.getElementById("registroPalpites").textContent = "";
    
    document.getElementById("desafio3").style.display = "block";
    document.getElementById("numeros").style.display = "block";
    document.getElementById("bNumeros").style.display = "none";
    document.getElementById("palpiteNumSort").focus();
  } catch (error) {
    console.error('Erro ao iniciar adivinha:', error);
  }
}

async function verificarPalpite() {
  const input = document.getElementById("palpiteNumSort");
  const palpiteUsuario = parseInt(input.value);
  input.value = "";
  const resultado = document.getElementById("resultadoPalpite");

  try {
    const resposta = await fetch('/validar_palpite', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ palpite: palpiteUsuario })
    });
    const dados = await resposta.json();

    if (dados.erro) {
      resultado.textContent = dados.erro;
      return;
    }

    registroPalpite = dados.registro;
    document.getElementById("registroPalpites").textContent = `Números já digitados: ${registroPalpite.join(", ")}`;

    if (dados.acertou) {
      resultado.textContent = dados.mensagem;
      reproduzirAplausos();
      document.getElementById("dicaFio3").textContent = dicasFio[2];
      mostrarDesafio("desafio4");
      document.getElementById("desafio3").style.display = "none";
      document.getElementById("quadrados").classList.add("oculto");
      document.getElementById("bDesafio4").classList.remove("oculto");
      document.getElementById("bDesafio4").classList.add("visivel");
    } else {
      resultado.textContent = dados.mensagem;
    }
  } catch (error) {
    console.error('Erro ao validar palpite:', error);
    resultado.textContent = "Erro na comunicação com o servidor.";
  }

  document.getElementById("palpiteNumSort").focus();
}

let registroPalpite = [];


function iniciarSequenciaCores(){
  const quadrado = document.getElementById("quadradoMaior");
  quadrado.style.display="block"
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
    }, 400);
    indice++;
  }, 700);
}

