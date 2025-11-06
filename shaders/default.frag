#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

varying vec2 vTexCoord;
varying vec4 vColor;

uniform sampler2D tex0;
uniform bool uUseTexture;

void main() {
  vec4 color = vColor;
  if (uUseTexture) {
    vec4 texColor = texture2D(tex0, vTexCoord);
    color *= texColor;
  }
  gl_FragColor = color;
}