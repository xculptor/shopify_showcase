import { useState } from "react"

const useSocket = (socket, setCurrAct) => {
    const [changeType, setChangeType] = useState();
    const [changeData, setChangeData] = useState()
  
    const [newPlayMode, setNewPlayMode] = useState()
    const [newCurrAct, setNewCurrAct] = useState()

    const [socketMessage, setSocketMessage] = useState()
    const [replay, setReplay] = useState()

    //New
    const [changeControl, setChangeControl] = useState()
    const [newVariant, setNewVariant] = useState()
    const [newView, setNewView] = useState()
    const [playPause, setPlayPause] = useState()
    const [playPauseToggle, setPlayPauseToggle] = useState(false)
    const [newItemId, setNewItemId] = useState()
    const [newChapterId, setNewChapterId] = useState()
    const [newActId, setNewActId] = useState()
    const [newInteractionId, setNewInteractionId] = useState()
    const [runInteractionId, setRunInteractionId] = useState()
    const [newEnvironment, setNewEnvironment] = useState()

    //SCROLL
    const [currFrameIndex, setCurrFrameIndex] = useState(0)
    const [currScrollDirection, setCurrScrollDirection] = useState()
    const [scrollProgress, setScrollProgress] = useState()
    const [scrollDirection, setScrollDirection] = useState()


      // socket.on("change_control", (data) => {
      //   setChangeType("change_control");
      //   setChangeData(data);
      // });
      // socket.on("change_product", (data) => {
      //   setChangeType("change_product");
      //   setChangeData(data);
      // });
      // socket.on('current_act_id', (data) => {
      //   setChangeType("change_current_act");
      //   setNewCurrAct(data.act_id)
      //   setChangeData(data);
      // })
      // socket.on('play_control', (data) => {
      //   setChangeType("change_product");
      //   setChangeData(data);
      // })
      // socket.on('message', (data) => {
      //  console.log('Received socket message on Canvas', data)
      //   setSocketMessage(data)
      //   switch (data.message.type) {
      //     case "change_frame" :
      //       setCurrFrameIndex(data.message.message.frame_index)
      //       setCurrScrollDirection(data.message.message.scroll_direction)
      //       break;
      //     case "control" :
      //       setChangeControl(data.message.message)
      //       break;
      //     case "play_pause" :
      //       setPlayPause(data.message.message)
      //       setPlayPauseToggle((prev)=>{
      //         const output = !prev
      //         console.log('toggling playPauseToggle to ', output)
      //       return output
      //       })
      //       break;
      //     case "change_variant" :
      //       setNewVariant(data.message.message);
      //       break;
      //       case "change_view" :
      //         setNewView(data.message.message);
      //         break;
      //     case "replay" :
      //       setReplay(data.message.message)
      //       break;
      //     case "change_item" :
      //       setNewItemId(data.message.message)
      //     break;
      //     case "change_chapter" :
      //       setNewChapterId(data.message.message)
      //     break;
      //     case "change_act" :
      //       setNewActId(data.message.message)
      //     break;
      //     case "change_interaction" :
      //       setNewInteractionId(data.message.message)
      //     break;
      //     case "run_interaction" :
      //       setRunInteractionId(data.message.message)
      //     break;
      //     case "scroll_progress" :
      //       setScrollProgress(data.message.message.scroll_progress * 100 )
      //       setScrollDirection(data.message.message.scroll_direction)
      //     break;
      //     case "change_environment" :
      //       setNewEnvironment(data.message.message)
      //     break;
          
      //   }
        
      // })

    return { changeType, changeData, setChangeData, newPlayMode, newCurrAct, socketMessage, newVariant, playPause, playPauseToggle, replay, changeControl, setChangeControl,  newView, newItemId, newChapterId, newActId, setNewActId, newInteractionId, runInteractionId, currFrameIndex, currScrollDirection, scrollProgress, scrollDirection, newEnvironment}
}

export default useSocket