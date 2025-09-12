import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { WaterReflectorShader } from "../util/WaterReflectorShader";
import { useEffect } from "react";


const useAddShader = (scene, renderer) => {
  useEffect(() => {
    if (scene && renderer) {
      const gpuBuffer = new GPUComputationRenderer(512, 512, renderer);
      const gpuBufferTexture = gpuBuffer.createTexture();

      function initializeTexture(texture) {
        const data = texture.image.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 0; // R
          data[i + 1] = 0; // G
          data[i + 2] = 0; // B
          data[i + 3] = 1; // A
        }
        texture.needsUpdate = true;
      }
      initializeTexture(gpuBufferTexture);

      const waterBufferShader = /* glsl */`    
    uniform vec2 _mousePos;    
    uniform float _time;
    uniform float _rainIntensity;
    uniform float _dampening;
    uniform float _rippleSize;

    float delta = 0.5;    
    float springyness = 0.005;

    float random(float x) {
        return fract(sin(x * 12.9898)*43758.5453123);
    }

    float random(vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
    }

    void main() {
        vec2 cellSize = 1.0 / resolution.xy;
        vec2 uv = gl_FragCoord.xy / resolution.xy;       

        float pressure = texelFetch(bufferTexture, ivec2(gl_FragCoord), 0).x;
        float pVel = texelFetch(bufferTexture, ivec2(gl_FragCoord), 0).y;

        float p_right = texture(bufferTexture, uv + vec2( cellSize.x, 0.0 )).x;
        float p_left = texture(bufferTexture, uv + vec2( -cellSize.x, 0.0 )).x;
        float p_up = texture(bufferTexture, uv + vec2( 0.0, cellSize.y )).x;
        float p_down = texture(bufferTexture, uv + vec2( 0.0, -cellSize.y)).x;

        // Apply horizontal wave function
        pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
        // Apply vertical wave function (these could just as easily have been one line)
        pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;        
        // Change pressure by pressure velocity
        pressure += delta * pVel;        
        // "Spring" motion. This makes the waves look more like water waves and less like sound waves.
        pVel -= 0.005 * delta * pressure;        
        // Velocity damping so things eventually calm down
        pVel *= 1.0 - _dampening * delta;        
        // Pressure damping to prevent it from building up forever.
        pressure *= 0.999;
        
        //x = pressure. y = pressure velocity. Z and W = X and Y gradient
        gl_FragColor = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);    
        
        if (random(_time)<mix(0., _rainIntensity, min(_time/15., 1.0))) {
            vec2 pos = vec2(random(fract(_time)), random(fract(_time/3.14)));
            if (length(uv - pos) < _rippleSize) {
                gl_FragColor.x += 1.0;
            }
        }
        
        if(_mousePos.x < 10000.0){
            float dist = length(_mousePos - (uv));
            if (dist <= _rippleSize) {
                gl_FragColor.x += 1.0 - dist * 10.0;
            }
        }
        
    }
`;

const textureVariable = gpuBuffer.addVariable('bufferTexture', waterBufferShader, gpuBufferTexture);
gpuBuffer.setVariableDependencies( textureVariable, [ textureVariable ] )
textureVariable.material.uniforms[ '_mousePos' ] = { value: new THREE.Vector2( 0, 0 ) }
textureVariable.material.uniforms[ '_rainIntensity' ] = { value: 0.0 }
textureVariable.material.uniforms[ '_dampening' ] = { value: 0.04 }
textureVariable.material.uniforms[ '_rippleSize' ] = { value: 0.01 }

const error = gpuBuffer.init();
if (error) {
    console.error(error);
}

// Create a water plane using Reflector
const waterGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

const customReflectorShader =  Reflector.ReflectorShader;
customReflectorShader.vertexShader = WaterReflectorShader.vertexShader;
customReflectorShader.fragmentShader = WaterReflectorShader.fragmentShader;

const renderTarget = new THREE.WebGLRenderTarget(1 , 1 /* sizes.width, sizes.height */);
renderTarget.texture.minFilter = THREE.LinearFilter;
renderTarget.texture.magFilter = THREE.LinearFilter;
renderTarget.texture.format = THREE.RGBFormat;


const waterPlane = new Reflector(waterGeometry, {
    shader: customReflectorShader,    
    textureWidth: 1, //sizes.width * window.devicePixelRatio,
    textureHeight: 1, //sizes.height * window.devicePixelRatio,
    clipBias: 0.003,
    format: THREE.RGBAFormat
});

waterPlane.position.set(0.0, 0.0, 0.1);
waterPlane.rotation.x = -Math.PI / 2;
waterPlane.scale.set(1.5, 1.5, 1.5);

const existingUniforms = waterPlane.material.uniforms;

Object.assign(existingUniforms, {
    ...THREE.UniformsLib.lights, // Merge light uniforms
    _baseTex: { value: renderTarget.texture },
    _bufferTex: { value: null },
    _albedoColor: { value: new THREE.Color(0x03a9fc) },
    _alpha: { value: 0.2 },
    _shininess: { value: 0.1 },
    _metallic: { value: 0.1 },
    _reflection: { value: 0.25 },
    _receiveShadow: { value: true }
});

waterPlane.material.lights = true;

scene.add(waterPlane);
    }
  }, [scene, renderer]);
};

export default useAddShader;
