import { useEffect, useState } from "react";

import getFromValue from "../util/get_from_value";
import * as THREE from "three";


const useTween = (
  experience,
  scene,
  camera,
  orbitControls,
  shotObjectList,
  runTween,
  runAnimation,
  currStates,
  setCurrStates,
  currViewport, clipSpeed, nextAct
) => {
  const [runningTweens, setRunningTweens] = useState([])
  const [runningClips, setRunningClips] = useState([])
  const [isTweenRunnning, setIsTweenRunning] = useState(false)
  
  useEffect(() => {
    if (shotObjectList && shotObjectList.length > 0 && !isTweenRunnning) {
      
      
     // for (let i = 0; i < interactionObjectList.length; i++) {
     //   const linkedInteraction = interactionObjectList[i];
        console.log('shotObjectList', shotObjectList)
        const linkedTweenList = [];
        const currFromValues = [];
        for (let j = 0; j < shotObjectList.length; j++) {
          console.log('INSIDE FOR LOOP 01')
          const shotObject = shotObjectList[j];
          const isFinalShot = shotObject.is_final_shot
          const nextEle = shotObject.next_ele
          const direction = shotObject.direction
          const prevEle = shotObject.prev_ele
          const sequenceEndState = shotObject.sequence_end_state
          
          const easingFunction = shotObject.shot_controls.easing_function ? shotObject.shot_controls.easing_function : "Linear"
          const easingType = shotObject.shot_controls.easing_type ? shotObject.shot_controls.easing_type : "None"
          console.log("EASING", easingFunction, easingType)
          let duration = shotObject.shot_controls.duration ? Number(shotObject.shot_controls.duration) : 3000

          const tweenData = [];
          console.log('INSIDE FOR LOOP 01A', shotObject)
          for (let k = 0; k < shotObject.actions.length; k++) {
            console.log('INSIDE FOR LOOP 02')
            const action = shotObject.actions[k];
            
            //Check Current State start
            let isStop = false;
            if (
              action.action.action_start_state &&
              action.action.action_start_state.length > 0
            ) {
              for (
                let l = 0;
                l < action.action.action_start_state.length;
                l++
              ) {
                const checkState = currStates.filter(
                  (item) =>
                    item.link_id === action.action.action_start_state[l].link_id
                )[0].curr_state_name;

                if (
                  checkState === action.action.action_start_state[l].value
                ) {

                  isStop = false;
                } else {
                  isStop = true;
                }
              }
            }
            //Check Current State Ends
          
            console.log('isStop', isStop, 'currStates', currStates)

            if (!isStop) {
                for (let l = 0; l < action.object_list.length; l++) {
                  console.log('INSIDE FOR LOOP 03')
                  const obj = action.object_list[l];
                  const clipSpeedFactor = action.action.clip_speed_factor ? Number(action.action.clip_speed_factor): 1
                  let xid = null
                  if(obj.isCamera) {
                    xid = 'CAMERA'
                  } else {
                    xid = obj.userData && obj.userData.xid ? obj.userData.xid: ""
                  }
                  const action_type = action.action.action_type
                  const action_property = action.action.action_property;
                  console.log('ACTION TYPE', action_type)
                  if(action_type === "Clip") {
                    console.log('found clip')
                    const act = runAnimation(obj);
                    clipSpeed(clipSpeedFactor)
                    duration = act.getClip().duration * 1000 / clipSpeedFactor
                    
                    tweenData.push({
                      action_id: action.action.action_id,
                      id: l,
                      property: action_property,
                      fromValue: "0",
                      toValue: "1",
                      object: obj,  //this was act earlier
                      action: action.action,
                      clip_is_camera: action.clip_is_camera ? action.clip_is_camera : false,
                      camera_name: action.camera_name ? action.camera_name : ""  
                    });
                    setRunningClips(prevVal => [...prevVal, act])
                  } else if (action_type === "Move" || action_type === "Rotate") {
                    console.log('found -> ', action_type)
                    let fromValues = null;
                    let toValues = null;

                    if (
                      currFromValues.filter(
                        (item) =>
                          item.xid === /* obj.userData.xid*/ xid && item.action_property === action_property
                      ).length === 0
                    ) {
                   
                      //fromValues = obj[action_property];
                      fromValues = {
                        x: Number(obj[action_property].x),
                        y: Number(obj[action_property].y),
                        z: Number(obj[action_property].z)
                      }
                      toValues = {
                        x: Number(obj[action_property].x) + Number(action.action.action_values.x),
                        y: Number(obj[action_property].y) + Number(action.action.action_values.y),
                        z: Number(obj[action_property].z) + Number(action.action.action_values.z)
                      }
                  
                      currFromValues.push({
                        xid: xid, //obj.userData && obj.userData.xid ? obj.userData.xid: "",
                        action_property: action_property,
                        toValues: toValues,
                      });
                    } else {
                     
                      fromValues = currFromValues.filter(
                        (item) =>
                          item.xid === xid /* obj.userData.xid*/ && item.action_property === action_property
                      )[0].toValues;
                      
                      toValues = {
                        x: Number(fromValues.x) + Number(action.action.action_values.x),
                        y: Number(fromValues.y) + Number(action.action.action_values.y),
                        z: Number(fromValues.z) + Number(action.action.action_values.z)
                      }

                      //
                      const newFromValues = currFromValues.map((item) => {
                        if (item.xid === xid /* obj.userData.xid */) {
                          return {
                            xid: xid, //obj.userData.xid,
                            action_property: action_property,
                            toValues: toValues,
                          };
                        } else return item;
                      });
                     
                      currFromValues.splice(0, currFromValues.length);
                      for (let i = 0; i < newFromValues.length; i++) {
                        currFromValues.push(newFromValues[i]);
                      }

                      //
                    }
                    
                    tweenData.push({
                      action_id: action.action.action_id,
                      id: l,
                      property: action_property,
                      fromValue: fromValues,
                      toValue: toValues,
                      object: obj,
                      action: action.action,
                      clip_is_camera:  false,
                      camera_name: ""  
                    });

                  } else if (action_type === "MoveTo" ) {

                    let fromValues = null;
                    let toValues = null;

                    if (
                      currFromValues.filter(
                        (item) =>
                          item.xid === xid /*obj.userData.xid*/ && item.action_property === action_property
                      ).length === 0
                    ) {
                   
                      //fromValues = obj[action_property];
                      fromValues = {
                        x: Number(obj[action_property].x),
                        y: Number(obj[action_property].y),
                        z: Number(obj[action_property].z)
                      }
                      toValues = {
                        x: Number(action.action.action_values.x),
                        y: Number(action.action.action_values.y),
                        z: Number(action.action.action_values.z)
                      }

                      if(obj.isCamera) {
                        const fx = action.action.action_values.x - orbitControls.target.x
                        const fy = action.action.action_values.y - orbitControls.target.y
                        const fz = action.action.action_values.z - orbitControls.target.z
                  
                        const deltaX = fx * Number(currViewport.camera_adjustment_factor)
                        const deltaY = fy * Number(currViewport.camera_adjustment_factor)
                        const deltaZ = fz * Number(currViewport.camera_adjustment_factor)

                        toValues = {
                          x : Number(action.action.action_values.x) + deltaX,
                          y : Number(action.action.action_values.y) + deltaY,
                          z : Number(action.action.action_values.z) + deltaZ,
                        }
                      }
                  
                      currFromValues.push({
                        xid: xid, //obj.userData && obj.userData.xid ? obj.userData.xid: "",
                        action_property: action_property,
                        toValues: toValues,
                      });
                    } else {
                     
                      fromValues = currFromValues.filter(
                        (item) =>
                          item.xid === xid /*obj.userData.xid*/ && item.action_property === action_property
                      )[0].toValues;
                      
                      toValues = {
                        x: Number(action.action.action_values.x),
                        y: Number(action.action.action_values.y),
                        z: Number(action.action.action_values.z)
                      }

                      //
                      const newFromValues = currFromValues.map((item) => {
                        if (item.xid === xid /*obj.userData.xid*/) {
                          return {
                            xid: xid, //obj.userData.xid,
                            action_property: action_property,
                            toValues: toValues,
                          };
                        } else return item;
                      });
                     
                      currFromValues.splice(0, currFromValues.length);
                      for (let i = 0; i < newFromValues.length; i++) {
                        currFromValues.push(newFromValues[i]);
                      }

                      //
                    }
                    
                    tweenData.push({
                      action_id: action.action.action_id,
                      id: l,
                      property: action_property,
                      fromValue: fromValues,
                      toValue: toValues,
                      object: obj,
                      action: action.action,
                      clip_is_camera:  false,
                      camera_name: ""  
                    });

                  } else if (action_type === "Visibility" ) {
                   
                    tweenData.push({
                      action_id: action.action.action_id,
                      id: l,
                      property: action_property,
                      fromValue: "0", 
                      toValue: "1", 
                      object: obj,   
                      action: action.action,
                      orbitObject: obj,
                      obj: obj,
                      clip_is_camera:  false,
                      camera_name: ""  
                    });
                  } /* else if (action_type === "Orbit") {
                   
                    const pos1 = new THREE.Vector3()
                    action.center_object.getWorldPosition(pos1)

                    

                    const pos2 = new THREE.Vector3()
                    obj.getWorldPosition(pos2)

                  
                    
                    orbitCenter.position.set(pos1.x, pos1.y, pos1.z) 
                    orbitObject.position.set(pos2.x, pos2.y, pos2.z) 
                    
                    
                    tweenData.push({
                      action_id: action.action.action_id,
                      id: l,
                      property: "rotation",
                      fromValue: orbitCenter.rotation, 
                      toValue: action.action.action_values, 
                      object: orbitCenter,   
                      action: action.action,
                      orbitObject: orbitObject,
                      obj: obj,
                      clip_is_camera:  false,
                      camera_name: ""  
                    });
                  } */else {
                  
                  let fromValues = null;
                  const toValues = action.action.action_values;
                  
                  if (
                    currFromValues.filter(
                      (item) =>
                        item.xid === xid /*obj.userData.xid*/ && item.action_property === action_property
                    ).length === 0
                  ) {
                    currFromValues.push({
                      xid: xid, //obj.userData.xid,
                      action_property: action_property,
                      toValues: toValues,
                    });
                    fromValues = obj[action_property];
                  } else {
                    fromValues = currFromValues.filter(
                      (item) =>
                        item.xid === xid /*obj.userData.xid*/ && item.action_property === action_property
                    )[0].toValues;
                    const newFromValues = currFromValues.map((item) => {
                      if (item.xid === xid /*obj.userData.xid*/) {
                        return {
                          xid: xid, //obj.userData.xid,
                          action_property: action_property,
                          toValues: toValues,
                        };
                      } else return item;
                    });
                   
                    currFromValues.splice(0, currFromValues.length);
                    for (let i = 0; i < newFromValues.length; i++) {
                      currFromValues.push(newFromValues[i]);
                    }
                  }

                  tweenData.push({
                    action_id: action.action.action_id,
                    id: l,
                    property: action_property,
                    fromValue: fromValues,
                    toValue: toValues,
                    object: obj,
                    action: action.action,
                    clip_is_camera:  false,
                      camera_name: ""  
                  });
                }
                }
              //}
              //End State change current State
                
              // if (
              //   action.action.action_end_state &&
              //   action.action.action_end_state.length > 0
              // ) {
              //   for (
              //     let j = 0;
              //     j < action.action.action_end_state.length;
              //     j++
              //   ) {
              //     const newState = action.action.action_end_state[j];

              //     const newCurrStates = currStates.map((item) => {
              //       if (item.link_id === newState.link_id) {
              //         return {
              //           link_id: newState.link_id,
              //           curr_state_name: newState.end_state,
              //         };
              //       } else return item;
              //     });

              //     setCurrStates(newCurrStates);
              //   }
              // }


              

              if (
                sequenceEndState &&
                sequenceEndState.length > 0
              ) {
                for (
                  let j = 0;
                  j < sequenceEndState.length;
                  j++
                ) {
                  const newState = sequenceEndState[j];

                  const newCurrStates = currStates.map((item) => {
                    if (item.link_id === newState.link_id) {
                      return {
                        link_id: newState.link_id,
                        curr_state_name: newState.value,
                      };
                    } else return item;
                  });

                  setCurrStates(newCurrStates);
                }
              }
              //End state change current State ends
            }
          }
          const { fromList, toList } = getFromValue(tweenData);
          let fromValue = {};
          for (let i = 0; i < fromList.length; i++) {
            fromValue = { ...fromValue, ...fromList[i] };
          }
          
          let toValue = {};
          for (let i = 0; i < toList.length; i++) {
            toValue = { ...toValue, ...toList[i] };
          }
          console.log('tweenData', tweenData)
          const onTweenUpdate = (e) => {
            for (let i = 0; i < tweenData.length; i++) {
              switch (tweenData[i].action.action_type) {
                case "Orbit":
                  const pos = new THREE.Vector3()
                tweenData[i].orbitObject.getWorldPosition(pos)  
                
                tweenData[i].obj.position.z = pos.z
                tweenData[i].obj.position.x = pos.x
                  break;
              }

              switch (tweenData[i].property) {
                case "rotation":
                case "position":
                case "scale":
                case "target":
                  tweenData[i].object[tweenData[i].property].x =
                    e[tweenData[i].action_id][tweenData[i].id][
                      tweenData[i].property
                    ].x;
                  tweenData[i].object[tweenData[i].property].y =
                    e[tweenData[i].action_id][tweenData[i].id][
                      tweenData[i].property
                    ].y;
                  tweenData[i].object[tweenData[i].property].z =
                    e[tweenData[i].action_id][tweenData[i].id][
                      tweenData[i].property
                    ].z;
                  break;
                case "intensity":
                //case "visible":
                  console.log('e', e)
                  console.log('tweenData[i]', tweenData[i])
                  console.log("e[tweenData[i].action_id][tweenData[i].id][tweenData[i].property]", tweenData[i].action_id, tweenData[i].id, tweenData[i].property)
                  console.log("e[tweenData[i].action_id][tweenData[i].id][tweenData[i].property]", e[tweenData[i].action_id][tweenData[i].id][tweenData[i].property])

                  tweenData[i].object[tweenData[i].property] =
                    e[tweenData[i].action_id][tweenData[i].id][
                      tweenData[i].property
                    ];
                  break;
                case "clip":
                  if(tweenData[i].action.clip_is_camera) {
                    scene.traverse(function(child){
                      
                      if(child.name === tweenData[i].action.camera_name) {
                        
                        camera.position.x = child.position.x
                        camera.position.y = child.position.y
                        camera.position.z = child.position.z
                        camera.rotation.x = child.rotation.x
                        camera.rotation.y = child.rotation.y
                        camera.rotation.z = child.rotation.z
  
  
                      }
                    })
                  }
                  break;
               
              }
            }
          };

          const onTweenStart = (e) => {
            //if(shotObject.previous_shot_key !== "") {
              orbitControls.enabled = false;
              setIsTweenRunning(true)
            //}
            for (let i = 0; i < tweenData.length; i++) {
              console.log('tweenData[i].property', tweenData[i].property)
              console.log('tweenData[i]', tweenData[i])
              switch (tweenData[i].property) {
              case "clip": 
              console.log('found clip',tweenData[i] )
                const act = runAnimation(tweenData[i].object);
                const action = tweenData[i].action
                    if (!action.action_clip_in_reverse) {
                      //Action Forward
                      //act.reset();
                      act.paused=false;
                    act.enabled = true;
                      act.time=0;
                    

                      act.timeScale = 1;
                      act.loop = THREE.LoopOnce;
                      act.repetitions = !action.action_repeat_forever
                        ? Number(action.action_repeat) === 0
                          ? 1
                          : Number(action.action_repeat)
                        : Infinity;
                      act.clampWhenFinished = true;
                    } else {
                      //Action Reverse
                      act.timeScale = -1;
                      act.loop = THREE.LoopOnce;
                      act.repetitions = !action.action_repeat_forever
                        ? Number(action.action_repeat) === 0
                          ? 1
                          : Number(action.action_repeat)
                        : Infinity;
                       
                      act.paused = false;
                    }
                   
                act.play();
                  break;
              case "autoRotate":
                tweenData[i].object.autoRotate = true
                break;
              case "visible":
                console.log('hide',  tweenData[i].obj)
                  tweenData[i].obj.visible = tweenData[i].action.action_value
                  break;
              }
            }
          }

          const onTweenComplete = () => {
            orbitControls.enabled = true;
            for (let i = 0; i < tweenData.length; i++) {
              switch (tweenData[i].property) {
                case "autoRotate":
                 
                  tweenData[i].object.autoRotate = false
              }}
            if(isFinalShot) {
              setIsTweenRunning(false)
              if(nextEle != "") {
                nextAct(nextEle)
              } 
              if(direction === "PREVIOUS") {
                console.log('******found previous act ********', prevEle)
                nextAct(prevEle)
              }
              
            }
          }
        
        const easing = easingFunction+"."+easingType
        
        console.log("EASING JOINED", easing)
          const t0 = runTween(fromValue, toValue, duration, easing);
          t0.onStart((e)=> onTweenStart(e))
          t0.onUpdate((e) => onTweenUpdate(e));
          t0.onComplete((e)=> onTweenComplete(e))
          //t0.onComplete(()=>t0.stop())
          const shotKey = shotObject.shot_key;
          const isLinked =
            shotObject.previous_shot_key !== ""
              ? true
              : false;
          const previousShotKey = shotObject.previous_shot_key;
          setRunningTweens(prevItem => [...prevItem, t0])
          linkedTweenList.push({
            interaction_id: shotKey,
            is_linked: isLinked,
            linked_interaction_id: previousShotKey,
            tween: t0,
          });
          
        }
        
        // const t = linkedTweenList.filter((item) => item.is_linked === false)[0]
        //   .tween;
        // const firstInteractionId = linkedTweenList.filter(
        //   (item) => item.is_linked === false
        // )[0].interaction_id;

        const chainTween = [];
        const endList = [];
        console.log('linkedTweenList', linkedTweenList)
        tw();

        function tw() {
          if (endList.length === linkedTweenList.length - 1) {
            return;
          } else {
            for (let i = 0; i < linkedTweenList.length; i++) {
              if (linkedTweenList[i].linked_interaction_id !== "") {
                if (
                  chainTween.filter(
                    (item) =>
                      item.interaction_id === linkedTweenList[i].interaction_id
                  ).length === 0
                ) {
                  let isEnd = true;
                  for (let j = 0; j < linkedTweenList.length; j++) {
                    if (
                      chainTween.filter(
                        (item) =>
                          item.interaction_id ===
                          linkedTweenList[j].interaction_id
                      ).length === 0
                    ) {
                      if (
                        linkedTweenList[i].interaction_id ===
                        linkedTweenList[j].linked_interaction_id
                      ) {
                        isEnd = false;
                      }
                    }
                  }
                  if (isEnd) {
                    
                    chainTween.push({
                      interaction_id: linkedTweenList[i].interaction_id,
                      linked_interaction_id:
                        linkedTweenList[i].linked_interaction_id,
                    });
                    endList.push(linkedTweenList[i].interaction_id);
                  }
                }
              }
            }
            tw();
          }
        }
        const getAllTweens = (id) => {
          const isEnd = linkedTweenList.filter(item => item.linked_interaction_id === id).length === 0
          if(isEnd) {
            return 
          } else {
            const childInteractions = linkedTweenList.filter(item => item.linked_interaction_id === id)
            const childTweens = []
            for (let i = 0; i < childInteractions.length; i++) {
              getAllTweens(childInteractions[i].interaction_id)
              childTweens.push(childInteractions[i].tween)
            }
            
            const parentTween = linkedTweenList.filter(item => item.interaction_id === id)[0].tween
            const parentTweenId = linkedTweenList.filter(item => item.interaction_id === id)[0].interaction_id
           
            parentTween.chain(...childTweens)
          }
        }
        const firstId = linkedTweenList.filter(
          (item) => item.is_linked === false
        )[0].interaction_id
        
        getAllTweens(firstId)
        const firstTween = linkedTweenList.filter(
          (item) => item.is_linked === false
        )[0].tween;
        
       //setRunningTweens(prevItem => [...prevItem, firstTween])
       console.log('running..........', firstTween)
        firstTween.start()
   //   }
    }
  }, [shotObjectList]);

  return { runningTweens, runningClips, isTweenRunnning }
};

export default useTween;