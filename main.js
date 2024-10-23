import * as THREE from 'three';
import vert from './glsl/fish_v.js';  
import frag from './glsl/fish_f.js';  
import bgVert from './glsl/bgkoi_v.js';  
import bgFrag from './glsl/bgkoi_f.js';  
import { OverlayCanvas } from './OverlayCanvas.js';

// Charger les textures
const textureLoader = new THREE.TextureLoader();
const koiTexture = textureLoader.load('koi3.png');  
const bgTexture = textureLoader.load('bg.jpg'); 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// Uniforms pour les shaders
const uniforms = {
    uTime: { value: 0 },  
    uTexture: { value: koiTexture }  
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
    uCanvasTexture: { value: overlayCanvas.canvasTexture }
};

// Créer le matériau pour le background
const bgMaterial = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: bgFrag,
    uniforms: bgUniforms,
    transparent: true  
});

const bgPlaneGeometry = new THREE.PlaneGeometry(bgSize.x, bgSize.y);
const bgPlane = new THREE.Mesh(bgPlaneGeometry, bgMaterial);
bgPlane.position.z = -5;  
scene.add(bgPlane);

overlayCanvas.setPlane(bgPlane);

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
    bgUniforms.uTime.value = elapsedTime;

    // Effet de parallaxe
    bgPlane.position.x = mouseX * 0.3; 
    bgPlane.position.y = mouseY * 0.3; 
    plane.position.x = mouseX * 0.4; 
    plane.position.y = mouseY * 0.4; 

    // Rendu de la scène
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();