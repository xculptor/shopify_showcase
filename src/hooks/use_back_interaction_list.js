import { useEffect, useState } from "react";
import useHttp from "./use_http";
import sendSocketMessage from "../util/send_socket_message";
import getShotList from "../util/get_shot_list";


const useBackInteractionList = (showcase, currActId, currStates, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId , sessionId, isRunBack, setIsRunBack, runBackInteraction, ) => {
  const [launchInteractionList, setLaunchInteractionList] = useState([]);
  const { isLoading, error, sendRequest: callAPI } = useHttp()

  const [id, setId] = useState();
  const [isFirstId, setIsFirstId] = useState();
  useEffect(() => {
    if (showcase && currActId && isRunBack ) {

      console.log('currActId', currActId)
      
     
      const interactionList = showcase.acts.filter(item => item.act_id === currActId)[0].interactions.filter(item => item.is_active === true)
      console.log('interactionList', interactionList)
      const previousAct = showcase.acts.filter(item => item.act_id === currActId)[0].previous_act
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
        
        
        const sequences = [];
            for (let k = 0; k < allLaunchInteractions[i].sequences.length; k++) {
              const sequence = allLaunchInteractions[i].sequences[k];
              if (
                sequence.sequence_start_state &&
                sequence.sequence_start_state.length > 0
              ) {
                for (let l = 0; l < sequence.sequence_start_state.length; l++) {
                  const sequence_start_state = sequence.sequence_start_state[l];
                
                    if(currStates.filter(
                      (item) =>
                        item.curr_state_name ===
                          sequence_start_state.value &&
                        item.link_id === sequence_start_state.link_id
                    ).length > 0) {
                      sequences.push(sequence);      
                    }
                  
                }
              } else {
                sequences.push(sequence);
              }
            }
        
        const list = getShotList('01', true, sequences, showcase, "PREVIOUS", previousAct)
        console.log('LIST', list)
        
        launchInteractionList.push(...list)
      }
      
      setShotList(launchInteractionList)
      setLaunchInteractionList(launchInteractionList)
      setIsRunBack(false)
    }
  }, [runBackInteraction, isRunBack]);
  
};

export default useBackInteractionList;
