import * as THREE from "three";

var vertexShaderX = [
          
    'varying vec2 vUv;',
    'varying vec3 vPosition;',
    'void main()',
    '{',

    'vUv = uv;',
    'vPosition = position;',
    'mat4 myModelView = modelViewMatrix;',

    'myModelView[1][0] = 0.0;',
    'myModelView[1][1] = 1.0;',
    'myModelView[1][2] = 0.0;',

    
    'myModelView[2][0] = 0.0;',
    'myModelView[2][1] = 0.0;',
    'myModelView[2][2] = 1.0;',

    'vec4 modelViewPosition = myModelView * vec4(position, 1.0);',
    'gl_Position = projectionMatrix * modelViewPosition;',
    '}',
  ].join('\n');



var vertexShaderY = [
          
    'varying vec2 vUv;',
    'varying vec3 vPosition;',
    'void main()',
    '{',

    'vUv = uv;',
    'vPosition = position;',
    'mat4 myModelView = modelViewMatrix;',

    'myModelView[0][0] = 1.0;',
    'myModelView[0][1] = 0.0;',
    'myModelView[0][2] = 0.0;',

    
    'myModelView[2][0] = 0.0;',
    'myModelView[2][1] = 0.0;',
    'myModelView[2][2] = 1.0;',

    'vec4 modelViewPosition = myModelView * vec4(position, 1.0);',
    'gl_Position = projectionMatrix * modelViewPosition;',
    '}',
  ].join('\n');

  var vertexShaderZ = [
          
    'varying vec2 vUv;',
    'varying vec3 vPosition;',
    'void main()',
    '{',

    'vUv = uv;',
    'vPosition = position;',
    'mat4 myModelView = modelViewMatrix;',

    'myModelView[1][0] = 0.0;',
    'myModelView[1][1] = 1.0;',
    'myModelView[1][2] = 0.0;',

    
    'myModelView[2][0] = 0.0;',
    'myModelView[2][1] = 0.0;',
    'myModelView[2][2] = 1.0;',

    'vec4 modelViewPosition = myModelView * vec4(position, 1.0);',
    'gl_Position = projectionMatrix * modelViewPosition;',
    '}',
  ].join('\n');
  

  var fragmentShader = [
   
    'varying vec2 vUv;',
    'uniform sampler2D image;',
      'void main()',
    '{',
    'vec4 texture = texture2D(image, vUv);',
    'gl_FragColor = vec4(texture);',
    '}',
  ].join('\n');


const addRulerShader = (scene, key, planeLength, planeWidth, positionX, positionY, positionZ, url) => {

    const rulerGeo = new THREE.PlaneGeometry( planeWidth, planeLength );
    const uniforms = {
        u_width: {type: 'f', value: planeWidth},
        u_length: {type: 'f', value: planeLength},
        image: {type: 't', value: new THREE.TextureLoader().load(url)} 
      }
      var shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: key === "x" ? vertexShaderX : key === "y" ? vertexShaderY : vertexShaderZ,
        fragmentShader: fragmentShader,
        transparent: true,
        uniforms,
        side: THREE.DoubleSide
        });

        const rulerPlane = new THREE.Mesh( rulerGeo, shaderMaterial );
        const rulerPosition =new THREE.Vector3(positionX, positionY, positionZ)
        rulerPlane.position.x = rulerPosition.x
        rulerPlane.position.y = rulerPosition.y
        rulerPlane.position.z = rulerPosition.z
        if(key === "z") {
            rulerPlane.rotation.y = Math.PI / 2
        }
        
        rulerPlane.name = "YRuler" 
        scene.add(rulerPlane);
}

export default addRulerShader