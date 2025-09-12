import { useEffect, useState } from "react"

function useScrollFrame (scroll, pageHeight ) {

const [frameList, setFrameList] = useState([])
 
useEffect(()=>{
    if(scroll && pageHeight) {
        
        setFrameList([])
        const frameCount = Number(scroll.frames.frame_count)
        const snapScrolSteps = Number(scroll.frames.snap_scroll_steps)
        const frameList = []
        
        //const sections = scroll.page.sections
        
        let scrollTop = 0
        // for(let i = 0; i < sections.length; i++) {
        //     totalFrameCount += Number(sections[i].frame_count)
        // }
        const frameHeight = pageHeight / frameCount

        for(let i = 0; i < frameCount; i++) {
                {
                frameList.push({
                    frame_index: i,
                    scroll_top: scrollTop,
                    is_first_frame: i === 0 ? true : false,
                    is_last_frame: i === frameCount -1  ? true : false
                })
                scrollTop += frameHeight
            }
        }

        setFrameList(frameList)

    }
}, [scroll, pageHeight])

return { frameList }
}

export default useScrollFrame