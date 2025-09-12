import { useEffect, useState } from "react"

function useElements (showcase, currActId, nextAct, setChangeControl, allRulers, currProduct, scene, isChangeRulerValue,  setIsChangeRulerValue, setIsNewRulerValue ) {
    const [isBack, setIsBack] = useState(false);
    const [actTitle, setActTitle] = useState("");
    const [actText, setActText] = useState("")
    const [isRunBack, setIsRunBack] = useState(false)
    const [runBackInteraction, setRunBackInteraction] = useState(false)
   
    useEffect(()=>{
        if(showcase && currActId) {
            //const firstAct = showcase.acts.filter((item) => item.is_launch_act === true)[0];
            const currAct = showcase.acts.filter((item) => item.act_id === currActId)[0];
            if(currAct.is_back_button === true) {
                setIsBack(true)
            } else {
                setIsBack(false)
            }
            setActTitle(currAct.act_title);
            setActText(currAct.act_text)
        }

    }, [showcase, currActId])

    function backClickHandler () {
            setIsChangeRulerValue(!isChangeRulerValue)
            setIsNewRulerValue(false)
              
            setIsRunBack(true)
            setRunBackInteraction(!runBackInteraction)

  }
  
    function exploreInsideHandler() {
      nextAct("04")
    }

    function checkSizeHandler () {
      nextAct("07")
    setIsChangeRulerValue(!isChangeRulerValue)
    setIsNewRulerValue(true)
    }

return { isBack, actTitle, actText, backClickHandler, isRunBack, setIsRunBack, runBackInteraction, exploreInsideHandler, checkSizeHandler }
}

export default useElements