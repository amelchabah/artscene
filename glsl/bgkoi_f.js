const background_chien = /* glsl */ `
uniform sampler2D uTexture;  // Texture de fond (bg.jpg)
uniform float uTime;  // Temps pour animer
varying vec2 vUv;  // Coordonnées UV venant du vertex shader
uniform sampler2D uCanvasTexture; // Texture de l'effet de survol

void main() {
    // Créer une déformation de la texture avec des vagues basées sur un noise sinusoïdal
    vec2 uv = vUv;

    // Perturber les coordonnées UV avec des ondes sinusoïdales pour l'effet de vagues
    uv.x += sin(uv.y * 10.0 + uTime) * 0.05;
    uv.y += cos(uv.x * 10.0 + uTime) * 0.05;

    // Appliquer la texture de fond avec les coordonnées UV déformées
    vec4 color = texture2D(uTexture, uv);

    // Appliquer la texture canvas lors du survol
    vec4 canvasTexture = texture2D(uCanvasTexture, uv);
    // vec4 blueOverlay = vec4(0.,0.,1.,1.);
    vec4 redOverlay = vec4(0.,0.5,0.6,1.);

    // Mélanger les couleurs lors du hover
    vec4 finalColor = mix(color, redOverlay * color, canvasTexture.r);

    gl_FragColor = finalColor;
}
`;

export default background_chien;