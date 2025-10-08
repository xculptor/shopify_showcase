import { useEffect, useState } from "react";

const useObjectStates = (scroll) => {
  const [currStates, setCurrStates] = useState();

  useEffect(() => {
    if (scroll && scroll.object_states) {
      setCurrStates([]);
      const currStates = []
      for (let i = 0; i < scroll.object_states.length; i++) {
        //console.log('Adding States ', scroll.object_states[i])
        if (scroll.object_states[i].is_active) {
          const curr_state_name = scroll.object_states[
            i
          ].states_list.filter((item) => item.is_default === true)[0]
            .state_name;
            //console.log("Adding States", curr_state_name)
          
            currStates.push({
              link_id: scroll.object_states[i].link_id,
              curr_state_name: curr_state_name,
            })
          
        }
      }
      
      setCurrStates(currStates)
    }
  }, [scroll]);

  return { currStates, setCurrStates };
};

export default useObjectStates;
