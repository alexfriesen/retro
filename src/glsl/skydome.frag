uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {

    float h = normalize(vWorldPosition + offset).y;
    float w = normalize(vWorldPosition).x;
    gl_FragColor = vec4(
        mix(
            bottomColor, 
            topColor,
            max(h / exponent, 0.0)
        ),
        1.0
    );

}