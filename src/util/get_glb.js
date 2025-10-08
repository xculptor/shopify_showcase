import fetchModel from "./fetch_model";
import loadModel from "./load_model";

const getGlb = async (path, callAPI, loadingManager) => {
    const blob = await fetchModel(
            path, callAPI, "blob")
           // console.log('blob', blob)
            const objUrl = window.URL.createObjectURL(blob);
           // console.log('get Glb')
            const obj = await loadModel(blob, true, loadingManager)
      
            return obj
}

export default getGlb