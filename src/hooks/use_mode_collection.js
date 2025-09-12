import { useEffect, useState } from "react"
import useHttp from "./use_http";
import sendSocketMessage from "../util/send_socket_message";


const useModeCollection = (experience, sessionId, newItemId) => {
    const { isLoading, error, sendRequest: callAPI } = useHttp();
    const [collection, setCollection] = useState()
    const [currItemId, setCurrItemId] = useState()
useEffect(()=>{
    if(experience && experience.collections && experience.collections.length > 0) {
        const currCollection = experience.collections.filter(item => item.is_default)[0]
        const currItemId = currCollection.items[0].item_id
        setCollection(currCollection)
        setCurrItemId(currItemId)
        sendSocketMessage({type: "curr_item_id", message: currItemId }, sessionId, callAPI)
    }
}, [experience])

useEffect(()=> {
if(newItemId) {
    if(experience && experience.collections && experience.collections.length > 0) {
        const currItemId = newItemId.item_id        
        setCurrItemId(currItemId)
        sendSocketMessage({type: "curr_item_id", message: currItemId }, sessionId, callAPI)
    }
}
}, [newItemId])


return {collection, currItemId}
}

export default useModeCollection