import { useEffect, useState } from "react"

function useFrameAnimation (scroll, initialValues) {
    
    const [frameAnimationList, setFrameAnimationList] = useState()

   
    useEffect(()=>{
        if(initialValues && initialValues.length > 0 && scroll && scroll.actions && scroll.actions.length > 0 ) {
            console.log('INITIAL VALUES', initialValues)
            const animationList = scroll.actions.filter(item => item.is_active === true)
            const sections = scroll.page.sections
            console.log('animationList', animationList, 'sections', sections)
            
            const frameAnimationList = []
            
            for(let i = 0; i < animationList.length; i++) {
            
            const initialValue = initialValues.filter(item => item.action_id === animationList[i].action_id_id)[0]
            const frameCount = Number(animationList[i].end_frame) - Number(animationList[i].start_frame)  

            let x = initialValue.action_values.x
            let y = initialValue.action_values.y
            let z = initialValue.action_values.z

            for( let j = Number(animationList[i].start_frame); j < Number(animationList[i].end_frame)+1; j++) {
                
                x += Number(animationList[i].action_values.x) / frameCount
                y += Number(animationList[i].action_values.y) / frameCount
                z += Number(animationList[i].action_values.z) / frameCount

                const frameAnimationItem1 = {
                    ...animationList[i],
                    frame_index: j,
                    scroll_direction: "down",
                    action_values: {
                        x: x,
                        y: y,
                        z: z,
                    }
                }
                const frameAnimationItem2 = {
                    ...animationList[i],
                    frame_index: j,
                    scroll_direction: "up",
                    action_values: {
                        x: x,
                        y: y,
                        z: z,
                    }
                }
                
                frameAnimationList.push(frameAnimationItem1, frameAnimationItem2)
    
           
            }
            
             } 
            setFrameAnimationList(frameAnimationList)
        }
        
    }, [scroll, initialValues])

    return frameAnimationList

}

export default useFrameAnimation

