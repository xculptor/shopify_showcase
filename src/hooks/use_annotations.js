import { useEffect, useState } from "react";
import createSprite from "../util/create_sprite";
import * as THREE from "three";
import { BoxHelper } from "three";

import useHttp from "./use_http";
import fetchModel from "../util/fetch_model";
import addDisplayShader from "../util/add_display_shader";
import createSpriteBanner from "../util/create_sprite_banner";

//&& experience.annotations && experience.aanoations.length > 0
const useAnnotations = (
  scene,
  showcase,
  currActId,
  allHotspots,
  modelList,
  xidList,
  isProductAdded,
  hotspotColor,
  loadingManager
) => {
  const { isLoading, error, sendRequest: callAPI } = useHttp();
  const [isAnnotationLoaded, setIsAnnotationLoaded] = useState(false);
  const [addedAnnotationList, setAddedAnnotationList] = useState([])

  useEffect(() => {
   
      setIsAnnotationLoaded(false);
      if (scene && showcase && currActId && isProductAdded && allHotspots && allHotspots.length > 0) {

        for(let i = 0; i < addedAnnotationList.length; i++) {
          scene.traverse(function (child) {
        if(child.userData && child.userData.xid && child.userData.xid === addedAnnotationList[i]) {
          child.visible = false;
        }
      })
        }
     //   console.log('currActId', currActId)
        const currActDetails = showcase.acts.filter(
          (item) => item.act_id === currActId
        )[0];
        //console.log('currActDetails', currActDetails)
        const hotspots = currActDetails.hotspots ? currActDetails.hotspots : [];
       // console.log("allHotspots", allHotspots);
        //console.log("hotspots", hotspots);
        
  
        const hotspotPromise = hotspots.map(async (item) => {
          const hotspotFile = allHotspots.filter(
            (i) => i.hotspot_id === item.hotspot_id
          )[0];

         // console.log('hotspotFile', hotspotFile)
          const spriteFile = hotspotFile.hotspot_url;
  
          const tileHz = Number(hotspotFile.tile_hz);
          const tileVert = Number(hotspotFile.tile_vert);
          const startTile = Number(hotspotFile.start_tile);
          const endTile = Number(hotspotFile.end_tile);
          const speed = Number(hotspotFile.speed);
          const objectLinkId = hotspotFile.object_link_id;
          const linkId = hotspotFile.link_id;
          const scale = hotspotFile.scale ? hotspotFile.scale : "0.1";
          const hotspotBannerUrl = hotspotFile.hotspot_banner_url
  
          const xid = xidList.filter((item) => item.link_id === objectLinkId)[0]
            .xid;
  
          const placement = item.placement
            ? item.placement
            : { u: 1, v: 0, w: 0 };
  
          const sprite01 = await loadSprite(
            spriteFile,
            tileHz,
            tileVert,
            startTile,
            endTile,
            speed,
            hotspotColor
          );

          let annotationAlreadyAdded = false
          if(addedAnnotationList.filter(item => item.xid === xid[0]).length>0){
            annotationAlreadyAdded = true
          }

          const sprite = await addSprite(scene, sprite01, linkId, scale, xid, placement, hotspotBannerUrl, annotationAlreadyAdded, setAddedAnnotationList, loadingManager);
          return sprite
        });
  
        Promise.all(hotspotPromise).then((sprite) => {
         // console.log('SPRITE', sprite)
          setIsAnnotationLoaded(true);
        });
  
        // if(hotspots.length === 0) {
        //   setIsAnnotationLoaded(true)
        // } else {
        //   for (let i = 0; i < hotspots.length; i++) {
  
        //     const hotspotFile = allHotspots.filter(
        //       (item) =>
        //         item.hotspot_id === hotspots[i].hotspot_id
        //     )[0]
        //     const spriteFile = hotspotFile.hotspot_url;
  
        //     const tileHz = Number(hotspotFile.tile_hz);
        //     const tileVert = Number(hotspotFile.tile_vert);
        //     const startTile = Number(
        //       hotspotFile.start_tile
        //     );
        //     const endTile = Number(hotspotFile.end_tile);
        //     const speed = Number(hotspotFile.speed);
        //     const objectLinkId = hotspots[i].object_link_id;
        //     const linkId = hotspots[i].link_id;
        //     const scale = hotspotFile.scale ? hotspotFile.scale: '0.1'
  
        //     const xid = xidList.filter(item => item.link_id === objectLinkId)[0].xid
  
        //     const placement = hotspots[i].placement
        //       ? hotspots[i].placement
        //       : { u: 1, v: 0, w: 0 };
  
        //   async function getSprite (spriteFile, tileHz, tileVert, startTile, endTile,speed,scene, linkId, scale, xid, placement ) {
        //     const sprite01 =  await loadSprite(spriteFile, tileHz, tileVert, startTile, endTile,speed)
        //   await addSprite(scene, sprite01, linkId, scale, xid, placement)
  
        //   }
  
        //    getSprite(spriteFile, tileHz, tileVert, startTile, endTile,speed,scene , linkId, scale, xid)
        //     .then(()=>{
        //       setIsAnnotationLoaded(true)
        //     });
        //   }
  
        // }
      } 
      
    
  }, [showcase, scene, currActId, isProductAdded, allHotspots]);

  return isAnnotationLoaded;
};

async function loadSprite(
  spriteFile,
  tileHz,
  tileVert,
  startTile,
  endTile,
  speed,
  hotspotColor
) {
  const sprite01 = await createSprite(
    spriteFile,
    tileHz,
    tileVert,
    startTile,
    endTile,
    speed,
    hotspotColor
  );
  return sprite01;
}

async function addSprite(scene, sprite01, linkId, scale, xid, placement, hotspotBannerUrl, annotationAlreadyAdded, setAddedAnnotationList, loadingManager) {
 // console.log("finding object to add hotspot", xid[0], sprite01);
if(annotationAlreadyAdded) {
      scene.traverse(function (child) {
        if(child.userData && child.userData.xid && child.userData.xid === linkId) {
          child.visible = true;
        }
      })
      } else {
  scene.traverse(function (child) {
   
    if (child.userData && child.userData.xid && child.userData.xid === xid[0]) {
      
      const bb = new THREE.Box3();
      bb.setFromObject(child, true);

     //const box = new THREE.BoxHelper( child, 0xff0000 );
     //scene.add( box );

      const size = bb.getSize(new THREE.Vector3());
      
      const center = bb.getCenter(new THREE.Vector3());

      sprite01.position.x =
        Number(placement.u) > 0.5
          ? center.x + (Number(placement.u) - 0.5) * size.x
          : center.x - (0.5 - Number(placement.u)) * size.x;
      sprite01.position.y =
        Number(placement.v) > 0.5
          ? center.y - (Number(placement.v) - 0.5) * size.y
          : center.y + (0.5 - Number(placement.v)) * size.y;
      sprite01.position.z =
        Number(placement.w) > 0.5
          ? center.z - (Number(placement.w) - 0.5) * size.z
          : center.z + (0.5 - Number(placement.w)) * size.z;
      
      sprite01.scale.set(Number(scale), Number(scale), 1);
      //sprite01.scale.set(1, 1, 1);
     // console.log('Adding hotspot Banner', hotspotBannerUrl)
      
      //Banner Position
      const direction = Number(placement.u) > 0.5 ? "RIGHT" : "LEFT"

      const bannerX =  direction === "RIGHT" ? sprite01.position.x + 0.25 * size.x : sprite01.position.x - 0.2 * size.x
      const bannerY = sprite01.position.y + size.y * 0.05
      const bannerZ = sprite01.position.z 
      const bannerPosition = new THREE.Vector3( bannerX, bannerY, bannerZ)

      //add line
      const LineMaterial = new THREE.LineBasicMaterial({
	                  color: 0x808080
              });
              const linePoints = []
              linePoints.push( sprite01.position );
              linePoints.push( bannerPosition );
              
              const lineGeo = new THREE.BufferGeometry().setFromPoints( linePoints )

          const line = new THREE.Line( lineGeo, LineMaterial );
          //line.userData.xid = linkId;
          
          const hotspot = new THREE.Group()
          hotspot.userData.xid = linkId
          hotspot.add( line );

      //Add Banner
      
     addDisplayShader(hotspot, "01", 0.10, 0.25, bannerX, bannerY, bannerZ, hotspotBannerUrl, xid, true, loadingManager)
     
      

     //createSpriteBanner(sprite01, hotspotBannerUrl)
      sprite01.userData.xid = linkId;
      setAddedAnnotationList(prevList => [...prevList, linkId])
      //console.log("adding Hotspot", sprite01);
      hotspot.add(sprite01);
      scene.add(hotspot)
      }

   
    
  }) 
};
  return sprite01
}

export default useAnnotations;
