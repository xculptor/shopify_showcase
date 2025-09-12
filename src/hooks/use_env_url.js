import { useEffect, useState } from "react";
import fetchModel from "../util/fetch_model";
import useHttp from "./use_http";

const useEnvUrl = (scroll) => {
    const [envUrl, setEnvUrl] = useState();
    const { isLoading, error, sendRequest: callAPI } = useHttp();
    useEffect(()=>{
      
        if (scroll && scroll.environment ) {
         
            const path = scroll.environment[0].environment.hdri[0].path;
            async function loadHDRI(path) {
                const blob = await fetchModel(
                    "/canvas/load_hdri?path=" + path,
                    callAPI,
                    "blob"
                  );
              
              return blob;
            }
            loadHDRI(path)
              .then((blob) => {
                return window.URL.createObjectURL(blob);
              })
              .then((url) => setEnvUrl(url));
          }

          

    }, [scroll])
    
return envUrl

}

export default useEnvUrl