import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'


async function loadModel(blob, is_draco, loadingManager) {
    
    const loader = new GLTFLoader(loadingManager);
    const dloader = new DRACOLoader();
    dloader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/")
    dloader.setDecoderConfig({type: "js"})

  
    if(is_draco) {
      
      loader.setDRACOLoader(dloader)
    }
      
    //console.log('is_draco', is_draco, blob)
    const blobURL = URL.createObjectURL(blob);

    function modelLoader(blobURL) {
      return new Promise((resolve, reject) => {
        loader.load(blobURL, data=> resolve(data), null, reject);
      });
    }
  const gltf = await modelLoader(blobURL)
  return gltf
    }

export default loadModel

