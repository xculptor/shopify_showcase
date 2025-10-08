import { act, useEffect, useState } from "react";
import sortArray from "../util/sort_array";

function useAnimationList(
  scroll,
  scene,
  isProductAdded,
  xidList,
  allModels,
  runAnimation,
  camera,
  orbitControls
) {
  const [animationList, setAnimationList] = useState([]);
  const [animationElementList, setAnimationElementList] = useState([])
  //const [currInitialValue, setCurrInitialValue] = useState([]);

  
  useEffect(() => {
    if (
      isProductAdded &&
      scene &&
      scroll &&
      scroll.actions &&
      scroll.actions.length > 0 &&
      allModels &&
      allModels.length > 0
    ) {
      const actions = scroll.actions;
      const sortedActions = sortArray(actions, "start_scroll_progress");
     // console.log("sortedActions", sortedActions);
    
      const currInitialValue = []
      const animationList = [];
      const animationElementList = []
      for (let i = 0; i < sortedActions.length; i++) {
        
        //add to animationItem
        if(animationElementList.filter(item => item.action_link_id === sortedActions[i].action_link_id && item.action_property === sortedActions[i].action_property).length === 0) {
          animationElementList.push({ action_link_id : sortedActions[i].action_link_id, action_property: sortedActions[i].action_property, action_object_type: sortedActions[i].action_object_type})
        }

        if (
          currInitialValue.filter(
            (item) =>
              item.action_link_id === sortedActions[i].action_link_id &&
              item.action_property === sortedActions[i].action_property
          ).length > 0
        ) {
            
          const value = currInitialValue.filter(
            (item) =>
              item.action_link_id === sortedActions[i].action_link_id &&
              item.action_property === sortedActions[i].action_property
          )[0];

         
          const newValue = {
            action_link_id: sortedActions[i].action_link_id,
            action_property: sortedActions[i].action_property,
            prev_scroll_progress: Number(sortedActions[i].end_scroll_progress),
            initial_values: {
              x:
                value.initial_values.x +
                Number(sortedActions[i].action_values.x),
              y:
                value.initial_values.y +
                Number(sortedActions[i].action_values.y),
              z:
                value.initial_values.z +
                Number(sortedActions[i].action_values.z),
            },
          };

          const tempCurrInitialValue = currInitialValue.map((item) => {
            if (
              item.action_link_id === sortedActions[i].action_link_id &&
              item.action_property === sortedActions[i].action_property
            ) {
              return newValue;
            } else {
              return item;
            }
          });
          currInitialValue.length = 0
          currInitialValue.push(...tempCurrInitialValue);
          animationList.push({
            ...sortedActions[i],
            prev_scroll_progress: value.prev_scroll_progress,
            initial_values: value.initial_values,
          });
        } else {
            
          if (sortedActions[i].action_object_type === "OBJECT") {
            const linkId = sortedActions[i].action_link_id;
            const xid = xidList.filter((item) => item.link_id === linkId)[0]
              .xid[0];
            scene.traverse(function (child) {
              if (
                child.userData &&
                child.userData.xid &&
                child.userData.xid === xid
              ) {
                animationList.push({
                  ...sortedActions[i],
                  prev_scroll_progress: 0,
                  initial_values: {
                    x: child.rotation.x,
                    y: child.rotation.y,
                    z: child.rotation.z,
                  },
                });
                const newValue = {
                  action_link_id: sortedActions[i].action_link_id,
                  action_property: sortedActions[i].action_property,
                  prev_scroll_progress: Number(sortedActions[i].end_scroll_progress),
                  initial_values: {
                    x:
                      child.rotation.x +
                      Number(sortedActions[i].action_values.x),
                    y:
                      child.rotation.y +
                      Number(sortedActions[i].action_values.y),
                    z:
                      child.rotation.z +
                      Number(sortedActions[i].action_values.z),
                  },
                };
                currInitialValue.push(newValue);
              }
            });
          } else if (sortedActions[i].action_object_type === "CAMERA") {
           // console.log(camera.position.x, camera.position.y, camera.position.z)
            animationList.push({
              ...sortedActions[i],
              prev_scroll_progress: 0,
              initial_values: {
                x: camera.position.x,
                y: camera.position.y,
                z: camera.position.z,
              },
            });
            const newValue = {
              action_link_id: sortedActions[i].action_link_id,
              action_property: sortedActions[i].action_property,
              prev_scroll_progress: Number(sortedActions[i].end_scroll_progress),
              initial_values: {
                x: camera.position.x + Number(sortedActions[i].action_values.x),
                y: camera.position.y + Number(sortedActions[i].action_values.y),
                z: camera.position.z + Number(sortedActions[i].action_values.z),
              },
            };
            currInitialValue.push(newValue);
          } else if (sortedActions[i].action_object_type === "ORBITCONTROLS") {
            animationList.push({
              ...sortedActions[i],
              prev_scroll_progress: 0,
              initial_values: {
                x: orbitControls.target.x,
                y: orbitControls.target.y,
                z: orbitControls.target.z,
              },
            });
            const newValue = {
              action_link_id: sortedActions[i].action_link_id,
              action_property: sortedActions[i].action_property,
              prev_scroll_progress: Number(sortedActions[i].end_scroll_progress),
              initial_values: {
                x:
                  orbitControls.target.x +
                  Number(sortedActions[i].action_values.x),
                y:
                  orbitControls.target.y +
                  Number(sortedActions[i].action_values.y),
                z:
                  orbitControls.target.z +
                  Number(sortedActions[i].action_values.z),
              },
            };
            currInitialValue.push(newValue);
          } else if (sortedActions[i].action_object_type === "CLIP") {
            const clip = allModels[0].clips.filter(
              (item) => item.name === sortedActions[i].clip_name
            )[0];
            const animation = runAnimation(clip);
            animation.play().paused = true;
            animationList.push({
              ...sortedActions[i],
              clip: animation,
            });
          }
        }
      }

      setAnimationList(animationList);
      setAnimationElementList(animationElementList)
    }
  }, [scroll, scene, isProductAdded, allModels]);

  return { animationList, animationElementList};
}

export default useAnimationList;
