import { useEffect, useState } from "react"
import fetchModel from "../util/fetch_model"
import useHttp from "./use_http";


const useShowcase = (showcaseId) => {
const [originalShowcase, setOriginalSchowcase] = useState()
const [userId, setUserId] = useState();
const [projectId, setProjectId] = useState()
const { isLoading, error, sendRequest: callAPI } = useHttp();

useEffect(()=>{
    if(showcaseId) {
      
        async function getShowcase(showcaseId) {
           //console.log( "/showcase/get_showcase_canvas?showcase=" , showcaseId)
            const response = await fetchModel(
              "/showcase/get_showcase_canvas?showcase=" + showcaseId,
              callAPI,
              "json"
            );
          //  console.log('response', response)
            return response;
          }

          async function loadExp() {
            const showcase = await getShowcase(showcaseId);
            return showcase;
          }

          loadExp()
          .then((showcase) => {
            setOriginalSchowcase(showcase)
            setUserId(showcase.user_id)
            setProjectId(showcase.project_id)
          })
          .catch((err)=>console.log(err))

          
    }
}, [showcaseId])


return {originalShowcase, userId, projectId}

}

export default useShowcase