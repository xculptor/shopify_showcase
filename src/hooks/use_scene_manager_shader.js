import { useEffect, useRef, useState } from "react";

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { WaterReflectorShader } from '../util/WaterReflectorShader';

import * as THREE from "three";
import { Vector3  } from "three";

import {
  ACESFilmicToneMapping,
  AgXToneMapping,
  AmbientLight, CineonToneMapping, Color,
  DirectionalLight,
  LinearToneMapping,
  NeutralToneMapping, NoToneMapping, ReinhardToneMapping,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2
} from "three";


import * as TWEEN from "@tweenjs/tween.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import { OrbitControls } from "three/examples/jsm/Addons.js";


const useSceneManager = (
  inH,
  inW,
  experience,
  //allProducts,
  allMaterials,
  allProps,
  envUrl
) => {
  const [renderer, setRenderer] = useState();
  const [scene, setScene] = useState();
  const [camera, setCamera] = useState();
  
  const [orbitControls, setOrbitControls] = useState();
  const [mixer, setMixer] = useState()
  const [orbitCenter, setOrbitCenter] = useState()
  const [orbitObject, setOrbitObject] = useState()
  const [delTime, setDelTime] = useState()

//   const [ isTweenRunning, setIsTweenRunning ] = useState(true)
//   const isTweenRunningRef = useRef(isTweenRunning)
//   useEffect(()=>{
// isTweenRunningRef.current = isTweenRunning
//   }, [isTweenRunning])

  const clock = new THREE.Clock();

  const DEFAULT_CAMERA = {
    camera_fov: 20,
    camera_near: 0.1,
    camera_far:1000,
    camera_position: {
      x: 0,
      y: .5,
      z: 1.5
    }
  }

  

  useEffect(() => {
    if (inW && inH && experience && envUrl /*&& allProducts*/ /*&& allMaterials*/ /*&& allProps*/) {
      
      //DEFAULT Act
     
      //CREATE RENDERER
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.xr.enabled = true;

      renderer.outputEncoding = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 2;
      renderer.setSize(inW, inH);

      //FOR SHADER
      const renderTarget = new THREE.WebGLRenderTarget(inW, inH);
        renderTarget.texture.minFilter = THREE.LinearFilter;
        renderTarget.texture.magFilter = THREE.LinearFilter;
        renderTarget.texture.format = THREE.RGBFormat;

      //FOR SHADER ENDS

      setRenderer(renderer);
      //CREATE SCENE
      const scene = new THREE.Scene();
      setScene(scene);




      //WATER

      // Water

				// const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				// const water = new Water(
				// 	waterGeometry,
				// 	{
				// 		textureWidth: 512,
				// 		textureHeight: 512,
				// 		waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {

				// 			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

				// 		} ),
				// 		sunDirection: new THREE.Vector3(),
				// 		sunColor: 0xffffff,
				// 		waterColor: 0x001e0f,
				// 		distortionScale: 3.7,
				// 		fog: scene.fog !== undefined
				// 	}
				// );

				// water.rotation.x = - Math.PI / 2;

				// scene.add( water );

      //PRODUCTS
//       const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
// const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
// const cube = new THREE.Mesh( geometry, material ); 
// scene.add( cube );
      const products = new THREE.Group()
    //  allProducts[0].product.name = "PRODUCT"; 
      

      
      // for(let i = 0; i < allProducts.length; i++) {
      //   if(allProducts[i].custom_values && allProducts[i].custom_values.length > 0) {
      //     for(let j = 0; j < allProducts[i].custom_values.length; j++) {
      //       const prop = allProducts[i].custom_values[j].prop
      //       const val = allProducts[i].custom_values[j].value
      //       const prop1 = prop.split(".")[0]
      //       const prop2 = prop.split(".")[1]
      //       allProducts[i].product[prop1][prop2] = Number(val)
      //     }}
      //   if(allProducts[i].default_material_variant && allProducts[i].default_material_variant.length > 0) {
      //     for(let j = 0; j < allProducts[i].default_material_variant.length; j++) {
           
      //     const mat = allMaterials.filter(item => item.variant_id === allProducts[i].default_material_variant[j].variant_id)[0].material
      //     for(let k = 0; k < allProducts[i].default_material_variant[j].link_id.length; k++) {
      //       const xid = getXid(experience, allProducts[i].default_material_variant[j].link_id[k])
           
      //       for(let l = 0; l < xid.length; l++) {
              
      //         allProducts[i].product.traverse(function (child) {
                
      //           if(child.isMesh && child.userData && child.userData.xid && child.userData.xid === xid[l]) {
                
      //             child.material = mat
      //           }
      //         })
      //       }
            

      //     }
      //   }
      //   }
          
        

        
      //   products.add(allProducts[i].product)

      // }
      scene.add(products);

      const orbitGeometry = new THREE.SphereGeometry(.1, 3,2)
      const orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 

      const orbitCenter = new THREE.Mesh(orbitGeometry, orbitMaterial)
      orbitCenter.name = 'orbit_center'
      orbitCenter.userData.xid = 'orbit_center'
      setOrbitCenter(orbitCenter)
      //scene.add(orbitCenter)


      const orbitObject = new THREE.Mesh(orbitGeometry, orbitMaterial)
      orbitObject.name = 'orbit_object'
      orbitObject.userData.xid = 'orbit_object'
      orbitCenter.add(orbitObject)
      //setOrbitObject(orbitObject)
      
      

      //AXIS HELPER
      // const axesHelper = new THREE.AxesHelper( 5 );
      // scene.add( axesHelper );

      //PROPS
      if(allProps && allProps.length > 0) {
      
        allProps[0].prop.name = 'PROP'
        scene.add(allProps[0].prop)
        scene.traverse(function(child) {
          if(child.name ==="PROP") {
            
            child.scale.x = 2
            child.scale.y = 2
            child.scale.z = 2

          }
        })
      }

      //ANIMATION MIXER
      const mixer = new THREE.AnimationMixer(scene);
      setMixer(mixer);

      //CREATE CAMERA
      const isDefault = experience.cameras.filter(item => item.is_default).length > 0 

      const camera_values = isDefault ? experience.cameras.filter(item => item.is_default)[0] : DEFAULT_CAMERA 
      
      const camera_fov = Number(camera_values.camera_fov)
     const camera_near = Number(camera_values.camera_near)
     const camera_far = Number(camera_values.camera_far)
     const camera_position = camera_values.camera_position

      const camera = new THREE.PerspectiveCamera(camera_fov, inW / inH, camera_near, camera_far);
      camera.position.set(Number(camera_position.x),Number(camera_position.y),Number(camera_position.z))
    
     
      setCamera(camera);
     

      //ORBIT CONTROL
      const orbitControls = new OrbitControls(camera, renderer.domElement);
      const target = new THREE.Vector3(orbitControls.target.x,orbitControls.target.y,orbitControls.target.z)
      orbitControls.target = target
      
      if(experience.orbit_control){
       
        if(experience.orbit_control.enabled) {
          orbitControls.enabled = experience.orbit_control.enabled  //default true
        }
        if(experience.orbit_control.auto_rotate) {
          orbitControls.autoRotate = experience.orbit_control.auto_rotate //default false
        }
          orbitControls.enablePan = experience.orbit_control.enable_pan ? experience.orbit_control.enable_pan : true  //default true
        
        if(experience.orbit_control.enable_rotate) {
          orbitControls.enableRotate = experience.orbit_control.enable_rotate //default true
        }
        if(experience.orbit_control.enable_zoom) {
          orbitControls.enableZoom = experience.orbit_control.enable_zoom  //default true
        }
        if(experience.orbit_control.max_azimuth_angle) {
          orbitControls.maxAzimuthAngle = experience.orbit_control.max_azimuth_angle//default infinity. if set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        }
        if(experience.orbit_control.min_azimuth_angle) {
          orbitControls.minAzimuthAngle = experience.orbit_control.min_azimuth_angle //default infinity. if set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        }
        if(experience.orbit_control.max_polar_angle) {
          orbitControls.maxPolarAngle = Number(experience.orbit_control.max_polar_angle) * Math.PI /180  //default is Math.PI or 180 degrees
        }
        if(experience.orbit_control.min_polar_angle) {
          orbitControls.minPolarAngle = experience.orbit_control.min_polar_angle //default is 0 
        } 
        if(experience.orbit_control.min_zoom) {
          orbitControls.minZoom = experience.orbit_control.min_zoom //default is 0
        }
        if(experience.orbit_control.max_zoom) {
          orbitControls.maxZoom = experience.orbit_control.max_zoom //default is infinity
        }
        if(experience.orbit_control.target) {
         
          const target = new THREE.Vector3(Number(experience.orbit_control.target.x), Number(experience.orbit_control.target.y), Number(experience.orbit_control.target.z))
          orbitControls.target = target
        }

      }
      
      setOrbitControls(orbitControls);

      
     
    
      //RESET CAMERA
      const box = new THREE.Box3();
      box.setFromObject(scene);

      const size = box.getSize(new Vector3()).length();
      const center = box.getCenter(new Vector3());
      
      //orbitControls.reset();

      // scene.position.x += scene.position.x - center.x;
      // scene.position.y += scene.position.y - center.y;
      // scene.position.z += scene.position.z - center.z;
      // orbitControls.maxDistance = size * 10;
      // camera.near = size / 100;
      // camera.far = size * 100;
      // camera.updateProjectionMatrix();
      
      //camera.position.copy(center);
      //camera.position.x -= 0;
      //camera.position.y  -= size/3;
      //camera.position.z += size;
      //camera.lookAt(center);

  

      //BACKGROUND
      if (
        experience.environment.background.is_active &&
        !experience.environment.background.is_transparent
      ) {
        const backgroundColor = new THREE.Color(
          experience.environment.background.value
        );
        scene.background = backgroundColor;

        //const texture = new THREE.TextureLoader().load( "bg3.avif" );
        //scene.background = texture
      }

      //ENVIRONMENT
      if (experience.environment.hdri[0].is_active) {
      
        new RGBELoader().load(envUrl, function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
          scene.traverse(function (child) {
            if(child.isMesh && child.material.envMapIntensity) {
              child.material.envMapIntensity = Number(experience.environment.hdri[0].intensity)
            }
          })
        });
      }

      

      //LIGHTS
      if (experience.environment.ambient_light.is_active || experience.environment.ambient_light.is_active === 'true' ) {
        console.log('ADDING AMBIENT LIGHT')
        const ambientLight = new THREE.AmbientLight(0x404040);
        ambientLight.intensity = 1; //environment.ambient_light.light_intensity
        //ambientLight.color = new THREE.Color( 0x404040)//environment.ambient_light.light_color)
        scene.add(ambientLight);
      }
     
      console.log()
      if (experience.lights && experience.lights.length > 0) {
        for (let i = 0; i < experience.lights.length; i++) {
          if (experience.lights[i].is_active) {
            switch (experience.lights[i].type) {
              case "spotLight":
                const spotLightColor = new THREE.Color(
                   experience.lights[i].color ?? '0xFFFFFF'
                );
                const spotLight = new THREE.SpotLight(spotLightColor);
                spotLight.intensity =
                  Number(experience.lights[i].intensity) ?? 1;
                spotLight.castShadow = 
                  experience.lights[i].castShadow ?? true;
                spotLight.angle =
                  Number(experience.lights[i].angle) * Math.PI / 180 ?? Math.PI / 3;
                spotLight.penumbra = 
                  Number(experience.lights[i].penumbra) ?? 0.1;
                spotLight.decay = 
                  Number(experience.lights[i].decay) ?? 2;
                
                spotLight.position.set(
                  Number(experience.lights[i].position.x) ?? 0,
                  Number(experience.lights[i].position.y) ?? 1,
                  Number(experience.lights[i].position.z) ?? 0
                );
                if(experience.lights[i].target) {
                  spotLight.target.position.set(
                    Number(experience.lights[i].target.x) ?? 0,
                    Number(experience.lights[i].target.y) ?? 0,
                    Number(experience.lights[i].target.z) ?? 0
                  );
                }
                
                spotLight.userData.xid = experience.lights[i].link_id  
                scene.add(spotLight);
                scene.add(spotLight.target);
                //const spotLightHelper = new THREE.SpotLightHelper( spotLight );
                //scene.add( spotLightHelper );
              break;
              case "directionalLight":
                const directionalLightColor = new THREE.Color(
                  experience.lights[i].color ?? '0xFFFFFF'
                );
                const directionalLight = new THREE.DirectionalLight(directionalLightColor);
                directionalLight.intensity =
                  experience.lights[i].intensity ?? 1;
                directionalLight.castShadow = 
                  experience.lights[i].castShadow ?? true;
                directionalLight.position.set(
                  experience.lights[i].position.x,
                  experience.lights[i].position.y,
                  experience.lights[i].position.z
                );
                directionalLight.target.position.set(
                  experience.lights[i].target.x,
                  experience.lights[i].target.y,
                  experience.lights[i].target.z
                );
                directionalLight.userData.xid = experience.lights[i].link_id 
                scene.add(directionalLight);
                scene.add(directionalLight.target);
                //const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
                //scene.add( directionalLightHelper );
              break;
              case "hemisphereLight":
                const skyColor = new THREE.Color(
                  experience.lights[i].sky_color ?? '0xFFFFFF'
                );
                const groundColor = new THREE.Color(
                  experience.lights[i].sky_color ?? '0xFFFFFF'
                );
                const hemisphereLightIntensity = experience.lights[i].intensity ?? 1;
                const hemisphereLight = new THREE.HemisphereLight( skyColor, groundColor, hemisphereLightIntensity)
                hemisphereLight.position.set(
                  experience.lights[i].position.x,
                  experience.lights[i].position.y,
                  experience.lights[i].position.z
                );
                scene.add(hemisphereLight);
              break;
              case "pointLight" :
                const pointLightColor = new THREE.Color(
                  experience.lights[i].color ?? '0xFFFFFF'
               );
               const pointLight = new THREE.PointLight(pointLightColor);
               pointLight.intensity =
                  experience.lights[i].intensity ?? 1;
                pointLight.castShadow = 
                  experience.lights[i].castShadow ?? false;
                pointLight.position.set(
                  experience.lights[i].position.x,
                  experience.lights[i].position.y,
                  experience.lights[i].position.z
                );
              break;
            }
          }
        }
      }

      
      
      //ADD DEFAULT VARIANTS
    // if(experience.products[0].property){
    //   for (let i = 0; i < experience.products[0].property.length; i++) {
    //     if (experience.products[0].property[i].variants) {
    //       for (
    //         let j = 0;
    //         j < experience.products[0].property[i].variants.length;
    //         j++
    //       ) {
    //         if (
    //           experience.products[0].property[i].variants[j].default_experience
    //         )
    //           for (
    //             let k = 0;
    //             k <
    //             experience.products[0].property[i].variants[j]
    //               .default_experience.length;
    //             k++
    //           ) {
    //             if (
    //               experience.products[0].property[i].variants[j]
    //                 .default_experience[k] === experience.experience_id
    //             ) {
    //               for (
    //                 let m = 0;
    //                 m < experience.products[0].property[i].link_id.length;
    //                 m++
    //               ) {
    //                 const xid = getXid(
    //                   experience,
    //                   experience.products[0].property[i].link_id[m]
    //                 );
                    
    //                 for(let n = 0; n < xid.length; n++) {
    //                 scene.traverse(function (child) {
    //                   if (
    //                     child.userData &&
    //                     child.userData.xid &&
    //                     child.userData.xid === xid[n] &&
    //                     child.isMesh
    //                   ) {
    //                     const mat = allMaterials.filter(
    //                       (item) =>
    //                         (item.name =
    //                           experience.products[0].property[i].variants[
    //                             j
    //                           ].variant_name)
    //                     )[0].material;
                       
    //                    // child.material = mat 
    //                   }
    //                 });
    //               }
    //               }

                 
    //             }
    //           }
    //       }
    //     }
    //   }
    // }

    // //SET CURRENT ACT AS DEFAULT ACT 
    // const launchActId = experience.acts.filter(item => item.is_launch_act)[0].act_id
    //   setCurrAct(launchActId)

      
  //SHADER
  const textureLoader = new THREE.TextureLoader();
  const mainTexture = textureLoader.load(new URL('../../public/tile3.jpg', import.meta.url).toString());
  mainTexture.wrapS = THREE.RepeatWrapping;
  mainTexture.wrapT = THREE.RepeatWrapping;
  mainTexture.repeat.set(3, 4);
  mainTexture.offset.set(1, 2);

  const floorGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
const floorMaterial = new THREE.MeshStandardMaterial({ map: mainTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0.0, -0.05, 0.0);
floor.scale.set(1.5, 1.5, 1.5);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
const cylinderGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.3);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xeba434) });
const cylinderObj = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderObj.position.set(0.0, 0.5, 0.0);
scene.add(floor);
//scene.add(cylinderObj);

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
textureVariable.material.uniforms[ '_rainIntensity' ] = { value: 0.2 }
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

const waterPlane = new Reflector(waterGeometry, {
  shader: customReflectorShader,    
  textureWidth: inW * window.devicePixelRatio,
  textureHeight: inH * window.devicePixelRatio,
  clipBias: 0.003,
  format: THREE.RGBAFormat
});

waterPlane.position.set(0.0, 0.0, 0.0);
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

//capture mouse movement
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let mouseInteracted = false;
let isMouseDown = false;
window.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Left mouse button
        isMouseDown = true;          
    }
});
window.addEventListener('mouseup', (event) => {
    if (event.button === 0) { // Left mouse button
        isMouseDown = false;
    }
});
window.addEventListener('click', (event) => {
    if (event.button === 0) { // Left mouse button
       mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  
        mouseInteracted = true; 
    }
});
window.addEventListener('mousemove', (event) => {   
    if(isMouseDown){
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;  
        mouseInteracted = true;  
    }
});
let startTime = performance.now() / 1000;
let currentTime = 0.0;
let elapsedTime = 0.0;

  //SHADER



      
      //ANIMATE
      
        
      animate();
      function animate() {
        const del = clock.getDelta()
        setDelTime(clock.getElapsedTime())
        requestAnimationFrame(animate);
        orbitControls.update();
        //bbHelper.update()
          TWEEN.update()
        
        //SHADER
        if ( mouseInteracted ) 
          {
              raycaster.setFromCamera( mouse, camera )
              const intersects = raycaster.intersectObject( waterPlane )
      
              if ( intersects.length > 0 ) {
                  const worldPoint = intersects[0].point.clone() ;
                  const localPoint = waterPlane.worldToLocal(worldPoint);
                  textureVariable.material.uniforms[ '_mousePos' ] = { value: new THREE.Vector2( localPoint.x + 0.5, localPoint.y + 0.5) }               
                  
              } else {
                  textureVariable.material.uniforms[ '_mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) }
              }
              mouseInteracted = false
          } else {
              textureVariable.material.uniforms[ '_mousePos' ] = { value: new THREE.Vector2( 10000, 10000 ) }
          }
      
          currentTime = performance.now() / 1000;
          elapsedTime = currentTime - startTime;  
          textureVariable.material.uniforms[ '_time' ] = { value:  elapsedTime};
          
          gpuBuffer.compute();     
          
          waterPlane.material.uniforms._bufferTex = { value: gpuBuffer.getCurrentRenderTarget(textureVariable).texture};
          
          waterPlane.visible = false;  
          renderer.setRenderTarget(renderTarget);
          renderer.render(scene, camera);
          
         
          waterPlane.visible = true;      
          renderer.setRenderTarget(null);

        //SHADER ENDS



        renderer.render(scene, camera);
        if (mixer) {
          mixer.update(del);
        }

      }

      //DISPOSE
      function dispose() {
        console.log("************ DISPOSE **************");
        renderer.dispose();
      }
      return () => dispose();
    }
  }, [inW, inH, envUrl, experience, /*allProducts*/, /*allMaterials,*/ allProps]);

  function runTween(currStep, nextStep, duration, e1, e2) {
    const tween0 = new TWEEN.Tween(currStep).to(nextStep, duration);
    tween0.autoStartOnUpdate = true
    tween0.easing(TWEEN.Easing[e1][e2]);
    //tween0.dynamic(true)
    return tween0;
  }

  
  function runAnimation (clip) {
   //mixer.uncacheAction(clip)
    const act = mixer.clipAction(clip);
    
    return act
  }

  function clipSpeed (speed) {
    mixer.timeScale = speed
  }

  function stopAllAnimation () {
    mixer.stopAllAction()
  }

  return { renderer, scene, camera, setCamera, orbitControls, runTween, runAnimation, stopAllAnimation, orbitCenter, orbitObject, delTime, clipSpeed};
};

export default useSceneManager;
