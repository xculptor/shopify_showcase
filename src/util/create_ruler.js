import * as THREE from "three";
import createSpriteDimension from "./create_sprite_dimension.js";
import addRulerShader from "./add_ruler_shader.js";

import createScale from "./create_scale.js";
import addDisplayShader from "./add_display_shader.js";

function createRuler(
  scene, object_xid, isRuler, ruler
) {
  
  console.log('ruler ruler', ruler, object_xid)


const lineColor = ruler.line_color ? ruler.line_color : new THREE.Color('red')
  const offset = Number(ruler.offset);
  const scale = Number(ruler.scale);
  const is_arrowhead = ruler.is_arrowhead

  const scale_object = ruler.scale_object
  const arrowhead_object = ruler.arrowhead_object
  
  const banner_object = ruler.banner_object
  const banner_object_x = ruler.banner_object_x
  const banner_object_y = ruler.banner_object_y
  const banner_object_z = ruler.banner_object_z
  
  const is_banner = ruler.is_banner

  

  scene.traverse(function (child) {
    if (
      child.userData &&
      child.userData.xid &&
      child.userData.xid === object_xid[0]
    ) {
     
      const bbScale = new THREE.Box3();
      bbScale.setFromObject(child);

      //const bbHelper  = new THREE.BoxHelper(child, 0xffff00)
      //scene.add(bbHelper)
      
      const bbSize = bbScale.getSize(new THREE.Vector3());
      const newSize = {x:bbSize.x*(1+Number(offset)), y:bbSize.y*(1+Number(offset)), z:bbSize.z*(1+Number(offset))}
      const bbCenter = bbScale.getCenter(new THREE.Vector3());

      const banner_length = bbSize.x/5

      const threePointsX = getThreePointsX(bbCenter, newSize, scale)
        const threePointsY = getThreePointsY(bbCenter, newSize, scale)
        const threePointsZ = getThreePointsZ(bbCenter, newSize, scale)
const points_array = [
    new THREE.Vector3( 0, -10, 0),
    new THREE.Vector3( 0, 0, 0),
    new THREE.Vector3( 0, 10, 0)
];


      if(ruler.visible.x) {
       
        //add ruler on x axis
        // const scale_object_x = scale_object.clone()
        // const arrowhead_object_x = arrowhead_object.clone()
        const positionX = bbCenter.x;
        const positionY = bbCenter.y - bbSize.y / 2;
        const positionZ = bbCenter.z + bbSize.z / 2;
        //createScale("x", bbSize.x, scale, scene, scale_object_x, arrowhead_object_x, positionX, positionY, positionZ, is_arrowhead, is_banner, banner_object_x, ruler.link_id)
        
      const rulerGeometry = new THREE.BufferGeometry().setFromPoints(
               threePointsX  
            );   
       const rulerMaterial = new THREE.LineBasicMaterial({
                color: lineColor,
              });
              const rulerX = new THREE.Line(rulerGeometry, rulerMaterial);
              rulerX.name = "RULER";
              rulerX.userData.xid = ruler.link_id
              rulerX.visible = isRuler
              addDisplayShader(scene, "x", banner_length/2,  banner_length, positionX, positionY - banner_length/2, positionZ + banner_length/2, banner_object_x, ruler.link_id, isRuler )
        scene.add(rulerX)
      }
      
      

      if(ruler.visible.y) {
        //add ruler on y axis
        // const scale_object_y = scale_object.clone()
        // const arrowhead_object_y = arrowhead_object.clone()
        const positionX = bbCenter.x - bbSize.x / 2;
        const positionY = bbCenter.y;
        const positionZ = bbCenter.z + bbSize.z / 2;
        //createScale("y", bbSize.y, scale, scene, scale_object_y, arrowhead_object_y, positionX, positionY, positionZ, is_arrowhead,is_banner, banner_object_y, ruler.link_id)
        
        const rulerGeometry = new THREE.BufferGeometry().setFromPoints(
               threePointsY  
            );   
       const rulerMaterial = new THREE.LineBasicMaterial({
                color: lineColor,
              });
              const rulerY = new THREE.Line(rulerGeometry, rulerMaterial);
              rulerY.name = "RULER";
              rulerY.userData.xid = ruler.link_id
              rulerY.visible = isRuler
        addDisplayShader(scene, "y", banner_length/2,  banner_length, positionX - banner_length/2, positionY , positionZ + banner_length/2, banner_object_y, ruler.link_id, isRuler )
        scene.add(rulerY)

      }

      if(ruler.visible.z) {
        // const scale_object_z = scale_object.clone()
        // const arrowhead_object_z = arrowhead_object.clone()
        const positionX = bbCenter.x + bbSize.x / 2;
        const positionY = bbCenter.y - bbSize.y / 2;
        const positionZ = bbCenter.z;
        //createScale("z", bbSize.z, scale, scene, scale_object_z, arrowhead_object_z, positionX, positionY, positionZ, is_arrowhead,is_banner, banner_object_z, ruler.link_id)
      const rulerGeometry = new THREE.BufferGeometry().setFromPoints(
               threePointsZ  
            );   
       const rulerMaterial = new THREE.LineBasicMaterial({
                color: lineColor,
              });
              const rulerZ = new THREE.Line(rulerGeometry, rulerMaterial);
              rulerZ.name = "RULER";
              rulerZ.userData.xid = ruler.link_id
              rulerZ.visible = isRuler
              console.log('RulerRuler', rulerZ)
              addDisplayShader(scene, "z", banner_length/2,  banner_length, positionX + banner_length/2, positionY - banner_length/2 , positionZ , banner_object_z, ruler.link_id, isRuler )
              
        scene.add(rulerZ)


      }
      
    }
  });
}

function getThreePointsX (bbCenter, bbSize, lineScale) {
    const scaleLength = Number(lineScale) * bbSize.x;
    const threePointsX = []
    threePointsX.push(
        new THREE.Vector3(
          bbCenter.x + scaleLength / 2,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z + bbSize.z / 2
        )
      );
      threePointsX.push(
        new THREE.Vector3(
          bbCenter.x,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z + bbSize.z / 2
        )
      );
      threePointsX.push(
        new THREE.Vector3(
          bbCenter.x - scaleLength / 2,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z + bbSize.z / 2
        )
      );

      return threePointsX
}


function getThreePointsY (bbCenter, bbSize, lineScale) {
    const scaleLength = Number(lineScale) * bbSize.y;
    const threePointsY = []
    threePointsY.push(
        new THREE.Vector3(
          bbCenter.x - bbSize.x / 2,
          bbCenter.y + scaleLength / 2,
          bbCenter.z + bbSize.z / 2
        )
      );
      threePointsY.push(
        new THREE.Vector3(
          bbCenter.x - bbSize.x / 2,
          bbCenter.y,
          bbCenter.z + bbSize.z / 2
        )
      );
      threePointsY.push(
        new THREE.Vector3(
          bbCenter.x - bbSize.x / 2,
          bbCenter.y - scaleLength / 2,
          bbCenter.z + bbSize.z / 2
        )
      );

      return threePointsY
}

function getThreePointsZ (bbCenter, bbSize, lineScale) {
    const scaleLength = Number(lineScale) * bbSize.z;
    const threePointsZ = []
    threePointsZ.push(
        new THREE.Vector3(
          bbCenter.x + bbSize.x / 2,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z + scaleLength / 2
        )
      );
      threePointsZ.push(
        new THREE.Vector3(
          bbCenter.x + bbSize.x / 2,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z 
        )
      );
      threePointsZ.push(
        new THREE.Vector3(
          bbCenter.x + bbSize.x / 2,
          bbCenter.y - bbSize.y / 2,
          bbCenter.z - scaleLength / 2
        )
      );

      return threePointsZ
}






export default createRuler;
