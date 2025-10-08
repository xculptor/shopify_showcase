import { useEffect } from "react";

function useRulerControl (allRulers, scene, currProduct, rulerControl) {

    useEffect(()=>{
        if(allRulers && allRulers.length > 0 && scene && currProduct) {
           // console.log('Setting RULER', rulerControl, "for", currProduct)
        const xid = allRulers.filter(item => item.object_link_id === currProduct.product.components[0].link_id)[0].link_id    

        scene.traverse(function (child) {
                   // console.log('Setting RULER', child.userData.xid, xid)
                     if(child.userData && child.userData.xid && child.userData.xid === xid) {
 //console.log('Setting RULER FOUND')
                        const x = child.visible
                        child.visible = !x
                        
                                       
                 }})
                 
        }
 
    }, [allRulers, scene, currProduct, rulerControl])
}

export default useRulerControl