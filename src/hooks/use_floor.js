import { useEffect, useState } from "react"
import * as THREE from "three";
import { Reflector } from "three/examples/jsm/Addons.js";

const useFloor = (experience, scene) => {
    const [floor, setFloor] = useState()

    useEffect(()=> {
        if(experience && experience.floor && experience.floor.is_floor && scene) {
            const floorWidth = Number(experience.floor.width) ?? 10;
            const floorLength = Number(experience.floor.length) ?? 10;
            



            const floorPosition = experience.floor.position ?? {x : 0, y: 0, z: 0}

            let geo = new THREE.PlaneGeometry( floorWidth, floorLength );
            geo.needsUpdate = true;
            const floorGeo = new THREE.PlaneGeometry( floorWidth, floorLength );
            
            //MATERIAL
            const isTexture = experience.floor.is_texture ? true : false
            const floorGeoMaterial = isTexture ? new THREE.MeshStandardMaterial({ }) : new THREE.MeshStandardMaterial({ color: floorColor } )

            if(isTexture) {

                const colorTexture = new THREE.TextureLoader().load("textures/asphalt_01_diff_1k.jpg")
                colorTexture.wrapS = THREE.RepeatWrapping;
                colorTexture.wrapT = THREE.RepeatWrapping;
                colorTexture.repeat.set( 50, 50 );
                floorGeoMaterial.map = colorTexture

                const roughnessTexture = new THREE.TextureLoader().load("textures/asphalt_01_rough_1k.jpg")
                roughnessTexture.wrapS = THREE.RepeatWrapping;
                roughnessTexture.wrapT = THREE.RepeatWrapping;
                roughnessTexture.repeat.set( 50, 50 );
                floorGeoMaterial.roughnessMap = roughnessTexture

                const normalTexture = new THREE.TextureLoader().load("textures/asphalt_01_nor_gl_1k.jpg")
                normalTexture.wrapS = THREE.RepeatWrapping;
                normalTexture.wrapT = THREE.RepeatWrapping;
                normalTexture.repeat.set( 50, 50 );
                floorGeoMaterial.normalMap = normalTexture
            }
            const colorHex = experience.floor.color ?? "36454F"
            const floorColor = new THREE.Color("0x"+colorHex)
            
            
            floorGeoMaterial.transparent = experience.floor.is_transparent ?? true
            floorGeoMaterial.opacity = Number(experience.floor.opacity) ?? .8

            const floor = new THREE.Mesh(floorGeo, floorGeoMaterial)
            floor.receiveShadow = experience.floor.receive_shadow ?? true
            floor.rotateX( - Math.PI / 2 );
            floor.position.x = floorPosition.x;
            floor.position.y = floorPosition.y;
            floor.position.z = floorPosition.z;

            scene.add(floor)

            if(experience.floor.is_reflector) {
                const groundMirror = new Reflector( geo, {
                    clipBias: 0.003,
                    textureWidth: window.innerWidth * window.devicePixelRatio,
                                textureHeight: window.innerHeight * window.devicePixelRatio,
                    color: 0xF9F9F9,
                    recursion: 1
                  } );
                  groundMirror.position.y = floor.position.y-0.001;
                  groundMirror.rotateX( - Math.PI / 2 );
                  groundMirror.material.alpha = 1;
                scene.add( groundMirror );
            }
        }

    }, [experience, scene])

}

export default useFloor