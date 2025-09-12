import { Tween } from "@tweenjs/tween.js"
import * as THREE from "three";
import { useEffect, useState } from "react"

import useHttp from "./use_http";

const usePlayerControls = (
        sessionId, 
        scene, 
        camera, 
        orbitControls, 
        runningTweens, 
        runningClips, 
        changeType, 
        changeData, 
        setChangeData, 
        stopAllAnimation,  
        playPause, 
        playPauseToggle, 
        replay, 
        isTweenRunning,
        newEnvironment,
        // allEnvironments,
      //setCurrentEnvironment
) => {
   const [runReset, setRunReset] = useState(false)
   const [isPlaying, setIsPlaying] = useState(true)
   const [cameraSnapshot, setCameraSnapshot] = useState()
   const { isLoading, error, sendRequest: callAPI } = useHttp();

   

    

   

   useEffect(()=>{
    console.log("canvasPlayPause", playPause)
            
    switch (playPause) {
        case true:
            const x = cameraSnapshot && cameraSnapshot.x ? cameraSnapshot.x : camera.position.x 
            const y = cameraSnapshot && cameraSnapshot.y ? cameraSnapshot.y : camera.position.y
            const z = cameraSnapshot && cameraSnapshot.z ? cameraSnapshot.z : camera.position.z    
            console.log('cameraSnapshot', cameraSnapshot)
            camera.position.set(x, y, z ) 
            
                for(let i = 0; i < runningTweens.length; i++) {
                    if(runningTweens[i]._isPaused && runningTweens[i]._isPlaying ) {
                        
                        runningTweens[i].resume()
                    }
                }
                for(let i = 0; i < runningClips.length; i++) {
                    if(runningClips[i].paused) {
                        runningClips[i].paused = false
                    }
                }
                setIsPlaying(true)
                break;
             case false:
                setCameraSnapshot()
                if(isPlaying) {
                    const currCameraSnapshot = {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                }
                setCameraSnapshot(currCameraSnapshot)
                setIsPlaying(false)
                }
                
                for(let i = 0; i < runningTweens.length; i++) {
                    if(runningTweens[i]._isPlaying && runningTweens[i]._isPaused === false ) {
                        
                        runningTweens[i].pause()
                    }
                }
                for(let i = 0; i < runningClips.length; i++) {
                    if(runningClips[i].isRunning) {
                        runningClips[i].paused = true
                    }
                }
            break;    
    }
   }, [playPauseToggle])
    
    useEffect(()=>{
       
        if(runningTweens && runningTweens.length > 0 && changeData ) {
          
          switch (changeData.control) {
            case "replay": 
            for(let i = 0; i < runningTweens.length; i++) { 
                runningTweens[i].stop()
            }
            for(let i = 0; i < runningClips.length; i++) {
                    runningClips[i].stop()
            }
                setRunReset(!runReset)
                setChangeData()
                setIsPlaying(true)
                break;

          }
        
    }
}, [runningTweens, changeData])

// useEffect(()=>{
//     if(newEnvironment) {
//         console.log('changing environment')
//         const currEnvironment = allEnvironments.filter(item => item.environment_id === newEnvironment.environment_id)[0]        
//         console.log('new currentEnv', currEnvironment)
//         scene.traverse(function (child) {
//             if(child.name === "SKYDOME" ){
//                 child.visible = false
//             }
//         })
//         let isAdded = false
//         scene.traverse(function(child){
//          if(child.userData && child.userData.xid === currEnvironment.link_id) {
//             child.visible = true
//             isAdded = true
//          }   
//         })
//         if(!isAdded){
//             currEnvironment.skydome.scene.children[0].name = "SKYDOME"
//         currEnvironment.skydome.scene.children[0].userData.xid = currEnvironment.link_id
//         scene.add(currEnvironment.skydome.scene.children[0])
//         }
//     }

// }, [newEnvironment])

return { runReset }
}



export default usePlayerControls