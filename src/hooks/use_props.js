import { useEffect, useState } from "react";
import fetchModel from "../util/fetch_model";
import loadModel from "../util/load_model";
import useHttp from "./use_http";


const useProps = (propsList, loadingManager) => {
const [allProps, setAllProps] = useState([])
const { isLoading, error, sendRequest: callAPI } = useHttp();

useEffect(()=>{
    
    if (propsList && propsList.length > 0) {
        async function getProps(list) {
            const propsPromise = list.map(async (item) => {
              const blob = await fetchModel(
                "/canvas/get_model?path=" + item.model_path,
                callAPI,
                "blob"
              );
              console.log('is_draco useProps')
              const glbFile = await loadModel(blob, false, loadingManager);
             
              return {
                prop_id: item.prop_id,
                model_id: item.model_id,
                prop: glbFile.scene,
                clips: glbFile.animations
              };
            });
        
            Promise.all(propsPromise).then((allProps) => {
              setAllProps(allProps);
              
              return allProps;
            });
          }
      
        async function loadProps() {
          const props = await getProps(propsList);
          
          return props;
        }
        loadProps();
      }
}, [propsList])

return allProps
}

export default useProps