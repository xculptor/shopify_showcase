import { useEffect, useState } from "react";
import resetOrbitControls from "../util/reset_orbit_controls";
import * as THREE from "three";
import { Vector3 } from "three";

function useAnimation(
  xidList,
  scrollProgress,
  scrollDirection,
  animationList,
  animationElementList,
  scene,
  isProductAdded,
  allModels,
  runAnimation,
  runTween,
  scroll,
  camera,
  orbitControls
) {
  const [cips, setClips] = useState([]);
  const [frameAnimationList, setFrameAnimationList] = useState();
  useEffect(() => {
    if (
      scene &&
      animationList &&
      animationList.length > 0 &&
      animationElementList &&
      animationElementList.length > 0
    ) {
      const frameAnimationList = [];
      //resetOrbitControls(scroll, camera, orbitControls)

      for (let i = 0; i < animationElementList.length; i++) {
        const currScrollProgress = scrollProgress / 100;
        const currActionLinkId = animationElementList[i].action_link_id;
        const currActionProperty = animationElementList[i].action_property;
        const currActionObjectType = animationElementList[i].action_object_type

        //Get all the animations for the selected element
        const list = animationList.filter(
          (item) =>
            item.action_link_id === currActionLinkId &&
            item.action_property === currActionProperty
        );

        //Check if currScrollProgress falls in any animation of that element
        const currScrollList = list.filter(
          (item) =>
            currScrollProgress >= Number(item.start_scroll_progress) &&
            currScrollProgress <= Number(item.end_scroll_progress)
        );
        if (currScrollList.length > 0) {
          for (let j = 0; j < currScrollList.length; j++) {
            const currScrollItem = currScrollList[j];
            const deltaScrollProgress =
              Number(currScrollItem.end_scroll_progress) -
              Number(currScrollItem.start_scroll_progress);
            const itemScrollProgress =
              (currScrollProgress -
                Number(currScrollItem.start_scroll_progress)) /
              deltaScrollProgress;
            if (currScrollItem.action_object_type === "OBJECT") {
              const xid = xidList.filter(
                (item) => item.link_id === currScrollItem.action_link_id
              )[0].xid[0];
              scene.traverse(function (child) {
                if (
                  child.userData &&
                  child.userData.xid &&
                  child.userData.xid === xid
                ) {
                  if (
                    currScrollProgress ===
                    Number(currScrollItem.start_scroll_progress)
                  ) {
                    const deltaX = Number(currScrollItem.initial_values.x);
                    const deltaY = Number(currScrollItem.initial_values.y);
                    const deltaZ = Number(currScrollItem.initial_values.z);

                    frameAnimationList.push({
                      ...currScrollItem,
                      delta_values: {
                        x: deltaX,
                        y: deltaY,
                        z: deltaZ,
                      },
                    });
                  } else if (
                    currScrollProgress ===
                    Number(currScrollItem.end_scroll_progress)
                  ) {
                    const deltaX =
                      Number(currScrollItem.initial_values.x) +
                      Number(currScrollItem.action_values.x);
                    const deltaY =
                      Number(currScrollItem.initial_values.y) +
                      Number(currScrollItem.action_values.y);
                    const deltaZ =
                      Number(currScrollItem.initial_values.z) +
                      Number(currScrollItem.action_values.z);

                    frameAnimationList.push({
                      ...currScrollItem,
                      delta_values: {
                        x: deltaX,
                        y: deltaY,
                        z: deltaZ,
                      },
                    });
                  } else {
                    const deltaX =
                      Number(currScrollItem.initial_values.x) +
                      Number(currScrollItem.action_values.x) *
                        itemScrollProgress;
                    const deltaY =
                      Number(currScrollItem.initial_values.y) +
                      Number(currScrollItem.action_values.y) *
                        itemScrollProgress;
                    const deltaZ =
                      Number(currScrollItem.initial_values.z) +
                      Number(currScrollItem.action_values.z) *
                        itemScrollProgress;

                    frameAnimationList.push({
                      ...currScrollItem,
                      delta_values: {
                        x: deltaX,
                        y: deltaY,
                        z: deltaZ,
                      },
                    });
                  }
                }
              });
            } else if (currScrollItem.action_object_type === "CAMERA") {
              const deltaX =
                Number(currScrollItem.action_values.x) *
                itemScrollProgress *
                Number(scrollDirection);
              const deltaY =
                Number(currScrollItem.action_values.y) *
                itemScrollProgress *
                Number(scrollDirection);
              const deltaZ =
                Number(currScrollItem.action_values.z) *
                itemScrollProgress *
                Number(scrollDirection);

              camera.position.x =
                Number(currScrollItem.initial_values.x) + deltaX;
              camera.position.y =
                Number(currScrollItem.initial_values.y) + deltaY;
              camera.position.z =
                Number(currScrollItem.initial_values.z) + deltaZ;
            } else if (currScrollItem.action_object_type === "CLIP") {
              const itemScrollProgress =
                (currScrollProgress -
                  Number(currScrollItem.start_scroll_progress)) /
                deltaScrollProgress;
              if (currScrollItem.action_clip_in_reverse) {
                currScrollItem.clip.time =
                  currScrollItem.clip.getClip().duration *
                  (1 - itemScrollProgress);
              } else {
                currScrollItem.clip.time =
                  currScrollItem.clip.getClip().duration * itemScrollProgress;
              }
            }
          }
        } else {
            if (
                list.filter(
                  (item) =>
                    currScrollProgress > Number(item.start_scroll_progress) &&
                    currScrollProgress > Number(item.end_scroll_progress)
                ).length > 0
              ) {
                //Animations that are ended
                const endedScrollList = list.filter(
                  (item) =>
                    currScrollProgress > Number(item.start_scroll_progress) &&
                    currScrollProgress > Number(item.end_scroll_progress)
                );
    
                if (endedScrollList.length > 0) {
                     //If one or more than one clips have ended             
                    if (currActionProperty === "clip") {
                      //Previous clip has ended so let the last frame contnue. So no action
                    } else if (currActionProperty === "position" || currActionProperty === "rotation") {
                        //Get the last animation item that has ended and use its value (initial_values + action_values)
                        let lastItemEndScrollProgress = 0
                       
                        for (let j = 0; j < endedScrollList.length; j++) {
                            if(Number(endedScrollList[j].end_scroll_progress) > lastItemEndScrollProgress) {
                                lastItemEndScrollProgress = Number(endedScrollList[j].end_scroll_progress)
                            };
                        }

                        console.log(endedScrollList, lastItemEndScrollProgress)
                        const x = Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].action_values.x ) 
                                    + Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].initial_values.x )
                        const y = Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].action_values.y ) 
                                    + Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].initial_values.y )
                        const z = Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].action_values.z ) 
                                    + Number(endedScrollList.filter(item => Number(item.end_scroll_progress) === lastItemEndScrollProgress)[0].initial_values.z )



                        //check if its camera or object. If its camera than change the camera poaistion if object, change its rotation

                        if(currActionObjectType === 'CAMERA') {
                            camera.position.x = x
                            camera.position.y = y
                            camera.position.z = z
                        } else if (currActionObjectType === 'OBJECT') {
                            scene.traverse(function (child) {
                                const xid = xidList.filter(
                                    (item) => item.link_id === currActionLinkId
                                  )[0].xid[0];
                                if(child.userData && child.userData.xid && child.userData.xid === xid ) {
                                    child.rotation.x = x
                                    child.rotation.y = y
                                    child.rotation.z = z
                                }
                            })

                        }
                                }
                    
                        
                }
              } else if (
                list.filter(
                  (item) =>
                    currScrollProgress < Number(item.start_scroll_progress) &&
                    currScrollProgress < Number(item.end_scroll_progress)
                ).length > 0
              ) {
                //Animations that are to start
                const toStartScrollList = list.filter(
                  (item) =>
                    currScrollProgress < Number(item.start_scroll_progress) &&
                    currScrollProgress < Number(item.end_scroll_progress)
                );
                console.log(
                  "toStartScrollList",
                  currScrollProgress,
                  toStartScrollList
                );
                if (toStartScrollList.length > 0) {
                  for (let j = 0; j < toStartScrollList.length; j++) {
                    const toStartScrollItem = toStartScrollList[j];
                    if (toStartScrollItem.action_object_type === "OBJECT") {
                    } else if (toStartScrollItem.action_object_type === "CAMERA") {
                    } else if (toStartScrollItem.action_object_type === "CLIP") {
                      toStartScrollItem.clip.time = 0;
                    }
                  }
                }
              } 
        }
      }

      setFrameAnimationList(frameAnimationList);
    }
  }, [scrollProgress]);

  return frameAnimationList;
}

export default useAnimation;
