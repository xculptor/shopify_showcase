import { useEffect, useState } from "react";
import useHttp from "./use_http";
import fetchModel from "../util/fetch_model";
import getDimensionRuler from "../util/get_dimension_ruler";
import getDimensionDisplay from "../util/get_dimension_display";
import getGlb from "../util/get_glb";
import getRulerBanner from "../util/get_ruler_banner";

const useRulers = (scroll, xidList, loadingManager) => {
  
  const [allRulers, setAllReulers] = useState([])
  const { isLoading, error, sendRequest: callAPI } = useHttp();

  useEffect(() => {
    if (xidList && xidList.length > 0 && scroll && scroll.rulers && scroll.rulers.length > 0) {
      console.log('ruler', scroll.rulers)
      const rulerPromise = scroll.rulers.map(async (item) => {  
        
          const scale = await getGlb("/canvas/get_ruler_scale?path="+item.ruler.scale_file_path, callAPI, loadingManager)
          const banner = await getRulerBanner(item.ruler.banner_file_path, "11 cm", callAPI)
          const arrowhead = await getGlb("/canvas/get_ruler_arrowhead?path="+item.ruler.arrowhead_file_path, callAPI, loadingManager)
          scale.scene.name = 'scale'
          arrowhead.scene.name = 'arrowhead'
          console.log('xidList', xidList)
          const product_key = xidList.filter(i => i.link_id === item.object_link_id )[0].product_key
          const size = scroll.products.filter(item => item.product_key === product_key)[0].product.size.filter(i => i.link_id === item.object_link_id  )[0] 
          const bannerX = await getRulerBanner(item.ruler.banner_file_path, size.x, callAPI)
          const bannerY = await getRulerBanner(item.ruler.banner_file_path, size.y, callAPI)
          const bannerZ = await getRulerBanner(item.ruler.banner_file_path, size.z, callAPI)
          console.log('size', size)
          console.log('scale',scale)
          console.log('arrowhead', arrowhead)        
          return {
                  ruler_id: item.ruler.ruler_id,
                  ruler_key: item.ruler_key,
                  product_key: product_key,
                  link_id: item.link_id,
                  object_link_id: item.object_link_id,
                  offset: item.offset,
                  scale: item.scale,
                  visible: item.visible,
                  is_scale: item.is_scale,
                  is_arrowhead: item.is_arrowhead,
                  is_banner: item.is_banner,
                  scale_axis: item.ruler.scale_axis,
                  scale_object: scale.scene,
                  arrowhead_object: arrowhead.scene,
                  banner_object: banner,
                  banner_object_x : bannerX,
                  banner_object_y : bannerY,
                  banner_object_z : bannerZ
              };
      })
      Promise.all(rulerPromise).then( (d) => {
        setAllReulers(prevItem => [...prevItem, ...d])
        console.log('rulerPromise', d)
      }

      )

                
        
    
    }
  }, [scroll, xidList]);

  return allRulers;
};

export default useRulers;
