export const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}
`;

// Não há uniform, cálculo ou caminho de execução para ponteiro, toque ou hover.
export const fragment = /* glsl */ `
precision highp float;
uniform sampler2D tScene;
uniform vec4 uCrop;
uniform vec3 uWater;
uniform vec2 uImageSize;
uniform float uProgress;
uniform float uDebug;
varying vec2 vUv;

void main(){
  vec2 imageUv=vec2(uCrop.x+vUv.x*uCrop.z,1.-uCrop.y-(1.-vUv.y)*uCrop.w);
  vec2 topUv=vec2(imageUv.x,1.-imageUv.y);
  float boundary=uWater.y+max(0.,topUv.x-uWater.x)*uWater.z;
  // Margem conservadora: a pedra seca e o pavilhão jamais entram na refração.
  float water=smoothstep(boundary+.008,boundary+.025,topUv.y);
  float phase=uProgress*3.14159265;
  float activity=sin(phase)*sin(phase);
  float front=mix(uWater.y+.035,.98,smoothstep(.05,.95,uProgress));
  float band=exp(-pow((topUv.y-front)/.16,2.));
  float wave1=sin(topUv.x*24.+topUv.y*11.-uProgress*7.);
  float wave2=sin(topUv.x*41.-topUv.y*19.+uProgress*4.2);
  vec2 normal=vec2(cos(topUv.x*24.+topUv.y*11.-uProgress*7.)*.48, wave1*.6+wave2*.28);
  vec2 offset=normal*water*band*activity*.0032;
  // Todas as amostras também ficam no lado aquático da margem.
  float safe=max(0.,topUv.y-boundary-.025);
  offset.y=clamp(offset.y,-safe*.4,safe*.4);
  vec3 color=texture2D(tScene,clamp(imageUv+vec2(offset.x,-offset.y),.001,.999)).rgb;
  float glint=max(0.,wave1*.6+wave2*.4)*water*band*activity;
  color+=vec3(.025,.043,.027)*glint;
  if(uDebug>.5) color=mix(color,vec3(.97,.3,.12),water*.6);
  // A borda inferior, sempre na água, perde a ondulação ao encontrar a moldura.
  float edge=activity*.008*(.55+.45*sin(vUv.x*11.+uProgress*3.));
  float alpha=smoothstep(edge,edge+.0015,vUv.y);
  gl_FragColor=vec4(color,alpha);
}
`;
