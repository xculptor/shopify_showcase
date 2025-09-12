import { useEffect, useState } from "react"

const useShotList = (launchList, playerList) => {
    
    const [shotList, setShotList] = useState()
    const [interactionId, setInteractionId] = useState();
    const [isFirstInteractionId, setIsFirstInteractionId] = useState();

    useEffect(()=> {
        if(playerList && playerList.playerInteractionList && playerList.playerInteractionList.length > 0) {
            setInteractionId(playerList.id)
            setIsFirstInteractionId(playerList.isFirstId)
            setShotList(playerList.playerInteractionList)
    }

}, [playerList])

useEffect(()=> {

    if(launchList && launchList.launchInteractionList && launchList.launchInteractionList.length > 0) {
        setInteractionId(launchList.id)
        setIsFirstInteractionId(launchList.isFirstId)
        setShotList(launchList.launchInteractionList)
}

    }, [launchList])

return {interactionId, isFirstInteractionId,  shotList}
}

export default useShotList