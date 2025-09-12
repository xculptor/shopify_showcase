import { useEffect, useState } from "react"

const useXid = ( modelList, showcase) => {
    const [isRefresh, setIsRefresh] = useState(false)
    const [xidList, setXidList] = useState([])
    
    useEffect(()=>{
        if(modelList && !isRefresh) {
            console.log('xid refresh')
            setXidList([])
            setIsRefresh(true)
        }
    }, [modelList])



    useEffect(()=>{
        if(isRefresh) {
            //*************LIGHTS***************
            // if(experience.lights && experience.lights.length > 0) {
            //     for( let i = 0; i < experience.lights.length; i++) {
            //         const linkId = experience.lights[i].link_id;
            //         const xid = linkId;
            //         const xidItem = {
            //             type: 'light',
            //             link_id: linkId,
            //             xid: [xid],
                        
            //         }
            //         setXidList(prevItem => [...prevItem, xidItem])
            //     }
            // }

            //*************HOTSPOTS***************
            // if(experience.showcases && experience.showcases.length > 0) {
            //     for(let i = 0; i < experience.showcases.length; i++ ) {
            //         const showcase = experience.showcases[i]
            //         if(showcase.acts && showcase.acts.length > 0) {
            //             for( let j = 0; j < showcase.acts.length; j++) {
            //                 const act = showcase.acts[j]
            //                 if(act.hotspots && act.hotspots.length > 0) {
            //                     for(let k = 0; k < act.hotspots.length; k++) {
            //                         const hotspot = act.hotspots[k] 
            //                         const xidItem = 
            //                             {
            //                                 type: 'hotspot',
            //                                 link_id: hotspot.link_id,
            //                                 xid: [hotspot.link_id],
            //                             }
            //                         setXidList(prevItem => [...prevItem, xidItem])
            //                     }
            //                 }
            //             }
            //         }
            //     }
                
            // }

            //*************ORBITCONTROLS***************
            // setXidList(prevItem => [...prevItem, 
            //             {
            //                 type: 'orbit_control', 
            //                 link_id: 'ORBITCONTROLS',
            //                 xid: ['ORBITCONTROLS']
            //                 ,
            //             }
            //         ])
            
            //*************CAMERA***************
            // setXidList(prevItem => [...prevItem, 
            //     {
            //         type: 'camera', 
            //         link_id: 'CAMERA',
            //         xid: ['CAMERA'],
            //     }
            // ])
            //Add Hotspot xid
            

        }
    }, [isRefresh])

    useEffect(()=>{
        //*************OBJECTS***************
        if(isRefresh) {
            if(modelList.length > 0) {
                for (let i = 0; i < modelList.length; i++) {
                  const links = modelList[i].links
                  if(links.length > 0) {
                    for (let j = 0; j < links.length; j++) {
                        setXidList(prevItem => [...prevItem, 
                            {
                                type: 'object', 
                                product_key: modelList[i].product_key,
                                link_id: modelList[i].links[j].link_id,
                                xid: modelList[i].links[j].xid,
                            }
                        ])
                    }
                  }
                }
              }

              
        }

        //*************HOTSPOTS***************
            if(showcase) {
                
                    if(showcase.acts && showcase.acts.length > 0) {
                        for( let j = 0; j < showcase.acts.length; j++) {
                            const act = showcase.acts[j]
                            if(act.hotspots && act.hotspots.length > 0) {
                                for(let k = 0; k < act.hotspots.length; k++) {
                                    const hotspot = act.hotspots[k] 
                                    const link_id = showcase.hotspots.filter(item => item.hotspot_id === hotspot.hotspot_id)[0].link_id
                                    const xidItem = 
                                        {
                                            type: 'hotspot',
                                            link_id: link_id,
                                            xid: [link_id],
                                        }
                                    setXidList(prevItem => [...prevItem, xidItem])
                                }
                            }
                        }
                    }
                
                
            }

    }, [isRefresh, modelList])

return xidList

}

export default useXid