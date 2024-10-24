const background_v2 = /* glsl */ `
uniform float uTime;  // Temps pour animer l'effet de vagues
varying vec2 vUv;     // Coordonnées de texture

void main() {
    vUv = uv;  // Passer les coordonnées UV au fragment shader

    // Appliquer un noise sinusoïdal pour déplacer légèrement les positions des sommets
    vec3 pos = position;

    // Appliquer des vagues sinusoïdales pour déformer le plan en fonction de x, y et du temps
    pos.z += sin(pos.x * 3.0 + uTime * 2.0) * 0.15;  // Vagues horizontales
    pos.z += sin(pos.y * 3.0 + uTime * 1.5) * 0.15;  // Vagues verticales

    // Calculer la position finale du sommet
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

`;

export default background_v2;