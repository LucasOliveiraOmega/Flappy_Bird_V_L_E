console.log('[Lucas] Flappy_Bird'); //Feed back

let frames = 0;  //frames
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';  //Colocando Som de it

const som_Pulo = new Audio();
som_Pulo.src = './efeitos/pulo.wav';

const som_ponto = new Audio();
som_ponto.src = './efeitos/ponto.wav';

const som_caiu = new Audio();
som_caiu.src = './efeitos/caiu.wav';

const sprites = new Image();
sprites.src = './img/sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// Plano de Fundo
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

  // Chao
  function criaChao() {
    const chao = {
      spriteX: 0,
      spriteY: 610,
      largura: 224,
      altura: 112,
      x: 0,
      y: canvas.height - 112,
      atualiza() {   // atualiza a animação do Chao para mover
        const movimentoDoChao = 1;
        const repeteEm = chao.largura / 7; //o Chao vai repetir 
        const movimentacao = chao.x - movimentoDoChao;
  
       //console.log('[chao.x]', chao.x);
        // console.log('[repeteEm]',repeteEm);
        // console.log('[movimentacao]', movimentacao % repeteEm); pegamos o resto da divisão para o Chao andar no infinito e ser suave e não travar no meio
        
        chao.x = movimentacao % repeteEm;
      },
      desenha() {
        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          chao.x, chao.y,
          chao.largura, chao.altura,
        );
    
        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          (chao.x + chao.largura), chao.y,
          chao.largura, chao.altura,
        );
      },
    };
    return chao;
  }

  function fazColisao(flappyBird, chao) { //faz a Colisao com o chao
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
  
    if(flappyBirdY >= chaoY) {
      return true;
    }
    return false;
  }

  function criaFlappyBird() { //tamanho do recorte dos sprites numero
    const flappyBird = {
      spriteX: 0,
      spriteY: 0,
      largura: 33,
      altura: 24,
      x: 10,
      y: 50,
      pulo: 4.6,
      pula() {  //Sistema de pular 
        console.log('devo pular');
        console.log('[antes]', flappyBird.velocidade);
        flappyBird.velocidade =  - flappyBird.pulo;
        som_Pulo.play();       
        console.log('[depois]', flappyBird.velocidade);
      },
      gravidade: 0.25,
      velocidade: 0,
      atualiza() {   //gravidade do Flappy Bird

        if(fazColisao(flappyBird, globais.chao)) { //Colisao com chao
          console.log('Fez colisao');
          som_caiu.play();
  
          mudaParaTela(Telas.GAME_OVER); // Tela de Colisao
          return;
        }
        
    //gravidade
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
      },

      movimentos: [ //Sistema de Movimentação
        { spriteX: 0, spriteY: 0, }, // asa pra cima
        { spriteX: 0, spriteY: 26, }, // asa no meio 
        { spriteX: 0, spriteY: 52, }, // asa pra baixo
        { spriteX: 0, spriteY: 26, }, // asa no meio 
      ],

      frameAtual: 0,
      atualizaOFrameAtual() {     //controla o intervalo de tempo do frames do Flappy Bird no inicio
        const intervaloDeFrames = 10; //intervalo de frames
        const passouOIntervalo = frames % intervaloDeFrames === 0;
        // console.log('passouOIntervalo', passouOIntervalo)
  
        if(passouOIntervalo) {  
          const baseDoIncremento = 1;
          const incremento = baseDoIncremento + flappyBird.frameAtual;
          const baseRepeticao = flappyBird.movimentos.length;
          flappyBird.frameAtual = incremento % baseRepeticao
        }
          // console.log('[incremento]', incremento);
          // console.log('[baseRepeticao]',baseRepeticao);
          // console.log('[frame]', incremento % baseRepeticao);
      },
      
      desenha() {
        flappyBird.atualizaOFrameAtual();
        const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
  
        contexto.drawImage(
          sprites,
          spriteX, spriteY, // Sprite X, Sprite Y
          flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
          flappyBird.x, flappyBird.y,
          flappyBird.largura, flappyBird.altura,
        );
      }
    }
    return flappyBird;  
  }

// mensagem para iniciar o jogo
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 200,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// Tela Game Over
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 200,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  }
}

// 
// Canos
// 

function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,

    desenha() {

      canos.pares.forEach(function(par) { // Para cada par de canos vai desenha os valores
        
        const yRandom = par.y;
        const espacamentoEntreCanos = 125; //ele faz o espaçamentos entre os canos
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        // Cano do Céu cima
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // Cano do Chão baixo
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = { // Cano Ceu
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = { // Cano Chao
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },

    temColisaoComOFlappyBird(par) { // sistema de colisao dos Cano

      const cabecaDoFlappy = globais.flappyBird.y;  //o Flappy Bird invadio a area dos Cano que é Y
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura; // se o pê do Flappy Bird ou cabeca bateu no canao return true
                                  
      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) { //para verificar sê a cabeça invadio a area dos Cano DE CIMA
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {  //para verificar sê a pê  invadio a area dos Cano DE Chao
          return true;
        }
        else{
          som_ponto.play();
          console.log('pontos');
        }
      }
      return false;
    },
    pares: [],
    
    atualiza() { // e uma lista de canos desenhados na tela
      const passou100Frames = frames % 100 === 0; //passou 100 frames para desenhar um novo cano 
      if(passou100Frames) {
        console.log('Passou 100 frames');
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),  //Math.random gera valores aleatorios
        });
      }



      canos.pares.forEach(function(par) { //pra sempre deslocar 2px para cada vez for atualizado a tela
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)) { // Colisao dos canos com o Flappy Bird
          console.log('Você perdeu!')
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if(par.x + canos.largura <= 0) { //para remover os canos para nao encher a menoria de usuario
          canos.pares.shift();
        }
      });

    }
  }

  return canos;
}

//Placar do jogo 
function criaPlacar() {
  const placar = {
    pontuacao: 0,
    desenha() { // ele faz aparecer a pontuação na tela
      contexto.font = '35px "VT323"'; //Ele faz Renderizar na tela a pontuação
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);  // muda o espaçamento na tela    
    },
    atualiza() { //ele atualiza os frames no intervalo tempo
      const intervaloDeFrames = 100;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo) { //intevalo dos frames pegando o resto da divisão
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}

// 
// Telas
// 

const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

//Tela INICIO
const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

//Tela JOGO
Telas.JOGO = {
  inicializa() {
    globais.placar = criaPlacar(); // Placar do jogo
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  }
};

//Tela GAME OVER
Telas.GAME_OVER = {
  desenha() {
    mensagemGameOver.desenha();
  },
  atualiza() {
    
  },
  click() {
    mudaParaTela(Telas.INICIO);
  }
}

// os quadros do jogo loop
function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

/* 
window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});
*/

function handleUserInput() {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
}

window.addEventListener('click', handleUserInput);
window.addEventListener('touchstart', handleUserInput);

mudaParaTela(Telas.INICIO);
loop()