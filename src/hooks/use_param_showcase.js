import { useEffect, useState } from "react"

function useParamShowcase (originalShowcase, meta) {
    const [showcase, setShowcase] = useState()

    useEffect(()=>{
        if(originalShowcase && meta) {
            console.log(originalShowcase);
            console.log(meta)

            const newProducts = originalShowcase.products.map(product => {
                const isProductInMeta = meta.product === product.product_key ? true : false
                if(isProductInMeta) {
                    const newProperty = product.product.property.map(item => {
                        console.log('changingDefault - property', item)
                        const isProperty = meta.meta.property.filter(i => i.property_id === item.property_id).length > 0
                        if(isProperty) {
                            const newDefaultVarientId =  meta.meta.property.filter(i => i.property_id === item.property_id)[0].variant_id.toString()
                            console.log('changingDefault - new default variant id', newDefaultVarientId)
                            const newVarinats = item.variants.map(variant => {
                                console.log('changingDefault - variant', variant)
                                    if(variant.variant_id === newDefaultVarientId) {
                                         console.log('changingDefault - @@@@FOUND@@@@ variant', variant.variant_id)
                                        return { ...variant, is_default: true} 
                                    } else return { ...variant, is_default: false}
                                })
                                console.log('changingDefault - newVarinats', newVarinats)
                            return {...item, variants: newVarinats }
                        } else return item
                    })
                     console.log('changingDefault - new property', newProperty)
                    const newProduct = {...product.product, property: newProperty} 
                  return { ...product, product: newProduct}
                } else return product
            })

            console.log('changingDefault - newProducts', newProducts)
            setShowcase({ ...originalShowcase, products: newProducts})
            
        }
    }, [originalShowcase, meta])

return { showcase }
}

export default useParamShowcase