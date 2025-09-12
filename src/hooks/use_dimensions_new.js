import { useEffect, useState } from "react";
import useHttp from "./use_http";
import fetchModel from "../util/fetch_model";

const useDimensionsNew = (experience) => {
  const [allRulers, setAllRulers] = useState([]);
  const { isLoading, error, sendRequest: callAPI } = useHttp();

  useEffect(() => {
    if (experience && experience.products && experience.products.length > 0) {

        // for(let i = 0; i < experience.products.length; i++) {
        //     const productKey = experience.products[i].product_key;
        //     const product = experience.products[i].product
        //     if(product.dimensions && product.dimensions.length > 0) {
        //         for(let j = 0; j < product.dimensions.length; j++) {
        //             const dimension = product.dimensions[j]
        //             const dimension_id = dimension.dimension_id
        //             const ruler_length_factor = dimension.ruler_length_factor;
        //             const list = dimension.values;
       
        //             const dimensionPromise = list.map(async (item) => {
        //                 const blob = await fetchModel(
        //                   "/canvas/get_ruler?"+"ruler_length_factor="+ruler_length_factor,
        //                   callAPI,
        //                   "blob"
        //                 );
        //                 const imgUrl = window.URL.createObjectURL(blob);
        //                 return {
        //                   key: item.key,
        //                   value: item.value,
        //                   url: imgUrl,
        //                 };
        //               });
              
        //               Promise.all(dimensionPromise).then((d) => {
        //                 setAllRulers((prevItem) => [
        //                   ...prevItem,
        //                   { product_key: productKey,
        //                     dimension_id: dimension_id,
        //                     object_link_id: dimension.object_link_id, 
        //                     link_id: dimension.link_id,
        //                     lineScale: dimension.line_scale,
        //                     lineOffset: dimension.line_offset,
        //                     image: d },
        //                 ]);
        //               });
              

        //         }
                
        //     }

        // }
    
    }
  }, [experience]);

 
};

export default useDimensionsNew;
