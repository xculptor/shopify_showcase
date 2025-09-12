
import * as THREE from "three";
function createSpriteBanner (scene, url) {

    const map = new THREE.TextureLoader().load( url);
    const material = new THREE.SpriteMaterial( { map: map } );
    const sprite = new THREE.Sprite( material );
    sprite.scale(2,2,1)
    scene.add( sprite );
}

export default createSpriteBanner