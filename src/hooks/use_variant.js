import { useEffect } from "react";

const useVariant = (newVariant, currProduct, allMaterials, scene, modelList, xidList) => {
  useEffect(() => {
    if (newVariant && currProduct && scene) {
    //  console.log('newVariant', newVariant)

      
   
      const propertyType = currProduct.product.property.filter(
        (item) => item.property_id === newVariant.property_id
      )[0].property_type
      
     // console.log('propertyType', propertyType)

    switch(propertyType) {
      case "material":
        const linkIdList = currProduct.product.property.filter(
          (item) => item.property_id === newVariant.property_id
        )[0].link_id;
        const newMaterial = allMaterials.filter(item => item.variant_id === newVariant.variant_id)[0].material
        if (linkIdList.length > 0) {
          for (let i = 0; i < linkIdList.length; i++) {
            
            const xid = xidList.filter(item => item.link_id === linkIdList[i])[0].xid
            
            for(let j = 0; j < xid.length; j++) {
                scene.traverse(function (child) {
                    if (
                      child.userData &&
                      child.userData.xid &&
                      child.userData.xid === xid[j]
                    ) {
                      if(child.isMesh) {
                          child.material = newMaterial
                      }
                    }
                  });
            }
            
          }
        } 
      break;
      case "part":
        const variant = currProduct.product.property
        .filter((item) => item.property_id === newVariant.property_id
        )[0].variants
        .filter(item => item.variant_id === newVariant.variant_id)[0]
        
       // console.log(currProduct)
      //  console.log("PART", variant)

        const linkIdAdd = variant.link_id_add;
        const linkIdRemove = variant.link_id_remove;
       // console.log('linkIdAdd', linkIdAdd)

        for(let i = 0; i < linkIdAdd.length; i++) { 
          const xid = xidList.filter(item => item.link_id === linkIdAdd[i])[0].xid
          for(let j = 0; j < xid.length; j++) {
            scene.traverse(function(child){
              if(child.userData && child.userData.xid) {
                if(child.userData.xid === xid[j]) {
                //  console.log('setting true')
                  child.visible = true
                }
              } 
            })
          } 
        }

        for(let i = 0; i < linkIdRemove.length; i++) { 
          const xid = xidList.filter(item => item.link_id === linkIdRemove[i])[0].xid
          for(let j = 0; j < xid.length; j++) {
            scene.traverse(function(child){
              if(child.userData && child.userData.xid) {
                if(child.userData.xid === xid[j]) {
                 // console.log('setting false')
                  child.visible = false
                }
              } 
            })
          } 
        }
      break;

    }  
    
  }

  }, [newVariant, currProduct]);
};

export default useVariant;
