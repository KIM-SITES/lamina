export const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

export const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tScene;
uniform sampler2D tDetail;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uDetailSize;
uniform vec2 uPointer;
uniform float uPosition;
uniform float uProgress;
uniform float uTime;
uniform float uEnergy;
uniform float uStrength;
uniform float uWidth;
uniform float uWave;
uniform float uHighlight;
varying vec2 vUv;

vec2 cover(vec2 uv, vec2 imageSize) {
  float screenAspect = uResolution.x / uResolution.y;
  float imageAspect = imageSize.x / imageSize.y;
  vec2 ratio = vec2(min(screenAspect / imageAspect, 1.0), min(imageAspect / screenAspect, 1.0));
  return (uv - 0.5) * ratio + 0.5;
}
float waves(vec2 p) {
  return sin(p.x * 16.0 + p.y * 9.0 + uTime * .9) * .45
    + sin(p.x * 28.0 - p.y * 13.0 - uTime * .61) * .28
    + sin(p.x * 53.0 + p.y * 19.0 + uTime * .37) * .17;
}
void main() {
  vec2 uv = vUv;
  float moving = .20 + .80 * uEnergy;
  float front = mix(-.24, 1.26, uProgress);
  float center = mix(uPosition, front, smoothstep(.0, .34, uProgress));
  float boundary = center + waves(vec2(uv.x, 0.0)) * uWave * moving;
  float width = mix(uWidth, .48, smoothstep(.05, .95, uProgress));
  float distanceToLine = uv.y - boundary;
  float envelope = exp(-pow(distanceToLine / width, 2.0) * 4.0);
  float wave = waves(uv);
  float pointerDistance = length((uv - uPointer) * vec2(uResolution.x / uResolution.y, 1.0));
  float ripple = sin(pointerDistance * 42.0 - uTime * 2.2) * exp(-pointerDistance * 7.0) * uEnergy;
  vec2 bend = vec2(wave * .32 + ripple * .5, sin(distanceToLine / width * 3.4) + wave * .38);
  vec2 refracted = clamp(uv + bend * envelope * uStrength * (.7 + moving * .3), .001, .999);
  vec2 sceneUv = cover(refracted, uImageSize);
  // Mantém a mesma câmera e o mesmo recorte do <picture>, sem salto na inicialização.
  vec3 scene = texture2D(tScene, sceneUv).rgb;
  vec3 detail = texture2D(tDetail, cover(refracted, uDetailSize)).rgb;
  // A água revela o detalhe a partir da lâmina; evita dupla exposição global.
  float dissolve = 1.0 - smoothstep(front - .045, front + .045, uv.y + waves(uv) * .006);
  vec3 color = mix(scene, detail, dissolve);
  float crest = exp(-pow((distanceToLine + width * .26) / (width * .16), 2.0));
  color += vec3(.60, .79, .69) * crest * uHighlight * (.45 + .55 * moving);
  color *= 1.0 - envelope * .035;
  gl_FragColor = vec4(color, 1.0);
}`;
