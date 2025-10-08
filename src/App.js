import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularWithValueLabel from "./util/Progress_Bar"
import LinearWithValueLabel from './util/progress-bar-linear'
import io from "socket.io-client";
import useReceivedParams from "./hooks/use_received_params";
import useShowcase from './hooks/use_showcase'
import useProductMaterialList from "./hooks/use_product_material_list";
import useSocket from './hooks/use_socket'
import useXid from "./hooks/use_xid";
import useModeCollection from "./hooks/use_mode_collection";
import useCurrProduct from "./hooks/use_curr_product";
import useModel from "./hooks/use_model";
import useEnvUrl from "./hooks/use_env_url";
import useMaterial from "./hooks/use_material";
import useRulers from "./hooks/use_rulers";
import useProps from "./hooks/use_props"
import useSceneManager from "./hooks/use_scene_manager";
import useScreenDimension from "./hooks/use_screen_dimensions";
import useViewportSettings from './hooks/use_viewport_settings'
import useAddProduct from "./hooks/use_add_product";
import useControls from './hooks/use_controls'
import useAddRulers from './hooks/use_add_rulers'
import useVariant from './hooks/use_variant'
import useObjectStates from './hooks/use_object_states'
import useShotObject from "./hooks/use_shot_objects";
import useTween from "./hooks/use_tween";
import usePlayerControls from "./hooks/use_player_controls";
import useLaunchInteractionList from "./hooks/use_launch_interaction_list";
import usePlayerInteractionList from "./hooks/use_player_interaction_list";
import useShotList from "./hooks/use_shot_list";
import useFloor from "./hooks/use_floor";
import useDimensionsNew from "./hooks/use_dimensions_new";
import useAddShader from "./hooks/use_add_shader";
import useFrameAnimation from "./hooks/use_frame_animation";
import useChangeFrame from "./hooks/use_change_frame";
import useScrollEvent from "./hooks/use_scroll_event";
import useCurrFrame from "./hooks/use_curr_frame";
import useScrollFrame from "./hooks/use_scroll_frames";
import useAnimationList from "./hooks/use_animation_list";
import useAnimation from "./hooks/use_animation";
import useRaycast from "./hooks/use_raycast";
import useModeShowcase from "./hooks/use_mode_showcase";
import useClickInteractionList from "./hooks/use_click_interaction_list";
import useHotspots from "./hooks/use_hotspots";
import useAnnotations from "./hooks/use_annotations";
import useEnvironment from "./hooks/use_environment";
import { Box, IconButton, Grid, Typography, CircularProgress, Button } from "@mui/material";
import useElements from "./hooks/use_elements";
import useBackInteractionList from "./hooks/use_back_interaction_list";
import useLoadingManager from "./hooks/use_loading_manager";
import useParamShowcase from "./hooks/use_param_showcase";
import useUIElements from "./hooks/use_ui_elements";
import useRulerControl from "./hooks/use_ruler_control";





function App() {
  const URL = process.env.REACT_APP_BACKEND_BASE_URL
 // console.log("************************** EUME **************************")
  
  //const socket = io(URL, { autoConnect: false });
  const socket = 'test'
  const [isSocketConnected, setIsSocketConnected] = useState(false);
const [loadingManager, setLoadingManager] = useState(new THREE.LoadingManager());

  const refBody = useRef();
  const container = refBody;
  const [shotList, setShotList] = useState()
  const [interactionId, setInteractionId] = useState();
  const [isFirstInteractionId, setIsFirstInteractionId] = useState();
  const [url, setUrl] = useState()
  //const [currActId, setCurrActId] = useState("02")
  useEffect(()=>{
    setUrl(new URLSearchParams(window.location.search))
  }, [])

  const { showcaseId, sessionId, meta, ui} = useReceivedParams(url);
  const {originalShowcase, userId, projectId } = useShowcase(showcaseId);
  const { showcase }= useParamShowcase(originalShowcase, meta)
  
  //const { frameList } = useScrollFrame(showcase, pageHeight)
  const {top, left, isBackground, background, opacity, isBorder, border, borderColor, isBoxShadow, boxShadow, titleFontName, titleFontStyle, titleFontColor, titleFontSize, textFontName, textFontStyle, textFontColor, textFontSize, buttonVariant, buttonColor, buttonSize, hotspotColor, iconColor} = useUIElements(ui)

  const { modelList, productList, materialList, propsList, hotspotList } =
    useProductMaterialList(showcase);
  const xidList = useXid(modelList, showcase)
  const { changeType, changeData, setChangeData, newPlayMode, newCurrAct, socketMessage, newVariant, playPause, playPauseToggle, replay, changeControl, setChangeControl,  newView, newItemId, newChapterId, newActId, setNewActId, newInteractionId, runInteractionId, currFrameIndex, currScrollDirection, scrollProgress, scrollDirection, newEnvironment } = useSocket(
    socket);
    
    
    const  {currActId, nextAct} = useModeShowcase(showcase, sessionId, newActId)
    
  const {currProduct, currProductKey, setCurrProductKey, isCurrProductLoaded, setIsCurrProductLoaded} = useCurrProduct(showcase, sessionId)
  const allModels = useModel(modelList, currProduct, setIsCurrProductLoaded, sessionId, userId, projectId, loadingManager)
  const {allEnvironments, currEnvironment, setCurrentEnvironment} = useEnvironment(showcase, loadingManager)
  const envUrl = useEnvUrl(showcase);
  const {allMaterials, defaultMaterial} = useMaterial(materialList, userId, projectId, currProduct, loadingManager)
  const allRulers = useRulers(showcase, xidList, loadingManager)
  
  const { currStates, setCurrStates } = useObjectStates(showcase);
  const allProps = useProps(propsList, loadingManager);
  const { inH, inW, setInH, setInW } = useScreenDimension(container);
  const { renderer, scene, camera, setCamera, orbitControls, runTween, runAnimation, stopAllAnimation, orbitCenter, orbitObject, delTime, clipSpeed, tControls} =
    useSceneManager(
      inH,
      inW,
      showcase,
      //allProducts,
      allMaterials,
      allProps,
      envUrl,
      currEnvironment,
      loadingManager
    );

    


    useFloor(showcase, scene)
    const currViewport = useViewportSettings(inW, inH, showcase, camera, orbitControls)
    
    const {isProductAdded, isAddRuler, setIsAddRuler, currProductAdded} = useAddProduct(scene, camera, showcase, orbitControls, allModels, currProduct, allMaterials, isCurrProductLoaded, currViewport, xidList, defaultMaterial)
//HOTSPOT AND ANNOTATION 
    const allHotspots = useHotspots(hotspotList, loadingManager)
  const isAnnotationLoaded = useAnnotations(scene, showcase, currActId, allHotspots, modelList, xidList, isProductAdded, hotspotColor, loadingManager);


    const { intersectingObjects, rayCast,isRaycast, setIsRayCast, raycastToggle, setRaycastToggle, setIntersectingObjects } = useRaycast(
    scene,
    camera,
    renderer,
    inH,
    inW
  );

  
    const { animationList, animationElementList} = useAnimationList(showcase, scene, isProductAdded, xidList, allModels, runAnimation, camera, orbitControls)
    
    //const frameAnimationList = useFrameAnimation(scroll, initialValues)
    
    //const frameAnimationList = useAnimation(xidList, scrollProgress, scrollDirection, animationList, animationElementList, scene, isProductAdded, allModels, runAnimation, runTween, showcase, camera, orbitControls)

    //useAddShader(scene, renderer)
    const currControls = useControls(renderer, currProduct, showcase, scene, camera, orbitControls, changeControl, allRulers, isAddRuler, setIsAddRuler)
   const {isChangeRulerValue,  setIsChangeRulerValue, setIsNewRulerValue } = useAddRulers(isAddRuler, setIsAddRuler, showcase, scene, allRulers, currProduct, modelList,  changeControl, currControls, xidList, loadingManager)
    useVariant(newVariant, currProduct, allMaterials, scene, modelList, xidList)
    
    //const { shotList, setIsRunning } = useChangeFrame(frameAnimationList, currFrameIndex, currScrollDirection)
    useLaunchInteractionList(showcase, currActId, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId , sessionId)
    const { id, isFirstId, clickInteractionList } = useClickInteractionList(showcase,intersectingObjects,currActId,currStates,xidList, sessionId, setNewActId, shotList, setShotList, nextAct, setIntersectingObjects )
    usePlayerInteractionList(showcase, runInteractionId, currActId, currStates, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId)
  
    const { shotObjectList } = useShotObject(
      showcase,
      scene,
      camera,
      orbitControls,
      interactionId, isFirstInteractionId,
      shotList, //frameAnimationList,
      allModels,
      modelList,
      xidList,
      isProductAdded
    );

    const { runningTweens, runningClips, isTweenRunnning } = useTween(
      showcase,
      scene,
      camera,
      orbitControls,
      shotObjectList,
      runTween,
      runAnimation,
      currStates,
      setCurrStates,
      currViewport, clipSpeed, nextAct
    );
  
    const { runReset } = usePlayerControls(
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
      isTweenRunnning,
      newEnvironment,
      allEnvironments,
      setCurrentEnvironment
    );

const { isBack, actTitle, actText, backClickHandler, isRunBack, setIsRunBack, runBackInteraction , exploreInsideHandler, checkSizeHandler } = useElements(showcase, currActId, nextAct, setChangeControl, allRulers, currProduct, scene, isChangeRulerValue,  setIsChangeRulerValue, setIsNewRulerValue)
useBackInteractionList(showcase, currActId, currStates, shotList, setShotList, interactionId, setInteractionId, isFirstInteractionId, setIsFirstInteractionId , sessionId, isRunBack, setIsRunBack, runBackInteraction)
//useRulerControl(allRulers, scene, currProduct, rulerControl)
const {loadingPercent, isLoaded} = useLoadingManager(loadingManager)
  
// useEffect(()=>{
//   console.log('allHotspots App', allHotspots)
//  }, [allHotspots])

//  useEffect(()=>{
//   console.log('CurrActId 1', currActId)
//  }, [currActId])

  
//  useEffect(()=>{
//   console.log('xidList', xidList)
//  }, [xidList])

// useEffect(()=>{
//   console.log('currStates', currStates)
//  }, [currStates])


//   useEffect(()=>{
//     if(allRulers) {
//      console.log('allRulers', allRulers)
//     }

//   }, [allRulers])
  
//   useEffect(()=>{
//     console.log('intersectingObjects', intersectingObjects)
//   }, [intersectingObjects])

//   useEffect(()=>{
//     console.log('allModels', allModels)
//   }, [allModels])

//   useEffect(()=>{
//     console.log('sessionId on canvas', sessionId)
//   }, [sessionId])


//   useEffect(()=>{
//     console.log('showcase in Canvas', showcase)
//   }, [showcase])

//   useEffect(()=>{
//     console.log('animationList', animationList)
//   }, [animationList])

//   useEffect(()=>{
//     console.log('xidList', xidList)
//   }, [xidList])

  useEffect(()=>{
    console.log('scene', scene)
  }, [scene])

  
//   useEffect(()=>{
//     console.log('shotList', shotList)
//   }, [shotList])

//   useEffect(()=>{
//     console.log('allEnvironments', allEnvironments)
//   }, [allEnvironments])

//   useEffect(()=>{
//     console.log('currEnvironment', currEnvironment)
//   }, [currEnvironment])

// useEffect(()=>{
//     console.log('newEnvironment', newEnvironment)
//   }, [newEnvironment])

// useEffect(()=>{
//   console.log('showcase', showcase)
// }, [showcase])

// useEffect(()=>{
//   console.log('original showcase', originalShowcase)
// }, [originalShowcase])

  useEffect(() => {
    if (renderer) {
      container.current.appendChild(renderer.domElement);
     // console.log('canvasHeight', container.current.clientHeight,container.current.clientWidth )
      renderer.domElement.addEventListener("touchstart", rayCast);
      renderer.domElement.addEventListener("mousedown", rayCast);
    }
  }, [renderer]);

  

  // window.onresize = function () {
  //   let canvasWidth = container.current.clientWidth;
  //   let canvasHeight = container.current.clientHeight;
  //   if (canvasHeight && canvasHeight) {
  //     camera.aspect = canvasWidth / canvasHeight;
  //   }
  //   //setInH(canvasHeight)
  //   //setInW(canvasWidth)
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(canvasWidth, canvasHeight);
  //   renderer.render(scene, camera);
  // };

  useEffect(() => {
    // if (!isSocketConnected && sessionId) {
    //   console.log("sessionId on canvas", sessionId)
    //   socket.auth = { sessionId };
    //   socket.connect();
    //   setIsSocketConnected(true);
    // }
  }, [sessionId]);

  // useEffect(() => {
  //   window.addEventListener("scroll", console.log('SCOLLLLLLLLLLL'))
  // }, []);


  //ON RESIZE
  window.onresize = function () {
    let canvasWidth = container.current.clientWidth;
    let canvasHeight = container.current.clientHeight;
    if (canvasHeight && canvasHeight) {
      camera.aspect = canvasWidth / canvasHeight;
    }
    //setInH(canvasHeight)
    //setInW(canvasWidth)
   // console.log('canvasHeight', canvasHeight, 'canvasWidth', canvasWidth)
    camera.updateProjectionMatrix();
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.render(scene, camera);
  };

  //<img src = 'eume_background.jpg' style={{objectFit: "cover", width: '100%', opacity: 0.2}}></img>
//<CircularWithValueLabel value={loadingPercent} />
//<img src = 'eume_logo.svg' style={{position: "fixed", top: 10, right: 10, height: 50, width: 50 , opacity: !isLoaded && !isProductAdded ? 0 : 1}}></img>
  return (
<Grid sx={{position: 'fixed', top: 0, left: 0, height: '100%', width: '100%'}}>
<img src = 'eume_background.jpg' style={{objectFit: "cover", height: '100%', width: '100%', opacity: !isLoaded && !isProductAdded ? 0 : 0.5 }}></img>

<Box>
{!isLoaded && !isProductAdded && <div style={{
        height: "100%",
        width: "100%",
        //border: "1px solid black",
        position: "fixed",
        top: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
      }}>
        <Grid container direction='column' sx={{p: 3, justifyContent: 'center', alignItems: 'center', width: 200, boxShadow: 1, backgroundColor: "#eeeeee"}}>
        <Grid sx={{ my: 1}} >
        <img src = 'eume_logo.svg' style={{ height: 100, width: 100 }}></img>  
        </Grid>
        
        <Grid sx={{ my: 1, width: '100%'}}>
        <LinearWithValueLabel value={loadingPercent} />
        </Grid>
        
        
        </Grid>
        
        
        </div>}
<div
      ref={refBody}
      style={{
        height: "100%",
        width: "100%",
        
        //border: "1px solid black",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    ></div>
     {isBack && <Grid sx={{width: 300, position: "fixed", m: 1, top: top, left: left, opacity : isBackground ? opacity : 0,  background: background, border: isBorder ? border : 0, borderImage: borderColor, borderImageSlice: 1, boxShadow: isBoxShadow ? boxShadow : "none"}}>
                <IconButton onClick={backClickHandler} sx={{color: iconColor}}><ArrowBackIcon/></IconButton>
                <Typography sx={{fontWeight: titleFontStyle, fontFamily: titleFontName, fontSize: titleFontSize, mx: 1, mb: 1, color: titleFontColor}}>{actTitle}</Typography>
                <Typography sx={{fontWeight: textFontStyle, fontFamily: textFontName, fontSize: textFontSize, mx: 1, mb: 1, color: textFontColor}}>{actText}</Typography>
                </Grid>
     }
     {!isBack && <Grid container sx={{m: 1, direction: "row", width: "100%", position: "fixed", p: 1, top: 0, left: 0, alignItems: "center", justifyContent: "center"}} >
      {currActId && currActId !== "01" && <Button onClick = {exploreInsideHandler} sx={{variant: "outlined", backgroundColor: "#eeeeee", color: "#000000", fontFamily: "Montserrat", fontSize: 12, fontWeight: 'bold',  "&:hover": {
      backgroundColor: '#cccccc'
    }}}>Explore inside</Button>}
    {currActId && currActId !== "01" && <Button onClick = {checkSizeHandler} sx={{m: 1, px: 2, variant: "contained", backgroundColor: "#eeeeee", color: "#000000", fontFamily: "Montserrat", fontSize: 12, fontWeight: 'bold', "&:hover": {
      backgroundColor: '#cccccc'
    }}}>Check Size</Button>}
     </Grid>
      
     }
    </Box> 
    </Grid>
  );
}

export default App;
