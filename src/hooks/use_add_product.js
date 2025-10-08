import { useEffect, useState } from "react"

import * as THREE from "three";
import { Vector3  } from "three";
import resetCamera from "../util/reset_camera";

const useAddProduct = (scene, camera, showcase, orbitControls, allModels, currProduct, allMaterials, isCurrProductLoaded, currViewport, xidList, defaultMaterial) => {
    const [modelList, setModelList] = useState()
    const [currModelXid, setCurrModelXid] = useState([])
    const [addedProductList, setAddedProductList] = useState([])
    const [isProductAdded, setIsProductAdded] = useState(false)
    const [isAddMat, setIsAddMat] = useState(false)
    const [isAddRuler, setIsAddRuler] = useState(false)
    const [currProductAdded, setCurrProductAdded] = useState()
    const [isDefaultProductAdded, setIsDefaultProductAdded] = useState(false)
    
    useEffect(()=>{
       // console.log('defaultMaterial', defaultMaterial)
        if(scene && allModels && allModels.length > 0 && currProduct && isCurrProductLoaded && currViewport && defaultMaterial && defaultMaterial.length > 0 && !isDefaultProductAdded) {
            for(let i = 0; i < currProduct.product.components.length; i++) {
                const component = currProduct.product.components[i]
            const modelId = component.model.model_id
            const material = defaultMaterial.material
            
            const model = allModels.filter(item => item.model_id === modelId)[0].model
            model.name = 'PRODUCT'
             setCurrModelXid(prevList => [...prevList, model.userData.xid])
             setAddedProductList(prevList => [...prevList, model])
              const customValues = currProduct.custom_values
              //Custom Values
                for(let i = 0; i < customValues.length; i++) {
                    const prop = customValues[i].property
                    const val = customValues[i].value
                    const prop1 = prop.split(".")[0]
                    const prop2 = prop.split(".")[1]
                    model[prop1][prop2] = Number(val)
                }
              scene.add(model)
             //ADD Material
             for(let i = 0; i < currProduct.product.property.length; i++) {
                    const property = currProduct.product.property[i]
                  if(property.property_type==='material') {
                    const variant = property.variants.filter(item => item.is_active && item.is_default)[0]
                   // console.log('variant', variant)
                    const material = defaultMaterial.filter(item => item.property_id === property.property_id)[0].material
                    
                   // console.log('Applying material', property)
                   
                    for(let i = 0; i < property.link_id.length; i++) {
                       
                        const xids = xidList.filter(item => item.link_id === property.link_id[i])[0].xid
                        for(let j = 0; j < xids.length; j++) {
                            scene.traverse(function (child) {
                                
                                if(child.isMesh && child.userData && child.userData.xid && child.userData.xid === xids[j]) {
                                    material.envMapIntensity = 1 //Number(showcase.environment[0].hdri[0].intensity) //To be corrected
                                    child.material = material
                                }
                            })
                        }
                    }
                  }
                    
                    
                    
                }

                //MATERIAL ADDED
           



                setIsProductAdded(true)
              setCurrProductAdded(currProduct)
                setIsAddRuler(true)
                setIsDefaultProductAdded(true)
            }
        }
    }, [scene, allModels, currProduct, isCurrProductLoaded, currViewport, defaultMaterial])

    useEffect(()=>{
        
        setModelList([])
        if(scene && allModels && allModels.length > 0 && currProduct && isCurrProductLoaded && currViewport && isDefaultProductAdded) {
          // console.log('currProduct', currProduct, xidList)
        if(currModelXid.length > 0) {
           
            for(let i = 0; i < currModelXid.length; i++) {
                scene.traverse(function (child) {
                    if(child.userData && child.userData.xid && child.userData.xid === currModelXid[i] ) {
                        
                        child.visible = false
                    }
                })
            }
            setCurrModelXid([])
        }
        
        const customValues = currProduct.custom_values

        for(let i = 0; i < currProduct.product.components.length; i++) {
         
            
            const component = currProduct.product.components[i]
            const modelId = component.model.model_id

            
            const model = allModels.filter(item => item.model_id === modelId)[0].model
            model.name = 'PRODUCT'
            
            setCurrModelXid(prevList => [...prevList, model.userData.xid])
            setModelList(prevList => [...prevList, component.model])
            
            if(addedProductList.findIndex(item => item.userData.xid === model.userData.xid) === -1) {
                applyCustomValues(showcase)
                 resetCamera(showcase, currProduct, camera, currViewport, orbitControls);
               

                //Custom Values
                for(let i = 0; i < customValues.length; i++) {
                    const prop = customValues[i].property
                    const val = customValues[i].value
                    const prop1 = prop.split(".")[0]
                    const prop2 = prop.split(".")[1]
                    model[prop1][prop2] = Number(val)
                }

                //
               // console.log('ADDINING MODEL TO SCENEeee', model)
                
                 
                model.castShadow = true
                
                scene.add(model)
                
                //RESET CAMERA TO GET COMPLETE VIEW OF PRODUCT
                const box = new THREE.Box3();
                box.setFromObject(model);
                const size = box.getSize(new Vector3()).length();
                const center = box.getCenter(new Vector3());
                //camera.position.z += size / 1.5 ;
               
               // console.log('center', center)
                //orbitControls.target = center
                
                setCurrProductAdded(currProduct)
                setIsAddRuler(true)
                setIsAddMat(true)
                setAddedProductList(prevList => [...prevList, model])
            } else {
                resetCamera(showcase, currProduct, camera, currViewport, orbitControls)
                
                scene.traverse(function ( child ) {
                    if(child.userData && child.userData.xid && child.userData.xid === model.userData.xid) {
                        child.visible = true
                        setCurrProductAdded(currProduct)
                        setIsAddRuler(true)
                        //RESET CAMERA TO GET COMPLETE VIEW OF PRODUCT
                const box = new THREE.Box3();
                box.setFromObject(child);
                const size = box.getSize(new Vector3()).length();
                const center = box.getCenter(new Vector3());
               
                    }
                })
            }
            

        }
        
       // console.log('Setting IsProductAdded')
        setIsProductAdded(true)
         }
    

    }, [scene, allModels, currProduct, isCurrProductLoaded, currViewport])

    useEffect(()=>{
        if(scene && allMaterials && allMaterials.length > 0 && isAddMat) {
           // console.log('Applying material', allMaterials, 'currProduct', currProduct)
            
            if(modelList && modelList.length > 0) {
                for(let i = 0; i < currProduct.product.property.length; i++) {
                    const property = currProduct.product.property[i]
                  if(property.property_type==='material') {
                    const variant = property.variants.filter(item => item.is_active && item.is_default)[0]
                   // console.log('variant', variant)
                    const material = allMaterials.filter(item => item.variant_id === variant.variant_id)[0].material
                   
                   // console.log('Applying material', property)
            
                    for(let i = 0; i < property.link_id.length; i++) {
                       
                        const xids = xidList.filter(item => item.link_id === property.link_id[i])[0].xid
                        for(let j = 0; j < xids.length; j++) {
                            scene.traverse(function (child) {
                                
                                if(child.isMesh && child.userData && child.userData.xid && child.userData.xid === xids[j]) {
                                    material.envMapIntensity = Number(showcase.environment.hdri[0].intensity)
                                    child.material = material
                                }
                            })
                        }
                    }
                  }
                    
                    
                    
                }
            }
            setIsAddMat(false)
        }
        
    }, [scene, allMaterials, isAddMat])

    return {isProductAdded, isAddRuler, setIsAddRuler, currProductAdded}
}

function applyCustomValues (showcase) {
    //console.log(showcase)
}


export default useAddProduct