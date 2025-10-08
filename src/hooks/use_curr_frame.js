import { useEffect, useState } from "react"

function useCurrFrame () {
    const [newScrollTimeStamp, setNewScrollTimeStamp] = useState()

    useEffect(()=>{
        //console.log('newScrollTimeStamp',newScrollTimeStamp)
    }, [newScrollTimeStamp])

return {newScrollTimeStamp, setNewScrollTimeStamp}
}

export default useCurrFrame