import { useEffect, useState } from "react";
import changeControls from "../util/change_controls";

const useControls = (renderer, currProduct, experience, scene, camera, orbitControls, changeControl, allRulers, isAddRuler, setIsAddRuler) => {
  const [currControls, setCurrControls] = useState([]);

  useEffect(()=>{
    if(experience && experience.controls && experience.controls.length > 0) {
      
      for(let i = 0; i < experience.controls.length; i++) {
        const controlItem = {
          control_id : experience.controls[i].control_id,
          value: experience.controls[i].default_value 
        }
        setCurrControls(prevItem => [...prevItem, controlItem])
      }
    }
  }, [experience])

  useEffect(()=>{
    if(changeControl && experience && experience.controls) {
      console.log('changeControl', changeControl)
        const control = experience.controls.filter(item => item.control_id.control_id === changeControl.control_id )
        console.log('control', control)
        const value = changeControl.value
        if(control.length > 0) {
         const item = control[0].control_id   
         changeControls(renderer, currProduct, allRulers, scene, camera, experience, orbitControls, item.control_property, value)
         //Change the same value in currControls also
         const newControls = currControls.map(item => {
          if(item.control_id === changeControl.control_id) {
            return {...item, value: value  }
          } else return item
         })
          setIsAddRuler(true)
         
         setCurrControls(newControls)
         
         
         //move this hook at the beginning
         //currontrols.default value should be used in useRuler
        }    
        
    }

  }, [changeControl, experience])

  return currControls
};

export default useControls;
