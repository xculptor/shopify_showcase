import { useEffect, useState } from "react"
import useHttp from "./use_http";
import sendSocketMessage from "../util/send_socket_message";

const useCurrProduct = (scroll, sessionId) => {
    const [currProductKey, setCurrProductKey] = useState()
    const [currProduct, setCurrProduct] = useState()
    const [isCurrProductLoaded, setIsCurrProductLoaded] = useState(false)
    const { isLoading, error, sendRequest: callAPI } = useHttp();

    
    useEffect(()=>{
        if(scroll) {
            if(scroll.products && scroll.products.length > 0) {

                const currProductKey = scroll.products[0].product_key
                const currProduct = scroll.products[0]
                setCurrProductKey(currProductKey)
                setCurrProduct(currProduct)
                setIsCurrProductLoaded(false)
                sendSocketMessage({type: "curr_product_key", message: currProductKey }, sessionId, callAPI)
            }
        }

    }, [scroll])
return { currProduct, currProductKey, setCurrProductKey, isCurrProductLoaded, setIsCurrProductLoaded}
}

export default useCurrProduct