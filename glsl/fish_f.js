const frag = /* glsl */`
uniform sampler2D uTexture;  // La texture koi.png
varying vec2 vUv;  // Coordonnées UV venant du vertex shader

void main() {
    vec4 color = texture2D(uTexture, vUv);  // Récupère la couleur de la texture
    gl_FragColor = color;  // Applique la couleur sur le fragment
}
`;

export default frag;