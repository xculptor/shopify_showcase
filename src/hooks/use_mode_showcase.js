import { useEffect, useState } from "react"
import sendSocketMessage from "../util/send_socket_message";
import useHttp from "./use_http";

const useModeShowcase = (showcase, sessionId, newActId) => {
   
    const [currActId, setCurrActId] = useState()
   

    const { isLoading, error, sendRequest: callAPI } = useHttp()
    
    

    useEffect(()=>{
        if(showcase) {
                const firstAct = showcase.acts.filter((item) => item.is_launch_act === true)[0];
                //console.log('firstAct', firstAct)
                //console.log('firstActId 2', firstAct.act_id)
               
                setCurrActId(firstAct.act_id);
                
                sendSocketMessage({type: "curr_act_id", message: firstAct.act_id }, sessionId, callAPI)             
        }
    }, [showcase])


    useEffect(()=>{
      if(newActId)
      {
        //console.log('new act Id **********')
        setCurrActId(newActId);
      sendSocketMessage({type: "curr_act_id", message: newActId }, sessionId, callAPI)
      }
      
    }, [newActId])

    function nextAct(nextEle) {
      if (showcase && currActId && nextEle) {
       // console.log('act NEXT ELEMENT **********')
          setCurrActId(nextEle);
          sendSocketMessage({type: "curr_act_id", message: nextEle }, sessionId, callAPI)
      }
    }

    return  {currActId  , nextAct } 
}

export default useModeShowcase