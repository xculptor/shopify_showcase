const getXid = (experience, modelList, linkId) => {
    if (modelList && linkId) {  
        
        const hotspots = experience.hotspots ? experience.hotspots : [];
     
        if(modelList.length > 0) {
          for (let i = 0; i < modelList.length; i++) {
            const links = modelList[i].links
            if(links.length > 0) {
              for (let j = 0; j < links.length; j++) {
                if (
                  links[j].link_id === linkId
                ) {
                  return links[j].xid
                }
              }
            }
          }
        }
        
        // if (hotspots.length > 0) {
        //   for (let i = 0; i < hotspots.length; i++) {
        //         if (
        //           hotspots[i].link_id === linkId
        //         ) {
        //           return hotspots[i].xid
        //         }
            
        //   }
        // }

        if(linkId === 'CAMERA') {
          return ['CAMERA']
        }
        if(linkId === 'CLIP') {
          return ['CLIP']
        }
        if(linkId === 'ORBITCONTROLS') {
          return ['ORBITCONTROLS']
        }
      
    }
    return "NA";
};

export default getXid;