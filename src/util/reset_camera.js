function resetCamera (experience, currProduct, camera, currViewport, orbitControls) {
    console.log('currViewport', currViewport, camera.position.x, camera.position.y, camera.position.z)

    // RESET CAMERA
    let newCameraPosition = {
        x: Number(experience.cameras.filter(item => item.is_default)[0].camera_position.x),
        y: Number(experience.cameras.filter(item => item.is_default)[0].camera_position.y),
        z: Number(experience.cameras.filter(item => item.is_default)[0].camera_position.z)
    };
    
                if(currProduct.custom_values && currProduct.custom_values.filter(item => item.object === 'CAMERA').length > 0) {
                    
                    newCameraPosition.x = Number(currProduct.custom_values.filter(item => item.object === 'CAMERA')[0].values.x);
                    newCameraPosition.y = Number(currProduct.custom_values.filter(item => item.object === 'CAMERA')[0].values.y);
                    newCameraPosition.z = Number(currProduct.custom_values.filter(item => item.object === 'CAMERA')[0].values.z);
                }
                

                const fx = newCameraPosition.x - orbitControls.target.x
      const fy = newCameraPosition.y - orbitControls.target.y
      const fz = newCameraPosition.z - orbitControls.target.z
     
    

      const deltaX = fx * Number(currViewport.camera_adjustment_factor)
      const deltaY = fy * Number(currViewport.camera_adjustment_factor)
      const deltaZ = fz * Number(currViewport.camera_adjustment_factor)

      console.log(newCameraPosition, 'delta', deltaX, deltaY, deltaZ)
                camera.position.x = newCameraPosition.x+deltaX;
                camera.position.y = newCameraPosition.y+deltaY;
                camera.position.z = newCameraPosition.z+deltaZ;

    // RESET CONTROLS
    let newOrbitControlsPosition = {
                                    x: Number(experience.orbit_control.target.x),
                                    y: Number(experience.orbit_control.target.y),
                                    z:Number(experience.orbit_control.target.z)
                                }
                if(currProduct.custom_values && currProduct.custom_values.filter(item => item.object === 'ORBITCONTROLS').length > 0) {
                  
                    newOrbitControlsPosition.x = Number(currProduct.custom_values.filter(item => item.object === 'ORBITCONTROLS')[0].values.x);
                    newOrbitControlsPosition.y = Number(currProduct.custom_values.filter(item => item.object === 'ORBITCONTROLS')[0].values.y);
                    newOrbitControlsPosition.z = Number(currProduct.custom_values.filter(item => item.object === 'ORBITCONTROLS')[0].values.z);
                }

                const lookaAtDeltaY = Number(currViewport.camera_look_at_delta)
            

                orbitControls.target.x = newOrbitControlsPosition.x;
                orbitControls.target.y = newOrbitControlsPosition.y+lookaAtDeltaY;
                orbitControls.target.z = newOrbitControlsPosition.z;
}

export default resetCamera