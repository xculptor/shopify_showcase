import { useEffect, useState } from "react";
import fetchModel from "../util/fetch_model";
import loadModel from "../util/load_model";
import useHttp from "./use_http";


const useHotspots = (hotspotList, loadingManager) => {
const [allHotspots, setAllHotspots] = useState([])
const { isLoading, error, sendRequest: callAPI } = useHttp();

useEffect(()=>{
    
    if (hotspotList && hotspotList.length > 0) {
      console.log('hotspotList', hotspotList)
        async function getHotspots(list) {
            const hotspotPromise = list.map(async (item) => {
              const blob = await fetchModel(
                "/canvas/get_hotspot?path=" + item.hotspot.hotspot_path,
                callAPI,
                "blob"
              );
              
              const text= item.is_banner ? item.text : ""
              const blob1 = await fetchModel(
                "/canvas/get_hotspot_banner?text="+text+"&width=250&height=100",
                callAPI,
                "blob"
              )
              const hotspotUrl = window.URL.createObjectURL(blob);
              const hotspotBannerUrl = window.URL.createObjectURL(blob1);
             
              console.log('Hotspot Item', item)
              return {
                hotspot_id: item.hotspot_id,
                link_id: item.link_id,
                object_link_id: item.object_link_id,
                tile_hz: item.hotspot.tile_hz,
                tile_vert: item.hotspot.tile_vert,
                start_tile: item.hotspot.start_tile,
                end_tile: item.hotspot.end_tile,
                speed: item.hotspot.speed,
                scale: item.scale,
                hotspot_url: hotspotUrl,
                hotspot_banner_url: hotspotBannerUrl
              };
            });
    
            Promise.all(hotspotPromise).then((hotspots) => {
              setAllHotspots(hotspots)
            });
          }
      
        async function loadHotspot() {
          const hotspots = await getHotspots(hotspotList);
          
          return hotspots;
        }
        loadHotspot();
      }
}, [hotspotList])

return allHotspots
}

export default useHotspots