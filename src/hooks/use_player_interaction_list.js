import { useEffect, useState } from "react";
import getShotList from "../util/get_shot_list";


const usePlayerInteractionList = (
  showcase, runInteractionId, currActId, currStates, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId
) => {
  const [playerInteractionList, setPlayerInteractionList] = useState();
  const [id, setId] = useState();
  const [isFirstId, setIsFirstId] = useState();

  useEffect(() => {
    if (showcase && runInteractionId) {
      //console.log('runInteractionId', runInteractionId)
      const currActDetails = showcase.acts.filter(
        (item) => item.act_id === currActId
      )[0];
      const interaction = showcase.interactions
        .filter((i) => i.interaction_id === runInteractionId.interaction_id)[0];
    
        setId(currActId)
        setIsFirstId(currActDetails.is_launch_act)

        const sequences = []
        for(let i=0; i<interaction.sequences.length; i++){
          const sequence = interaction.sequences[i]
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

        setInteractionId(runInteractionId.act_id)
        setIsFirstInteractionId(true)
        const list = getShotList(runInteractionId.act_id, true, sequences, showcase, "NEXT", ""  )
      setShotList(list)
      setPlayerInteractionList(list)
    }
  }, [runInteractionId]);

  useEffect(()=>{
   // console.log('playerInteractionList', playerInteractionList)
  }, [playerInteractionList])

  return { id, isFirstId, playerInteractionList}
};

export default usePlayerInteractionList;
