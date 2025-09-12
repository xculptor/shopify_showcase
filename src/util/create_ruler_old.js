import * as THREE from "three";
import createSpriteDimension from "./create_sprite_dimension.js";


function createRuler(scene, dimension, link_id, object_xid, isRuler, allRulers) {
 console.log(dimension)

//const isRuler = dimension.is_ruler  
//const lineColor = '#'+dimension.lineColor
//const lineScale = dimension.lineScale
const offset = dimension.offset
const scale = dimension.scale
const spritePromise = dimension.files.map( async (item) => {
    const sprite = await createSpriteDimension(item.url);
    return {
        key: item.key,
        sprite: sprite
    }
})

  //loadSprite().then((sprite01) => {

  Promise.all(spritePromise).then((spriteList) => {
    scene.traverse(function (child) {
      if (
        child.userData &&
        child.userData.xid &&
        child.userData.xid === object_xid[0]
      ) {
        //const tempPoints = [];
        const bbScale = new THREE.Box3();
        bbScale.setFromObject(child);
        
        const bbSize = bbScale.getSize(new THREE.Vector3());
        const newSize = {x:bbSize.x*(1+Number(offset)), y:bbSize.y*(1+Number(offset)), z:bbSize.z*(1+Number(offset))}
        const bbCenter = bbScale.getCenter(new THREE.Vector3());
        const maxLen = Math.max(bbSize.x, bbSize.y, bbSize.z)

        //sprite with no y as fixed
        var vertexShader = [
          
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
        var fragmentShader = [
          //'uniform float u_width;',
          //'uniform float u_length;', 
          'varying vec2 vUv;',
          //'varying vec3 vPosition;',
          'uniform sampler2D image;',

            'void main()',
          '{',
          //'float x = vUv.x / u_width;',
          //'float y = vUv.y / u_length;',
          //'float borderWidth = 0.1;',
          //'vec2 bottomLeft = step(vec2(borderWidth), vUv);',
          //'vec2 topRight = step(vec2(borderWidth), 1.0 - vUv);',
          
          'vec4 texture = texture2D(image, vUv);',

          //'float vec2ToFloat = (bottomLeft.x * bottomLeft.y) * (topRight.x * topRight.y);', 
          
          //'gl_FragColor = vec4(x,y ,0.0,1.0);',
          'gl_FragColor = vec4(texture);',
          '}',
        ].join('\n');


      
      //var planeGeo = new THREE.PlaneGeometry(10,10);
      //var planeMeshStatic = new THREE.Mesh(planeGeo);
      //planeMeshStatic.position.set(15,0,0);
      
      // var shaderMaterial = new THREE.ShaderMaterial({
      // vertexShader: vertexShader,
      // fragmentShader: fragmentShader
      // });
      //var planeMeshBillboard = new THREE.Mesh(planeGeo,shaderMaterial);
      // planeMeshBillboard.position.set(-15,0,0);
      // scene.add(planeMeshStatic,planeMeshBillboard)
      
      //Sprite with no y as fixed ends
        
      
      
      //Original code for sprite
      //   var vertexShader = [


      //     'void main()',
      //     '{',
  
          
      //     'mat4 myModelView = modelViewMatrix;',
          
      //     'myModelView[0][0] = 1.0;',
      //     'myModelView[0][1] = 0.0;',
      //     'myModelView[0][2] = 0.0;',

      //     'myModelView[1][0] = 0.0;',
      //     'myModelView[1][1] = 1.0;',
      //     'myModelView[1][2] = 0.0;',

      //     'myModelView[2][0] = 0.0;',
      //     'myModelView[2][1] = 0.0;',
      //     'myModelView[2][2] = 1.0;',
        


      //     'vec4 modelViewPosition = myModelView * vec4(position, 1.0);',
        
      //     'gl_Position = projectionMatrix * modelViewPosition;',
      //     '}',
      //   ].join('\n');
      //   var fragmentShader = [
      //       'void main()',
      //     '{',
  
      //     'gl_FragColor = vec4(1.0,0.0,0.0,1.0);',
  
      //     '}',
      //   ].join('\n');


      // var planeGeo = new THREE.PlaneGeometry(10,10);
      // var planeMeshStatic = new THREE.Mesh(planeGeo);
      // planeMeshStatic.position.set(15,0,0);
      // var shaderMaterial = new THREE.ShaderMaterial({
      // vertexShader: vertexShader,
      // fragmentShader: fragmentShader
      // });
      // var planeMeshBillboard = new THREE.Mesh(planeGeo,shaderMaterial);
      // planeMeshBillboard.position.set(-15,0,0);
      // scene.add(planeMeshStatic,planeMeshBillboard)
      
      //Original code for sprite ends

        //PLANE STARTS
        
        const planeLength = 1//Number(scale) * bbSize.y;
        const planeWidth =  1//planeLength / (11/2) 
        const rulerGeo = new THREE.PlaneGeometry( planeWidth, planeLength );
        const rulerMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        console.log('sprite for shader', spriteList[0].sprite)
        const uniforms = {
          u_width: {type: 'f', value: planeWidth},
          u_length: {type: 'f', value: planeLength},
          image: {type: 't', value: new THREE.TextureLoader().load(dimension.files[0].url)} 
        }
        var shaderMaterial = new THREE.ShaderMaterial({
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          //transparent: true,
          uniforms
          });
        //const rulerPlane = new THREE.Mesh( rulerGeo, rulerMaterial );
        const rulerPlane = new THREE.Mesh( rulerGeo, shaderMaterial );
        const rulerPosition =new THREE.Vector3(
          1,//bbCenter.x - bbSize.x / 2,
          1,//bbCenter.y,
          1//bbCenter.z + bbSize.z / 2
        )
        rulerPlane.position.x = rulerPosition.x
        rulerPlane.position.y = rulerPosition.y
        rulerPlane.position.z = rulerPosition.z
        rulerPlane.name = "YRuler" 
        scene.add(rulerPlane);

        // PLANE ENDS

        const threePointsX = getThreePointsX(bbCenter, newSize, scale)
        const threePointsY = getThreePointsY(bbCenter, newSize, scale)
        const threePointsZ = getThreePointsZ(bbCenter, newSize, scale)


        for(let i = 0; i < spriteList.length; i++) {
            
            switch (spriteList[i].key) {
                case "x":
                    spriteList[i].sprite.position.set(
                        bbCenter.x,
                        bbCenter.y - newSize.y / 2,
                        bbCenter.z + newSize.z / 2
                      );
                    break;
                case "y":
                    spriteList[i].sprite.position.set(
                        bbCenter.x - newSize.x / 2,
                        bbCenter.y,
                        bbCenter.z + newSize.z / 2
                      );
                    break;
                case "z":
                    spriteList[i].sprite.position.set(
                        bbCenter.x + newSize.x / 2,
                        bbCenter.y - newSize.y / 2,
                        bbCenter.z 
                      );
                    break;
            }


            
            

            const rulerGeometry = new THREE.BufferGeometry().setFromPoints(
                spriteList[i].key === "x" ? threePointsX : spriteList[i].key === "y" ? threePointsY : threePointsZ 
            );
           
            const rulerMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
              });
              const ruler = new THREE.Line(rulerGeometry, rulerMaterial);
              ruler.name = "RULER";
        
            
            //spriteList[i].sprite.scale.x = maxLen/10;
            //spriteList[i].sprite.scale.y = maxLen/10;
            spriteList[i].sprite.scale.z = 1;
            ruler.add(spriteList[i].sprite);
            ruler.userData.xid = link_id
              ruler.visible = isRuler
            scene.add(ruler);
          

        }
        
        

        

       

        
        //  const bbHelper = new THREE.BoxHelper(child, 0xffff00);
        // scene.add(bbHelper)
      }
    });
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
