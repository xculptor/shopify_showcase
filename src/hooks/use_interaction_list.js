import { useEffect, useState } from "react"

import usePlayerInteractionList from "./use_player_interaction_list"
import useLaunchInteractionList from "./use_launch_interaction_list"


const useInteractionList = (experience, collection, newView, currStates, currItemId, runInteractionId) => {
    
    const [shotList, setShotList] = useState()
    const launchList = useLaunchInteractionList(collection, experience, currItemId)
    const playerList = usePlayerInteractionList(collection, experience, runInteractionId, currStates)
    
    const [interactionId, setInteractionId] = useState();
    const [isFirstInteractionId, setIsFirstInteractionId] = useState();
    
useEffect(()=>{
    if(playerList && playerList.playerInteractionList && playerList.playerInteractionList.length > 0) {
        setInteractionId(playerList.id)
        setIsFirstInteractionId(playerList.isFirstId)
        setShotList(playerList.playerInteractionList)
}
}, [playerList])

useEffect(()=>{
    if(launchList && launchList.launchInteractionList && launchList.launchInteractionList.length > 0) {
        setInteractionId(launchList.id)
        setIsFirstInteractionId(launchList.isFirstId)
        setShotList(launchList.launchInteractionList)
}
}, [launchList])



return {  interactionId, isFirstInteractionId,  shotList}
}

export default useInteractionList

