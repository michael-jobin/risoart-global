uniform float uTime;
uniform float uSpeed;
uniform vec2 uFrequency;
uniform float uElevationScale;
uniform float uElevationExponent;
uniform vec2 uRes;
uniform float uHeight;
uniform float uProgress;
uniform vec2 uZoomScale;
varying vec2 vUv;
varying float vElevation;
varying float vInertia;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // elevation when scroll 
  float modulation = smoothstep(0.0, 4.0, -modelPosition.y + 1.);
  // modelPosition.z += sin(modelPosition.y * 1. + uHeight) * uElevationScale * 0.5;
  float elevation = sin(modelPosition.y + uHeight) * uElevationScale * modulation;
    modelPosition.z += elevation;

  // zoom in deformation
  float angle = uProgress * 3.14159265 / 2.;
  float wave = cos(angle);
  //float c = sin(length(uv - .5) * 15. + uProgress * 12.) * .5 + .5;
  float c = sin(length(uv - .5) * 4. + uProgress) * modulation;
  //float c = sin(length(uv - .5) * 4. + uProgress) * .5 + .5;
  modelPosition.x *= mix(1., uZoomScale.x + wave * c, uProgress);
  modelPosition.y *= mix(1., uZoomScale.y + wave * c * 0.1, uProgress);

  // inertia animation
  // modelPosition.z += sin(modelPosition.y * uFrequency.y + uHeight - uTime * uSpeed) * modulation * 0.5;
  float inertia = sin(modelPosition.y * 0.2 + uHeight + uTime * uSpeed) * uFrequency.y * modulation;
   modelPosition.z += inertia;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  vUv = uv;
  vElevation = elevation;
  vInertia = inertia;
}