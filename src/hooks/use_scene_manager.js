import { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { Vector3  } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";


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

import { OrbitControls, Reflector } from "three/examples/jsm/Addons.js";


const useSceneManager = (
  inH,
  inW,
  experience,
  //allProducts,
  allMaterials,
  allProps,
  envUrl,
  currEnvironment,
  loadingManager
) => {
  const [renderer, setRenderer] = useState();
  const [scene, setScene] = useState();
  const [camera, setCamera] = useState();
  
  const [orbitControls, setOrbitControls] = useState();
  const [tControls, setTControls] = useState()
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
    if (inW && inH && experience && currEnvironment /*&& allProducts*/ /*&& allMaterials*/ /*&& allProps*/) {
      
      //DEFAULT Act
     
      //CREATE RENDERER
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.xr.enabled = true;

      renderer.outputEncoding = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 2;

      renderer.setSize(inW, inH);

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
     
      //TRANSFORM CONTROLS
      const tControls = new TransformControls(camera, renderer.domElement)
      
      setTControls(tControls)
     

      // tControls.addEventListener('change', function () {
      //   renderer.render(scene, camera);
      // })

      
      // const gizmo = tControls.getHelper();
			// scene.add( gizmo );

      //ORBIT CONTROL
      const orbitControls = new OrbitControls(camera, renderer.domElement);
      const target = new THREE.Vector3(orbitControls.target.x,orbitControls.target.y,orbitControls.target.z)
      orbitControls.target = target
      
      if(experience.orbit_control){
       
        
          orbitControls.enabled =  experience.orbit_control.enabled ? experience.orbit_control.enabled : true   //default true
                
          orbitControls.autoRotate = experience.orbit_control.auto_rotate ? experience.orbit_control.auto_rotate : false //default false
        
          orbitControls.enablePan = experience.orbit_control.enable_pan ? experience.orbit_control.enable_pan : false  //default true
        
        
        orbitControls.enableRotate = experience.orbit_control.enable_rotate ? experience.orbit_control.enable_rotate : false //default true
        
        
        orbitControls.enableZoom = experience.orbit_control.enable_zoom ?  experience.orbit_control.enable_zoom : false//default true
        if(experience.orbit_control.max_azimuth_angle) {
          orbitControls.maxAzimuthAngle = Number(experience.orbit_control.max_azimuth_angle)//default infinity. if set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        }
        if(experience.orbit_control.min_azimuth_angle) {
          orbitControls.minAzimuthAngle = Number(experience.orbit_control.min_azimuth_angle) //default infinity. if set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        }
        if(experience.orbit_control.max_polar_angle) {
          orbitControls.maxPolarAngle = Number(experience.orbit_control.max_polar_angle) * Math.PI /180  //default is Math.PI or 180 degrees
        }
        if(experience.orbit_control.min_polar_angle) {
          orbitControls.minPolarAngle = Number(experience.orbit_control.min_polar_angle) //default is 0 
        } 
        if(experience.orbit_control.min_zoom) {
          orbitControls.minDistance= Number(experience.orbit_control.min_zoom) //default is 0
        }
          orbitControls.zoom = experience.orbit_control.zoom ? experience.orbit_control.zoom : 1 
          orbitControls.maxDistance = Number(experience.orbit_control.max_zoom) //default is infinity
        
        if(experience.orbit_control.target) {
         
          const target = new THREE.Vector3(Number(experience.orbit_control.target.x), Number(experience.orbit_control.target.y), Number(experience.orbit_control.target.z))
          orbitControls.target = target
        }

        if(experience.orbit_control.enable_damping) {
          
          orbitControls.enableDamping = true
          orbitControls.dampingFactor = experience.orbit_control.damping_factor ? experience.orbit_control.damping_factor : 0.05
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
      

      //ENVIRONMENT
      if (
        currEnvironment.environment.background.is_active &&
        !currEnvironment.environment.background.is_transparent
      ) {
        const backgroundColor = new THREE.Color(
          currEnvironment.environment.background.value
        );
        scene.background = backgroundColor;

        //const texture = new THREE.TextureLoader().load( "bg3.avif" );
        //scene.background = texture
      }

      //ENVIRONMENT
      if (currEnvironment.environment.hdri[0].is_active) {
        
        new RGBELoader(loadingManager).load( currEnvironment.env_url  /* envUrl */, function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
          scene.environmentIntensity = Number(currEnvironment.environment.hdri[0].intensity)   
          
          if(currEnvironment.environment.hdri[0].is_background) {
            scene.background = texture;
          }
          
        });
      }

      //SKYDOME
      // if(currEnvironment.is_sky_dome) {
      //   console.log('ADDING SKYDOME', currEnvironment.skydome)
      //   currEnvironment.skydome.scene.children[0].name = "SKYDOME"
      //   currEnvironment.skydome.scene.children[0].userData.xid = currEnvironment.link_id
      //   scene.add(currEnvironment.skydome.scene)
      // }

      

      //LIGHTS
      if (currEnvironment.environment.ambient_light.is_active || currEnvironment.environment.ambient_light.is_active === 'true' ) {
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

      
      
      //ANIMATE
      
        
      animate();
      function animate() {
        camera.updateProjectionMatrix();
        const del = clock.getDelta()
        //setDelTime(clock.getElapsedTime())
        requestAnimationFrame(animate);
        orbitControls.update();
        tControls.update()
        //bbHelper.update()
          TWEEN.update()
        
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
  }, [inW, inH, currEnvironment /* envUrl */, experience, /*allProducts*/, /*allMaterials,*/ allProps]);

  function runTween(currStep, nextStep, duration, easing) {
    const tween0 = new TWEEN.Tween(currStep).to(nextStep, duration);
    tween0.autoStartOnUpdate = true
    console.log('easing', easing)
    tween0.easing(TWEEN.Easing[easing]);
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

  return { renderer, scene, camera, setCamera, orbitControls, runTween, runAnimation, stopAllAnimation, orbitCenter, orbitObject, delTime, clipSpeed, tControls, loadingManager};
};







export default useSceneManager;
