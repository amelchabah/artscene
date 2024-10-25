import * as THREE from 'three';
import vert from './glsl/fish_v.js';
import frag from './glsl/fish_f.js';
import bgVert from './glsl/bgkoi_v.js';
import bgFrag from './glsl/bgkoi_f.js';
import bgVert2 from './glsl/bgkoi_v2.js';
import bgFrag2 from './glsl/bgkoi_f2.js';
import { OverlayCanvas } from './OverlayCanvas.js';

// Charger les textures
const textureLoader = new THREE.TextureLoader();
const koiTexture = textureLoader.load('koi3bis.png');
// const bgTexture = textureLoader.load('bg.jpg');

const bgTexture = localStorage.getItem('theme') === 'light' ? textureLoader.load('bg.jpg') : textureLoader.load('bgnight.jpg');
const bgTexture2 = localStorage.getItem('theme') === 'light' ? textureLoader.load('bg2.png') : textureLoader.load('bg2night.png');
document.body.style.background = localStorage.getItem('theme') === 'light' ? 'white' : '#152229';
// const bgTexture2 = textureLoader.load('bg2.png');

// if localstorage theme is set to light, waterTexture is set to water.jpg, otherwise it's set to water2.jpg
// const waterTexture = textureLoader.load('water.jpg');

const waterTexture = localStorage.getItem('theme') === 'light' ? textureLoader.load('water.jpg') : textureLoader.load('water2.jpg');
const skyTexture = localStorage.getItem('theme') === 'light' ? textureLoader.load('sky.jpg') : textureLoader.load('sky2.jpg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Uniforms pour les shaders
const uniforms = {
    uTime: { value: 0 },
    uTexture: { value: koiTexture },
    uShadowOpacity: { value: 0.4 },  // Opacité de l'ombre (0 = invisible, 1 = totalement opaque)
    uShadowOffset: { value: new THREE.Vector2(0.05, 0.01) }  // Décalage de l'ombre
};

// Créer le matériau pour le poisson
const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: uniforms,
    transparent: true
});

// Créer un plan pour afficher le poisson
const planeGeometry = new THREE.PlaneGeometry(3, 3);
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

// Créer un grand plan pour le fond
const bgSize = { x: 20, y: 10 }

const overlayCanvas = new OverlayCanvas({
    bgSize,
    camera
});

const bgUniforms = {
    uTime: { value: 0 },
    uTexture: { value: bgTexture },
    uCanvasTexture: { value: overlayCanvas.canvasTexture },
    uSkyTexture: { value: skyTexture },
    uLightModeOffset: { value: 0 }
};

const bgUniforms2 = {
    uTime: { value: 0 },
    uTexture: { value: bgTexture2 },
    uWaterTexture: { value: waterTexture },
    uCanvasTexture: { value: overlayCanvas.canvasTexture },
    uLightModeOffset: { value: 0 }
};

// Créer le matériau pour le background
const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: bgFrag,
    uniforms: bgUniforms,
    transparent: true
});

const bgMaterial2 = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: bgFrag2,
    uniforms: bgUniforms2,
    transparent: true
});

const bgPlaneGeometry = new THREE.PlaneGeometry(bgSize.x, bgSize.y);
const bgPlaneGeometry2 = new THREE.PlaneGeometry(bgSize.x, bgSize.y);
const bgPlane = new THREE.Mesh(bgPlaneGeometry, bgMaterial);
const bgPlane2 = new THREE.Mesh(bgPlaneGeometry2, bgMaterial2);
bgPlane.position.z = -5;
bgPlane2.position.z = -5;
scene.add(bgPlane);
scene.add(bgPlane2);

overlayCanvas.setPlane(bgPlane);
overlayCanvas.setPlane(bgPlane2);

camera.position.z = 5;

// Variables pour le parallaxe
let mouseX = 0;
let mouseY = 0;

// Événement de mouvement de la souris
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1; // entre -1 et 1
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // entre -1 et 1
});

// Animation
let startTime = performance.now();

function animate() {
    const elapsedTime = (performance.now() - startTime) / 1000;

    // Rotation du poisson
    plane.rotation.z = elapsedTime * 0.2;

    // Mise à jour des uniformes
    uniforms.uTime.value = elapsedTime;
    // bgUniforms.uTime.value = elapsedTime;
    bgUniforms2.uTime.value = elapsedTime;

    // Effet de parallaxe
    bgPlane.position.x = mouseX * 0.2;
    bgPlane.position.y = mouseY * 0.2;
    plane.position.x = mouseX * 0.4;
    plane.position.y = mouseY * 0.4;
    bgPlane2.position.x = mouseX * 0.2;
    bgPlane2.position.y = mouseY * 0.2;

    // Rendu de la scène
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();



const modeButton = document.getElementById('modeButton');
if(!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
}

// Fonction pour mettre à jour la texture de l'eau
function updateWaterTexture() {
    const theme = localStorage.getItem('theme');
    const newWaterTexture = theme === 'light' ? textureLoader.load('water.jpg') : textureLoader.load('water2.jpg');
    const newSkyTexture = theme === 'light' ? textureLoader.load('sky.jpg') : textureLoader.load('sky2.jpg');
    const newBgTexture = theme === 'light' ? textureLoader.load('bg.jpg') : textureLoader.load('bgnight.jpg');
    const newBgTexture2 = theme === 'light' ? textureLoader.load('bg2.png') : textureLoader.load('bg2night.png');

    bgUniforms2.uLightModeOffset.value = theme === 'light' ? 1 : 4.;
    bgUniforms.uLightModeOffset.value = theme === 'light' ? 1 : 4.;
    bgUniforms2.uWaterTexture.value = newWaterTexture; // Mise à jour de l'uniforme
    bgUniforms.uSkyTexture.value = newSkyTexture;
    bgTexture.copy(newBgTexture);
    bgTexture2.copy(newBgTexture2);
}

// Initialisation de la texture de l'eau au chargement
updateWaterTexture();

// Écouteur pour le changement de thème
modeButton.addEventListener('click', () => {
    if (document.body.style.backgroundColor === 'white') {
        document.body.style.backgroundColor = '#090e14';
        modeButton.textContent = '🌚';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.style.backgroundColor = 'white';
        modeButton.textContent = '🌞';
        localStorage.setItem('theme', 'light');
    }

    // Recharger la texture de l'eau en fonction du thème actuel
    updateWaterTexture();
});

