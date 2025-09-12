import { useEffect, useState } from "react";
import useHttp from "./use_http";
import sendSocketMessage from "../util/send_socket_message";
import getShotList from "../util/get_shot_list";


const useLaunchInteractionList = (showcase, currActId, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId , sessionId) => {
  const [launchInteractionList, setLaunchInteractionList] = useState([]);
  const { isLoading, error, sendRequest: callAPI } = useHttp()

  const [id, setId] = useState();
  const [isFirstId, setIsFirstId] = useState();
  useEffect(() => {
    if (showcase && currActId ) {
      console.log('currActId', currActId)
      const interactionList = showcase.acts.filter(item => item.act_id === currActId)[0].interactions.filter(item => item.is_active === true)
      console.log('interactionList', interactionList)
      const launchInteractionList = [];
      
      const currLaunchINteractions = []
      for(let i = 0; i < interactionList.length; i++) {
        const interaction = showcase.interactions.filter(
        (item) => item.interaction_id === interactionList[i].interaction_id
      )[0]
     
      currLaunchINteractions.push(interaction)  
      
      }
      const allLaunchInteractions = currLaunchINteractions.filter(
        (item) => item.trigger.trigger_event === "LAUNCH"
      );
      console.log('allLaunchInteractions', allLaunchInteractions)
      //setId(currItemId)
      setIsFirstId(true)
      //setInteractionId(currItemId)
        setIsFirstInteractionId(true)

      for(let i = 0; i< allLaunchInteractions.length; i++) {
        sendSocketMessage({type: "interaction_id",  message: allLaunchInteractions[i].interaction_id }, sessionId, callAPI)
        const list = getShotList('01', true, allLaunchInteractions[i].sequences, showcase, "NEXT", "")
        console.log('LIST', list)
        
        launchInteractionList.push(...list)
      }
      setShotList(launchInteractionList)
      setLaunchInteractionList(launchInteractionList)
    }
  }, [currActId]);
  
};

export default useLaunchInteractionList;
