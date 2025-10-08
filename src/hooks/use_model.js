import { useEffect, useState } from "react"
import useHttp from "./use_http";
import fetchModel from "../util/fetch_model";
import loadModel from "../util/load_model";
import sendSocketMessage from "../util/send_socket_message";


const useModel = (modelList, currProduct, setIsCurrProductLoaded, sessionId, userId, projectId, loadingManager) => {
    const { isLoading, error, sendRequest: callAPI } = useHttp();
    const [allModels, setAllModels] = useState([])
    useEffect(()=> {
        
        if(modelList && modelList.length > 0 && currProduct && userId && projectId) {
         
          //console.log('modelList',  modelList)
          const currModelList = []
          for(let i = 0; i < currProduct.product.components.length; i++){
            const component_id = currProduct.product.components[i].component_id
            const model_id = currProduct.product.components[i].model.model_id
           
            let isModel = false
            if(allModels && allModels.length > 0) { 
              isModel = allModels.filter(item => item.model_id === model_id).length > 0
            }
            if(!isModel) {
              const item = modelList.filter(item => item.model_id === model_id)
             
              currModelList.push(...item)
            }  
          }

          async function getModels(list) {
            const modelPromise = list.map(async (item) => {
              //console.log("path: ", "/canvas/get_model?path=" + userId +'/' + projectId+ "/" + item.model_path)
              const blob = await fetchModel(
                "/canvas/get_model?path=" + userId +'/' + projectId+ "/" + item.model_path,
                callAPI,
                "blob"
              );
              //console.log('is_draco model')
              const glbFile = await loadModel(blob, item.is_draco, loadingManager);
              //console.log('glbFile', glbFile)
              //glbFile.scene.children[0].position.x = 0;
              //glbFile.scene.children[0].position.y = 0;
              //glbFile.scene.children[0].position.z = 0;

              const clipList = []
              for(let i = 0; i < glbFile.animations.length; i++) {
                const clip = {
                  ...glbFile.animations[i]
                }
                clipList.push(clip )
              }

              
              return {
                model_id: item.model_id,
                product_key: currProduct.product_key,
                model: glbFile.scene, //item.is_draco ? glbFile.scene.children[0] : glbFile.scene.children[0],
                clips: clipList, //  glbFile.animations
                property: item.property,
                cameras: glbFile.cameras,
                links: item.links
              };
            });
          
            Promise.all(modelPromise).then((allModels) => {
              setAllModels(prevModels => [...prevModels, ...allModels]);
              setIsCurrProductLoaded(true)
              sendSocketMessage({type: "is_loaded", message: true }, sessionId, callAPI)
              return allModels;
            });
          }
          
            async function loadModels() {
            
              if(currModelList.length > 0) {
              
                const models = await getModels(currModelList);
                
                return models;
              } else {
                setIsCurrProductLoaded(true)
                sendSocketMessage({type: "is_loaded", message: true }, sessionId, callAPI)
              }
              
              
            }
            loadModels();
        }
        
    }, [modelList, currProduct, userId, projectId])

    return allModels

}



export default useModel