import { useEffect, useState } from "react"
import fetchModel from "../util/fetch_model"
import useHttp from "./use_http";
import loadModel from "../util/load_model";

function useEnvironment (showcase, loadingManager) {
    const [allEnvironments, setAllEnvironments] = useState([])
    const [currEnvironment, setCurrentEnvironment] = useState()
     const { isLoading, error, sendRequest: callAPI } = useHttp();

    useEffect(()=>{
        if(showcase && showcase.environment && showcase.environment.length > 0) {
            const environments = showcase.environment
            //console.log('environments',  environments)
            
            const environmentPromise = environments.map(async (environment) => {
                const path = environment.environment.hdri[0].path;
                const skyDomePath = environment.sky_dome_path
               

                 const blob = await fetchModel(
                    "/canvas/load_hdri?path=" + path,
                    callAPI,
                    "blob"
                  );

                
                //    const blob1 = await fetchModel(
                //   "/canvas/load_hdri?path=" + skyDomePath,
                //   callAPI,
                //   "blob"
                // );
                // console.log('is_draco getting skydome')
                // const glbFile = await loadModel(blob1, false, loadingManager);

              
                  return { environment_id: environment.environment_id, environment: environment.environment, is_default : environment.is_default,   env_url: window.URL.createObjectURL(blob), is_sky_dome: environment.is_sky_dome, link_id: environment.link_id, skydome: null};
                  
            })
                Promise.all(environmentPromise).then((list) => {
            //  console.log('environment list', list)
              setAllEnvironments(prevList => [...prevList, ...list]);
              const currEnvironment = list.filter(item => item.is_default === true)[0]
              setCurrentEnvironment(currEnvironment)
              return list;
            });            
        }

    }, [showcase])

    return {allEnvironments, currEnvironment, setCurrentEnvironment}
}

export default useEnvironment