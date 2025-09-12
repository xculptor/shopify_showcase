import { useEffect, useState } from "react";

import getObject from "../util/get_object";

const useShotObject = (
  scroll,
      scene,
      camera,
      orbitControls,
      interactionId, isFirstInteractionId,
      shotList,
      allModels,
      modelList,
      xidList,
      isProductAdded
) => {
  const [shotObjectList, setShotObjectList] = useState([]);

  useEffect(() => {
   console.log('SHOTLIST 111', shotList)
    if (isProductAdded && scroll && scene && camera && orbitControls && shotList && shotList.length > 0 && allModels && allModels.length > 0) {
      const shotObjectList = []
      let centerObject = {};
      console.log('SHOTLIST', shotList)
    
      const shotListPromise = shotList.map(async ( item ) => {

        const action = item.action;
        
        const shot_key = item.shot_key;
        const previous_shot_key = item.previous_shot_key;
        const shot_controls = item.shot_controls;
        //const action = shot.action;
        const is_final_shot = item.is_final_shot;
        const sequence_end_state = item.sequence_end_state ? item.sequence_end_state : []
        const next_ele = item.next_ele;
        const direction = item.direction;
        const prevEle = item.previous_ele
        const actions = await actionsHandler(action, allModels, centerObject, camera, orbitControls, xidList, scene)
            shotObjectList.push({
            shot_key: shot_key,
            is_final_shot: is_final_shot,
           sequence_end_state: sequence_end_state,
            previous_shot_key: previous_shot_key,
            shot_controls: shot_controls,
            actions: actions,
            next_ele: next_ele,
            direction: direction,
            prev_ele: prevEle
          }) 
          return shotObjectList
      })
      Promise.all(shotListPromise).then(shotObjectList =>setShotObjectList(...shotObjectList)) 
        
    

    }
  }, [isProductAdded, scene, shotList, allModels, camera, orbitControls]);
  return { shotObjectList /*storydefaultSettings*/ };
};

export default useShotObject;


async function actionsHandler (actionList, allModels, centerObject, camera, orbitControls, xidList, scene) {
  const actions = []
  for(let i = 0; i < actionList.length; i++) {
    const action = actionList[i]

    switch (action.action_object_type) {
      case "CLIP":
        const objList = await allModels[0].clips.filter(
          (item) => item.name === action.clip_name
        );
        actions.push( {
          action: action,
          object_list: objList,
          center_object: centerObject[0],
        });
        break;
      case "CAMERA":
        actions.push({
          action: action,
          object_list: [camera],
          center_object: centerObject[0],
        })
        break;
      case "ORBITCONTROLS":
        actions.push({
          action: action,
          object_list: [orbitControls],
          center_object: centerObject[0],
        })
        break;
      case "OBJECT" :
      case "LIGHT" :
      case "LIGHT_TARGET":
        const list = [];
       
        //for (let j = 0; j < action.action_link_id?.length; j++) {
          console.log('action', action)
          const xid = xidList.filter(item => item.link_id === action.action_link_id[0])[0].xid
          
          const listPromise = xid.map( async (item) => {
            console.log('type',action.action_object_type, 'item', item)
            const obj = await getObject(
              item,
              scene,
              action.action_object_type
            );
            return obj
          }) 
          
          Promise.all(listPromise).then((list)=> {
            console.log('list', list)
            actions.push({
              action: action,
              object_list: list,
              center_object: centerObject,
            })
          })
                        
        //}
        
        break;
     
  };  }
  return actions
}