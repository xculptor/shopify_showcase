import { useEffect, useState } from "react";
import getShotList from "../util/get_shot_list";
import sendSocketMessage from "../util/send_socket_message";
import useHttp from "./use_http";
import { click } from "@testing-library/user-event/dist/click";


const useClickInteractionList = (
  showcase,
  intersectingObjects,
  currActId,
  currStates,
  xidList, sessionId, setNewActId, shotList, setShotList, nextAct, setIntersectingObjects
) => {
  const [clickInteractionList, setClickInteractionList] = useState([]);
  const [id, setId] = useState();
  const [isFirstId, setIsFirstId] = useState();
  const { isLoading, error, sendRequest: callAPI } = useHttp()


  useEffect(() => {
    const clickInteractionList = [];
    if (showcase && intersectingObjects && currActId) {
      //console.log('HHHHH')
      const currActDetails = showcase.acts.filter(
        (item) => item.act_id === currActId
      )[0];
//console.log('HHHHH 1', currActDetails)
      
      const allClickInteractions = showcase.interactions.filter(
        (item) => item.trigger.trigger_event === "CLICK"
      );

      for (let i = 0; i < intersectingObjects.length; i++) {
        const xid = intersectingObjects[i].userData.xid;

        let linkId = ""
        for(let j = 0; j < xidList.length ; j++) {
          const isXid = xidList[j].xid.filter(item => item === xid).length > 0
          if(isXid) {
            linkId = xidList[j].link_id
          }
        }

       
       // console.log('allClickInteractions', allClickInteractions)
        for (let j = 0; j < allClickInteractions.length; j++) {
          
          let isTrigger = false;
          for (
            let k = 0;
            k < allClickInteractions[j].trigger.trigger_link_id.length;
            k++
          ) {
            if (allClickInteractions[j].trigger.trigger_link_id[k] === linkId  ) {
              
              if(allClickInteractions[j].sequences[0].sequence_id !== "NONE") {
                isTrigger = true;
                sendSocketMessage({type: "interaction_id",  message: allClickInteractions[j].interaction_id }, sessionId, callAPI)
              } else {
               // console.log('NONE...........', allClickInteractions[j])
                if(allClickInteractions[j].sequences[0].is_next_act === true) {
                  //setNewActId(allClickInteractions[j].sequences[0].next_act)
                  nextAct(allClickInteractions[j].sequences[0].next_act)
                }
              }
              
            }
          }
          setId(currActId);
          setIsFirstId(currActDetails.is_launch_act);
          if (isTrigger) {
            const sequences = [];
            for (let k = 0; k < allClickInteractions[j].sequences.length; k++) {
              const sequence = allClickInteractions[j].sequences[k];
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
          // console.log('sequences', sequences)
            const list = getShotList(
              currActId,
              currActDetails.is_launch_act,
              /*allClickInteractions[j].sequences*/  sequences,
              showcase, /*, setClickInteractionList*//*, setNewActId*/
              "NEXT",
              ""
            );
          //console.log('list', list)
          if(list && list.length > 0) {
            clickInteractionList.push(...list);
          }
            
          }
        }
      }
      setIntersectingObjects()
     // console.log('clickInteractionList', clickInteractionList)
      if(clickInteractionList.length > 0) {
        setClickInteractionList(clickInteractionList);
      setShotList(clickInteractionList)
      }
      
    }
  }, [showcase, intersectingObjects, currActId]);
  return { id, isFirstId, clickInteractionList };
};

export default useClickInteractionList;
