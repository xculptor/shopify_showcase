import { useEffect, useState } from "react";
import useHttp from "./use_http";
import fetchModel from "../util/fetch_model";

const useDimensions = (experience) => {
  const [allDimensions, setAllDimensions] = useState([]);
  const { isLoading, error, sendRequest: callAPI } = useHttp();

  useEffect(() => {
    if (experience && experience.products && experience.products.length > 0) {

        for(let i = 0; i < experience.products.length; i++) {
            const productKey = experience.products[i].product_key;
            const product = experience.products[i].product
            if(product.dimensions && product.dimensions.length > 0) {
                for(let j = 0; j < product.dimensions.length; j++) {
                    const dimension = product.dimensions[j]
                    const dimension_id = dimension.dimension_id
                    const width = dimension.width;
                    const height = dimension.height;
                    const is_border = dimension.is_border;;
                    const border_width = dimension.border_width;
                    const border_radius = dimension.border_radius
                    const border_color = dimension.border_color;
                    const is_background = dimension.is_background;
                    const background_color = dimension.background_color;
                    const font_type = dimension.font_type;
                    const font_color = dimension.font_color;
                    const list = dimension.values;
                    const ruler_length_factor = dimension.ruler_length_factor;

       
                    const dimensionPromise = list.map(async (item) => {
                        const blob = await fetchModel(
                          "/canvas/get_dimension?value=" +
                            item.value + "&width=" + width + "&height=" + height +
                            "&is_border=" + is_border +
                              "&border_width=" + border_width +
                              "&border_color=" + border_color +
                              "&is_background=" + is_background +
                            "&background_color=" +
                            background_color +
                            "&font_type=" +
                            font_type +
                            "&font_color=" +
                            font_color + "&border_radius="+border_radius+"&ruler_length_factor="+ruler_length_factor,
                          callAPI,
                          "blob"
                        );
                        const imgUrl = window.URL.createObjectURL(blob);
                        return {
                          key: item.key,
                          value: item.value,
                          url: imgUrl,
                        };
                      });
              
                      Promise.all(dimensionPromise).then((d) => {
                        setAllDimensions((prevItem) => [
                          ...prevItem,
                          { product_key: productKey,
                            dimension_id: dimension_id,
                            object_link_id: dimension.object_link_id, 
                            link_id: dimension.link_id,
                            isLine: dimension.is_line,  
                            lineColor: dimension.line_color,
                            lineScale: dimension.line_scale,
                            lineOffset: dimension.line_offset,
                            dimension: d },
                        ]);
                      });
              

                }
                
            }

        }
    
    }
  }, [experience]);

  return allDimensions;
};

export default useDimensions;
