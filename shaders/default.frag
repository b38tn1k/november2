#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform sampler2D ambientTexture;
uniform sampler2D currentTexture;
uniform sampler2D fbmTexture;
uniform sampler2D staticFbmTexture;
uniform vec2 uResolution;
uniform float uTime;

uniform vec4 uChromaPlayer;
uniform vec4 uChromaTerrain;
uniform vec4 uChromaVegetation;
uniform vec4 uChromaStaticVegetation;
uniform vec4 uChromaCurrent;
uniform vec4 uChromaBackground;
uniform vec4 uChromaAmbient;
uniform vec4 uChromaEnemy;
uniform int skipTexture;

varying vec2 vTexCoord;

void main() {
  // texture coordinates from 0.0 to 1.0
  vec2 uv = vec2(vTexCoord.x, vTexCoord.y); 
  // RGBA pixel @ current uv
  vec4 color = texture2D(tex0, uv);
  // one step in texture coordinates given the resolution
  vec2 texel = 1.0 / uResolution; 
  // so we can see a neighbor pixel by going like this:
  vec4 neighbor = texture2D(tex0, uv + vec2(texel.x, texel.y));
  // becasue we have GL_CLAMP_TO_EDGE wrapping mode,
  // we don't have to worry about going out of bounds
  // so... vignette region-ing
  float vignetteAoi = 0.05;
  float borderX = smoothstep(vignetteAoi, 0.0, uv.x) + smoothstep(0.05, 0.0, 1.0 - uv.x);
  float borderY = smoothstep(vignetteAoi, 0.0, uv.y) + smoothstep(0.05, 0.0, 1.0 - uv.y);
  // but wouldnt that make the vingette different in pixels based on the screen size ratio? 



  gl_FragColor = color;
}

