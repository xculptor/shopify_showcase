import { useEffect, useState } from "react"

const useProductMaterialList = (scroll) => {
    const [modelList, setModelList] = useState()
    const [productList, setProductList] = useState()
    const [materialList, setMaterialList] = useState()
    const [propsList, setPropsList] = useState()
    const [hotspotList, setHotspotList] = useState()

    useEffect(()=>{
        const modelList = []
        const pList = [];
        const mList = [];
        const prList = [];
        const hotspotList = []
        
      if(scroll){  
        console.log('showcase in productmarketlist', scroll)
        for (let i = 0; i < scroll.products.length; i++) {
        const components = []
          for (let j = 0; j < scroll.products[i].product.components.length; j++) {
           
          if(modelList.findIndex(item => item.model_id === scroll.products[i].product.components[j].model.model_id) === -1){
            modelList.push({
              model_id : scroll.products[i].product.components[j].model.model_id,
              product_key : scroll.products[i].product_key,
              model_path: scroll.products[i].product.components[j].model.model_path,
              links: scroll.products[i].product.components[j].model.links,
              is_draco: scroll.products[i].product.components[j].model.is_draco,
              property: scroll.products[i].product.components[j].model.property
            })
          }
          components.push( {
            model_id: scroll.products[i].product.components[j].model.model_id,
            component_id: scroll.products[i].product.components[j].component_id,
            link_id: scroll.products[i].product.components[j].link_id
          })
        }
        pList.push({
          product_key: scroll.products[i].product_key,
          custom_values: scroll.products[i].custom_values ? scroll.products[i].custom_values : [],   
          default_material_variant: scroll.products[i].default_material_variant ? scroll.products[i].default_material_variant : [], 
          components: components,
         // is_curr_product_id: currProductId === scroll.products[i].product_id ? true : false   
        });

        //BUILD MATETIAL LIST
        if(scroll.products[i].product.property) {  
                
          for (let j = 0; j < scroll.products[i].product.property.length; j++) {
            const property = scroll.products[i].product.property[j]
            console.log('property', property)
          if (property.property_type === "material") {
            for (
              let k = 0;
              k < property.variants.length;
              k++
            ) {
              if (
                mList.filter(
                  (item) =>
                    item.name ===
                    property.variants[k].variant_name
                ).length === 0
              ) {
                const is_draco = property.variants[k].material.is_draco ? property.variants[k].material.is_draco : false
                mList.push({
                 product_id : scroll.products[i].product.product_id,
                  property_id: property.property_id,
                  variant_id: property.variants[k].variant_id,
                  is_default: property.variants[k].is_default, 
                  name: property.variants[k].material.material_name,
                  path: property.variants[k].material.material_file_path,
                  is_draco: is_draco
                });
              }
            }
          }
        }}
      }
      if( scroll.props && scroll.props.length > 0) {
        const props = scroll.props
       
        for(let i = 0; i < props.length; i++) {
          prList.push(props[i].prop_id)
        }
      }
      if(scroll.hotspots && scroll.hotspots.length > 0) {
        const hotspots = scroll.hotspots
       
        for(let i = 0; i < hotspots.length; i++) {
          hotspotList.push(hotspots[i])
        }
      }
      }
      
      setModelList(modelList)
      setProductList(pList);
      setMaterialList(mList);
      setPropsList(prList)
      setHotspotList(hotspotList)


    }, [scroll])
        
return { modelList, productList, materialList, propsList, hotspotList }
}

export default useProductMaterialList