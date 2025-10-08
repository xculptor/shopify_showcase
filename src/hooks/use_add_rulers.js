import { useEffect, useState } from "react";

import createRuler from "../util/create_ruler";
import { LoadingManager } from "three";

const useAddRulers = (
    isAddRuler, setIsAddRuler, experience, scene, allRulers, currProduct, modelList,  changeControl, currControls, xidList, allRulers1, loadingManager
    
) => {
  const [allAddedRulers, setAllAddedRulers] = useState([]);

  const [isChangeRulerValue, setIsChangeRulerValue] = useState(false)
  const [newRulerValue, setIsNewRulerValue] = useState(false)


  useEffect(() => {
   
    if (
      allRulers && allRulers.length > 0 &&
      modelList && modelList.length > 0 &&
      currProduct &&
      isAddRuler && currControls && currControls.length > 0
    ) {
        
      //Make all rulers visible false
      
      const isRulerVal = currControls.filter(item => item.control_id === 'ACT1000000002').length > 0 ?  currControls.filter(item => item.control_id === 'ACT1000000002')[0].value : 'false'
      //console.log("isRulerVal", isRulerVal)
      const isRuler = isRulerVal === 'true' ? true : false
      
      for (let i = 0; i < allRulers.length; i++) {
        const xid = allRulers[i].link_id;
        //('ruler xid', xid)
        scene.traverse(function (child) {
         // console.log('ruler xid check', child.userData.xid)
          if (
            child.userData &&
            child.userData.xid &&
            child.userData.xid === xid
          ) {
            child.visible = false;
          }
        });
      }

      //Find if the current product has existing ruler
      if (
        allAddedRulers.filter((item) => item.product_key === currProduct.product_key)
          .length > 0
      ) {
        const xid = allAddedRulers.filter(
          (item) => item.product_key === currProduct.product_key
        )[0].link_id;

        scene.traverse(function (child) {
          if (
            child.userData &&
            child.userData.xid &&
            child.userData.xid === xid
          ) {
           // console.log('turning ruler :', isRuler)
            child.visible = isRuler;
          }
        });
      } else {
        const currRulers = allRulers.filter(item => item.product_key === currProduct.product_key)
       // console.log('ALL_RULERS', allRulers)
       // console.log('CURR_RULERS', currRulers)
        for( let i = 0; i < currRulers.length; i++ ){
          const object_link_id = currRulers[i].object_link_id  
          const object_xid = xidList.filter(item => item.link_id === object_link_id)[0].xid
          createRuler(scene, object_xid, isRuler, currRulers[i], loadingManager);
         // console.log('turning ruler adding to setAllAdded Ruler:')
          setAllAddedRulers(prevItem => [...prevItem, {
            product_key: currProduct.product_key,
            ruler_id: currRulers[i].ruler_id,
            object_link_id: currRulers[i].object_link_id,
            link_id: currRulers[i].link_id
          }])
        }
       
      }

      setIsAddRuler(false);
    }
  }, [currProduct, allRulers, modelList, isAddRuler, currControls]);

  useEffect(()=>{
   // console.log('turning ruler : allAddedRulers', allAddedRulers)
    if(isChangeRulerValue && allAddedRulers && allAddedRulers.length > 0) {
    //  console.log('turning ruler : 0', newRulerValue)
       if (
        allAddedRulers.filter((item) => item.product_key === currProduct.product_key)
          .length > 0
      ) {
        const xid = allAddedRulers.filter(
          (item) => item.product_key === currProduct.product_key
        )[0].link_id;

     //   console.log('turning ruler : 2', xid)
        scene.traverse(function (child) {
          if (
            child.userData &&
            child.userData.xid &&
            child.userData.xid === xid
          ) {
         //   console.log('turning ruler 2:', newRulerValue)
            child.visible = newRulerValue;
          }
        });
      } 
      setIsChangeRulerValue(false)
    }

  }, [isChangeRulerValue, newRulerValue, allAddedRulers])

return {isChangeRulerValue,  setIsChangeRulerValue, setIsNewRulerValue }

};

export default useAddRulers
