const frag = /* glsl */`
uniform sampler2D uTexture;  // La texture koi.png
uniform float uShadowOpacity;  // Opacité de l'ombre
uniform float uOpacity;
uniform vec2 uShadowOffset;    // Décalage de l'ombre
varying vec2 vUv;  // Coordonnées UV venant du vertex shader

void main() {
    // Ombre décalée
    vec2 shadowUv = vUv + uShadowOffset;  // Décalage de l'ombre
    vec4 shadowColor = texture2D(uTexture, shadowUv);  // Récupérer la texture décalée
    shadowColor.rgb *= vec3(0.0);  // Assombrir la couleur de l'ombre
    shadowColor.a *= uShadowOpacity;  // Appliquer l'opacité de l'ombre

    // Couleur du poisson principal
    vec4 fishColor = texture2D(uTexture, vUv);

        // Mélanger l'ombre et la couleur principale
        vec4 finalColor = mix(shadowColor, fishColor, fishColor.a);

        // Appliquer l'opacité
        finalColor.a *= uOpacity;  // Multiplier l'opacité finale par uOpacity
    

    // Mélanger l'ombre et la couleur principale
    gl_FragColor = finalColor;  // Renvoyer la couleur finale
}
`;

export default frag;