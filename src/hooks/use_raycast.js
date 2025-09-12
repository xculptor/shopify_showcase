import * as THREE from "three";

import { useEffect, useState } from "react"

const useRaycast = (scene, camera, renderer, inH, inW, ) => {
    const raycaster = new THREE.Raycaster();
    const [intersectingObjects, setIntersectingObjects] = useState()
    const [isRaycast, setIsRayCast] = useState(false)
    const [raycastToggle, setRaycastToggle] = useState(true)

    useEffect(()=>{
      setIsRayCast(true)
      setRaycastToggle(!raycastToggle)
      console.log('***********isRaycast***********', isRaycast, raycastToggle)
    }, [intersectingObjects])

    const rayCast = (e) => {
      console.log('setting Raycast True')
        
        
        //1. sets the mouse position with a coordinate system where the center
        //   of the screen is the origin
        const rect = renderer.domElement.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const mouse = {
          x: (x / inW) * 2 - 1,
          y: -(y / inH) * 2 + 1,
        };

        //2. set the picking ray from the camera position and mouse coordinates
        raycaster.setFromCamera(mouse, camera);


        const intersects = raycaster.intersectObjects(scene.children, true);
    
        const intersectingObjects = [];
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData) {
                if(intersectingObjects.filter(item => item.userData.xid === intersects[i].object.userData.xid).length === 0) { 
                intersectingObjects.push(intersects[i].object);
              }
            }
            intersects[i].object.traverseAncestors(function (parent) {
                if (parent.userData) {
                    if (
                        intersectingObjects.filter(
                          (item) => item.userData.uid === parent.userData.uid
                        ).length === 0
                      ) {
                        intersectingObjects.push(parent);
                      }
                    }})
        
        }
        setIntersectingObjects(intersectingObjects)
        
        

    }

    return {intersectingObjects, rayCast, isRaycast, setIsRayCast, raycastToggle, setRaycastToggle, setIntersectingObjects}
}

export default useRaycast