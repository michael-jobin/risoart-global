uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uZoomScale;
uniform vec2 uImageRes;
uniform float uOpacity;

varying vec2 vUv;
varying float vElevation;
varying float vWaveInfluence;
varying float vInertia;

vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
  float rs = s.x / s.y; // Aspect screen size
  float ri = i.x / i.y; // Aspect image size
  vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
  vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset
  return u * s / st + o;
}

void main() {
  vec2 uv = CoverUV(vUv, uRes, uImageRes);
  vec3 tex = texture2D(uTex, uv).rgb;
  
    tex.rgb *= vElevation * 0.5 + 0.97;
    tex.rgb += vInertia * 0.2;
  
  gl_FragColor = vec4( tex, uOpacity );
}