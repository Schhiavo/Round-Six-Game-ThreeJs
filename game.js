// Configuração da Cena
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderizador
const renderer = new THREE.WebGLRenderer();

// Tamanho da tela(largura, altura)
renderer.setSize(window.innerWidth, window.innerHeight);

// Linkando o Renderizador
document.body.appendChild(renderer.domElement);

// Modelo Boneca
const loader = new THREE.GLTFLoader();

// Carregando a arvore
loader.load("tree/scene.gltf", function (gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(16, 16, 16);
  gltf.scene.position.set(0, -6, -4);
});

// Criando Classe Player
class Player {
  constructor() {
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const player = new THREE.Mesh(geometry, material);
    scene.add(player);

    this.player = player;
    player.position.x = 3;
    player.position.y = 0;
    player.position.z = 0;

    this.playerInfo = {
      positionX: 6,
      velocity: 0,
    };
  }

  // Criando métodos anda, update e para
  anda() {
    this.playerInfo.velocity = 0.1;
  }
  update() {
    this.checa();
    this.playerInfo.positionX -= this.playerInfo.velocity;

    this.player.position.x = this.playerInfo.positionX;
  }
  para() {
    this.playerInfo.velocity = 0;
  }
  // Checa a condição de vitoria e derrota
  checa() {
    if (this.playerInfo.velocity > 0 && !tadecostas) {
      text.innerText = "Você Perdeu!";
      gamestatus = "fimdejogo";
    }
    if (this.playerInfo.positionX < -6) {
      text.innerText = "Você Ganhou!";
      gamestatus = "fimdejogo";
    }
  }
}

// função delay pra boneca
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Classe boneca
class boneca {
  constructor() {
    loader.load("model/scene.gltf", (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.4, 0.4, 0.4);
      gltf.scene.position.set(0, -1, -1);
      this.Boneca1 = gltf.scene;
    });
  }
  // Boneca vira pra trás
  praTras() {
    gsap.to(this.Boneca1.rotation, { y: -3.15, duration: 1 });
    setTimeout(() => (tadecostas = true), 450);
  }
  // Boneca vira pra frente
  praFrente() {
    gsap.to(this.Boneca1.rotation, { y: 0, duration: 1 });
    setTimeout(() => (tadecostas = false), 150);
  }

  // Inicia a movimentação da boneca, utilizando a biblioteca Math para usar numero aleatorio no delay
  async start() {
    this.praTras();
    await delay(Math.random() * 1000 + 1000);
    this.praFrente();
    await delay(Math.random() * 1000 + 1000);
    this.start();
  }
}

// criando player
let Player1 = new Player();

// criando boneca
let Boneca1 = new boneca();

// uma constante pra armazenar a classe da div do HTML
const text = document.querySelector(".text");

// uma constante que será usada como temporizador
const tmaximo = 10;

// varivel status do jogo
let gamestatus = "esperando";

// variavel status da boneca
let tadecostas = true;

// Inicia a contagem pra iniciar o game
async function init() {
  await delay(500);
  text.innerText = "Começando em 3";
  await delay(500);
  text.innerText = "Começando em 2";
  await delay(500);
  text.innerText = "Começando em 1";
  await delay(500);
  text.innerText = "VAI!";
  startGame();
}

// inicia a movimentação da boneca e o temporizador
function startGame() {
  gamestatus = "jogando";
  Boneca1.start();
  setTimeout(() => {
    if (gamestatus != "fimdejogo") {
      text.innerText = "Timeout!";
      gamestatus = "fimdejogo";
    }
  }, tmaximo * 1000);
}

init();

// adcionando brilho
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// adicionando cor de fundo e ajustando opacidade
renderer.setClearColor(0x8601af, 1);

// Configurando a profundidade da camera
camera.position.z = 5;

// loop de renderização
function animate() {
  if (gamestatus == "fimdejogo") return;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  Player1.update();
}
animate();

// ouvinte para quando a aba for diminuida
window.addEventListener(`resize`, onWindowResize, false);

// função responsiva que vai ajusar a tela
function onWindowResize() {
  camera.aespect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ouvinte pra tecla seta esquerda
window.addEventListener(`keydown`, function (e) {
  if (gamestatus != "jogando") return;
  if (e.keyCode == 37) {
    Player1.anda();
  }
});

// ouvinte pra parar quando o usuario soltar a tecla
window.addEventListener(`keyup`, function (e) {
  if (e.keyCode == 37) {
    Player1.para();
  }
});
