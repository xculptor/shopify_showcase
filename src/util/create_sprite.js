import * as THREE from "three";

const createSprite = async (spriteFile, tileHz, tileVert, startTile, endTile, speed, hotspotColor) => {
    let currentTile = startTile
    const spriteMap = new THREE.TextureLoader().load(
        spriteFile
        //"sprite_sheet.png"
      );
      spriteMap.repeat.set(1/tileHz, 1/tileVert)
      spriteMap.magFilter = THREE.NearestFilter
      let tileOffsetX = (currentTile % tileHz) / tileHz;
      let tileOffsetY = (tileVert - Math.floor(currentTile / tileHz) -1) / tileVert
    
      spriteMap.offset.x = tileOffsetX;
      spriteMap.offset.y = tileOffsetY;
      
      const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, 
                                        color: hotspotColor,
                                        toneMapped: false,
                                          });
      
      const sprite = new THREE.Sprite(spriteMaterial);
      
      const nextFrame = () => {
        currentTile++
        if(currentTile === endTile+1) {
            currentTile = startTile
        }
        tileOffsetX = (currentTile % tileHz) / tileHz;
        tileOffsetY = (tileVert - Math.floor(currentTile / tileHz) -1) / tileVert
    
        spriteMap.offset.x = tileOffsetX;
        spriteMap.offset.y = tileOffsetY;

      }

      const spriteLoop = () => {
        setInterval(nextFrame, speed)
      }

      spriteLoop()
      
      return sprite
        
  }

  export default createSprite