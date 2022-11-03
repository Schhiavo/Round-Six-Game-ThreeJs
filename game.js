// Configuração da Cena 
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Renderizador
const renderer = new THREE.WebGLRenderer();

// Tamanho da tela(largura, altura)
renderer.setSize(window.innerWidth, window.innerHeight);

// Linkando o Renderizador
document.body.appendChild(renderer.domElement);

// Modelo Boneca
const loader = new THREE.GLTFLoader();

// Carregando a arvore
loader.load("tree/scene.gltf", function(gltf){
    scene.add(gltf.scene);
    gltf.scene.scale.set(16, 16, 16);
    gltf.scene.position.set(0, -6, -2);
})

// Criando Classe Player
class Player{
    constructor(){
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        const player = new THREE.Mesh(geometry, material);
        scene.add(player);
        
        this.player = player;
        player.position.x = 3;
        player.position.y = 0;
        player.position.z = 0;

        this.playerInfo = {
           positionX: 6,
           velocity: 0
        }
    }

    // Criando métodos anda, update e para
    anda(){
       this.playerInfo.velocity = 0.1; 
    }
    update(){
        this.playerInfo.positionX -= this.playerInfo.velocity;

        this.player.position.x= this.playerInfo.positionX
    }
    para(){
        this.playerInfo.velocity = 0;
    }
}


// Classe boneca
class boneca{
    constructor(){
        loader.load("model/scene.gltf", (gltf)=>{
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4, 0.4, 0.4);
            gltf.scene.position.set(0, -1, 0);
            this.Boneca1 = gltf.scene;
        })
    }
    // Boneca vira pra trás
    praTras(){
        gsap.to(this.Boneca1.rotation, {y: -3.15, duration: 1});
    }
    // Boneca vira pra frente
    praFrente(){
        gsap.to(this.Boneca1.rotation, {y: 0, duration: 1});
    }
}

// criando player
let Player1 = new Player();

// criando boneca
let Boneca1 = new boneca();

// temporizador 
setTimeout(()=>{
    Boneca1.praTras}, 1000);

// adcionando brilho
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// adicionando cor de fundo e ajustando opacidade
renderer.setClearColor(0x8601af, 1);

// Configurando a profundidade da camera
camera.position.z = 5;

// loop de renderização
function animate(){
    requestAnimationFrame(animate); 
    renderer.render(scene, camera);
    Player1.update();
}
animate();

// ouvinte para quando a aba for diminuida
window.addEventListener(`resize`, onWindowResize, false);

// função responsiva que vai ajusar a tela 
function onWindowResize(){
    camera.aespect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ouvinte pra tecla seta esquerda
window.addEventListener(`keydown`, function(e){
    if(e.keyCode == 37){
      Player1.anda();
    }
})

// ouvinte pra parar quando o usuario soltar a tecla
window.addEventListener(`keyup`, function(e){
    if(e.keyCode == 37){
      Player1.para();
    }
})