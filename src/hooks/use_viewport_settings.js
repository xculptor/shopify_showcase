import { useEffect, useState } from "react";

const useViewportSettings = (inW, inH, experience, camera, orbitControls) => {
  const [currViewport, setCurrViewport] = useState()
  useEffect(() => {
    if (
      inW &&
      inH &&
      experience &&
      experience.viewport &&
      experience.viewport.length > 0 &&
      camera
    ) {
      //console.log(experience.viewport)
      const ar = inW / inH;
     
      const viewport = [];
      for (let i = 0; i < experience.viewport.length; i++) {
        
        if (
          ar > Number(experience.viewport[i].transition_lower_limit) &&
          ar <= Number(experience.viewport[i].transition_upper_limit)
        ) {
          viewport.push(experience.viewport[i]);
          setCurrViewport(experience.viewport[i])
          break;
        }
      }
     
      const fx = camera.position.x - orbitControls.target.x
      const fy = camera.position.y - orbitControls.target.y
      const fz = camera.position.z - orbitControls.target.z
     
      const deltaX = fx * Number(viewport[0].camera_adjustment_factor)
      const deltaY = fy * Number(viewport[0].camera_adjustment_factor)
      const deltaZ = fz * Number(viewport[0].camera_adjustment_factor)
      

      camera.position.x = camera.position.x + deltaX
      camera.position.y = camera.position.y + deltaY
      camera.position.z = camera.position.z + deltaZ

      const lookaAtDeltaY = Number(viewport[0].camera_look_at_delta)
      orbitControls.target.y = orbitControls.target.y+lookaAtDeltaY

     
      
    }
  }, [inW, inH, experience, camera]);
return currViewport
};

export default useViewportSettings;
