import * as THREE from "three";

const createSpriteDimension = async (spriteFile) => {
    
    const map = new THREE.TextureLoader().load( spriteFile);
    map.minFilter = THREE.LinearMipMapNearestFilter;
    map.magFilter = THREE.LinearFilter;
    map.needsUpdate = true
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
      return sprite
        
  }

  export default createSpriteDimension