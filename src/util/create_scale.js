import * as THREE from "three";
import addDisplayShader from "./add_display_shader.js";

async function createScale ( axis, scaleLen, scale, scene, scaleItem, arroheadItem, positionX, positionY, positionZ, is_arrowhead, is_banner, banner_object, xid ) {
  
    //const is_arrowhead = true
    const eleLen = 0.1
    const eleCount = Math.floor(scaleLen * scale / eleLen)
    console.log('axis', axis, 'scaleLen', scaleLen, 'scale', scale, 'eleLen', eleLen, 'eleCount', eleCount)
    const firstElePos = eleLen * eleCount / 2
    const isEven = eleCount % 2 == 0 ? true : false
    const bannerGap =  []
    if(isEven) {
        bannerGap.push(eleCount / 2)
        bannerGap.push(bannerGap[0]+1)
    } else {
        bannerGap.push(( eleCount - 1 ) / 2)
        bannerGap.push(bannerGap[0]+1)
        bannerGap.push(bannerGap[0]+2)
    }
    console.log('bannerGap', bannerGap)
    const scaleArray = new THREE.Group()
    //scaleArray.userData.xid = xid
    if(is_banner) {
        addDisplayShader(scene, axis, eleLen , eleLen * 2, positionX, positionY, positionZ, banner_object, xid)
    }
    for(let i = 0 ; i < eleCount; i++) {
     
        const isGap = bannerGap.filter(item => item === i+1).length
          
        if(isGap === 0) {

           
        if(i === 0 && is_arrowhead){
            const arrohead = arroheadItem.clone()
                arrohead.userData.xid = xid
                arrohead.visible = false
            if(axis === 'x') {
                arrohead.rotation.y = -Math.PI / 2
                arrohead.position.x = positionX - firstElePos + i * eleLen + eleLen / 2 
                arrohead.position.y = positionY
                arrohead.position.z = positionZ 
            } else if (axis === 'y') {
                arrohead.rotation.x = Math.PI / 2
                arrohead.position.x = positionX
                arrohead.position.y = positionY - firstElePos + i * eleLen + eleLen / 2
                arrohead.position.z = positionZ
            }else if (axis = 'z') {
                arrohead.rotation.x = -Math.PI
                arrohead.position.x = positionX
                arrohead.position.y = positionY 
                arrohead.position.z = positionZ - firstElePos + i * eleLen + eleLen / 2
            }
            scaleArray.add(arrohead)
        } else if (i === eleCount - 1 && is_arrowhead) {
            const arrohead = arroheadItem.clone()
            arrohead.userData.xid = xid
            arrohead.visible = false
            if(axis === 'x') {
                arrohead.rotation.y = Math.PI / 2
                arrohead.position.x = positionX - firstElePos + i * eleLen + eleLen / 2 
                arrohead.position.y = positionY
                arrohead.position.z = positionZ 
            } else if (axis === 'y') {
                arrohead.rotation.x = -Math.PI / 2
                arrohead.position.x = positionX
                arrohead.position.y = positionY - firstElePos + i * eleLen + eleLen / 2
                arrohead.position.z = positionZ
            }else if (axis = 'z') {
                arrohead.position.x = positionX
                arrohead.position.y = positionY 
                arrohead.position.z = positionZ - firstElePos + i * eleLen + eleLen / 2
            }
            scaleArray.add(arrohead)
        } else {
            const scaleObj = scaleItem.clone()
            scaleObj.userData.xid = xid
            scaleObj.visible = false
            addPositionRotation(scaleObj, i, axis, positionX, positionY, positionZ, firstElePos, eleLen)
            scaleArray.add(scaleObj)
        } 
        
    }
 
        
    }
    
     
  scene.add(scaleArray)
}


const addPositionRotation = (obj, i,  axis, positionX, positionY, positionZ, firstElePos, eleLen) => {
    if(axis === 'x') {
        obj.rotation.y = Math.PI / 2
       addPositionX(obj, i, positionX, positionY, positionZ, firstElePos, eleLen)
    } else if (axis === 'y') {
        obj.rotation.x = Math.PI / 2
        addPositionY(obj, i, positionX, positionY, positionZ, firstElePos, eleLen)
    }else if (axis = 'z') {
        addPositionZ(obj, i, positionX, positionY, positionZ, firstElePos, eleLen)
    }
} 

const addPositionX = (obj, i, positionX, positionY, positionZ, firstElePos, eleLen) => {
    obj.position.x = positionX - firstElePos + i * eleLen + eleLen / 2 
    obj.position.y = positionY
    obj.position.z = positionZ 
}

const addPositionY = (obj, i, positionX, positionY, positionZ, firstElePos, eleLen) => {
    obj.position.x = positionX
    obj.position.y = positionY - firstElePos + i * eleLen + eleLen / 2
    obj.position.z = positionZ
}

const addPositionZ = (obj, i, positionX, positionY, positionZ, firstElePos, eleLen) => {
    obj.position.x = positionX
    obj.position.y = positionY 
    obj.position.z = positionZ - firstElePos + i * eleLen + eleLen / 2
}

export default createScale