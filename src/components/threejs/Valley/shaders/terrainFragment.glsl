varying float vElevation;
varying vec2 vUv;

uniform float uStep;
uniform sampler2D uTexture;
uniform float uTime;

vec3 hslToRgb(in vec3 hsl) {
    vec3 rgb = clamp( abs(mod(hsl.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return hsl.z + hsl.y * (rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
}

vec3 getRainbowColor() {
    // hue based on uv, shifted
    vec2 uv = vUv;
    uv.y += uTime * 0.05;
    float hue = cnoise(vec2(uv * 10.0)) + 0.2;
    // slight lightness variation
    float lightness = 0.5 + 0.25 * cnoise(vec2(vUv * 20.0 + 1234.5));
    vec3 rainbowColorHsl = vec3(hue, 1.0, lightness);
    vec3 rainbowColor = hslToRgb(rainbowColorHsl);
    return rainbowColor;
}

void main() {
    vec3 uColor = vec3(1.0, 1.0, 1.0);
    
    vec4 textureColor = texture2D(uTexture, vec2(0.0, vElevation * 5.0));
    vec3 rainbowColor = getRainbowColor();
    vec3 color = mix(uColor, rainbowColor, textureColor.r);
    
    gl_FragColor = vec4(color, textureColor.a);

    // float elevation = 0.75 + vElevation;
    // float alpha = mod(elevation * uStep, 1.0);
    // alpha = step(0.95, alpha);
    // gl_FragColor = vec4(elevation, elevation, elevation, alpha);

    // gl_FragColor = textureColor;

}