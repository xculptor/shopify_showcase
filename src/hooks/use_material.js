import { useEffect, useState } from "react";
import fetchModel from "../util/fetch_model";
import loadModel from "../util/load_model";
import useHttp from "./use_http";
import sendSocketMessage from "../util/send_socket_message";

const useMaterial = (materialList, userId, projectId, currProduct, sessionId, loadingManager) => {
const [allMaterials, setAllMaterials] = useState([])
const [defaultMaterial, setDefaultMaterial] = useState([])
const [isDefaultAdded, setIsDefaultAdded] = useState(false);
const [isAllMaterialLoaded, setIsAllMaterialLoaded] = useState(false)
const { isLoading, error, sendRequest: callAPI } = useHttp();

useEffect(()=>{
if (materialList && materialList.length > 0  && userId && projectId && currProduct && !isAllMaterialLoaded) {
const defaultMaterialList = materialList.filter(i => i.product_id === currProduct.product.product_id).filter(i => i.is_default === true )  
console.log('defaultMaterialList', defaultMaterialList)
async function getDefaultMaterial(list) {
  const defaultMaterialPromise = list.map(async (item) => {
const blob = await fetchModel(
                "/canvas/get_material?path=" + userId +'/' + projectId+ "/"  + item.path,
                callAPI,
                "blob"
              );
              console.log('is_draco material')
              const glbFile = await loadModel(blob, item.is_draco, loadingManager);
              return { product_id: currProduct.product.product_id, property_id: item.property_id, variant_id: item.variant_id, name: item.name, material: glbFile.scene.children[0].material }
  })
  
  Promise.all(defaultMaterialPromise).then((defaultMaterials) => {
    console.log('defaultMaterials', defaultMaterials)
setDefaultMaterial(prevList => [...prevList, ...defaultMaterials])
return defaultMaterials
})
           
              
              
}

async function loadDefaultMaterials () {
  const defaultMaterials = await getDefaultMaterial(defaultMaterialList);
  setIsDefaultAdded(true)
  return defaultMaterials;
}

loadDefaultMaterials()

}

}, [materialList, userId, projectId, currProduct])


useEffect(()=>{
 

    if (materialList && materialList.length > 0  && userId && projectId && isDefaultAdded) {
     
        console.log('materialList', materialList)
        async function getMaterials(list) {
            const materialPromise = list.map(async (item) => {
              console.log("path: ", "/canvas/get_material?path=" + userId +'/' + projectId+ "/"  + item.path)
              const blob = await fetchModel(
                "/canvas/get_material?path=" + userId +'/' + projectId+ "/"  + item.path,
                callAPI,
                "blob"
              );

              const glbFile = await loadModel(blob, item.is_draco, loadingManager);
              console.log('glbFile', glbFile)
              return { variant_id: item.variant_id, name: item.name, material: glbFile.scene.children[0].material };
            });
        
            Promise.all(materialPromise).then((allMaterials) => {
              
              setAllMaterials(prevList => [...prevList, ...allMaterials]);
              
              return allMaterials;
            });
          }

        async function loadMaterials() {
          const materials = await getMaterials(materialList);
          console.log('is_variants_doaded : true')
          setIsAllMaterialLoaded(true)
          sendSocketMessage({type: "is_variants_loaded", message: true }, sessionId, callAPI)
          return materials;
        }
  
        loadMaterials();

} }, [materialList, userId, projectId, isDefaultAdded])

return {allMaterials, defaultMaterial}
}

export default useMaterial