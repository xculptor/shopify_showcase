import createRuler from "./create_ruler";
import getXid from "./get_xid";
import downloadFile from "../util/download_file"

const changeControls = (renderer, currProduct, allRulers, scene, camera, experience, orbitControls, prop, value) => {
   
    switch (prop) {
        case "autoRotate":
          //  console.log('autoRotate', value)
            const newVal = value === 'true' ? true : false
            orbitControls.autoRotate = newVal //=== 'true'? true : false
            break;
        case "ruler":
           // console.log('RRRUUUULLLLEEEERRRR')
           // console.log(currProduct)
          //  console.log(value)
            
                 const xid = allRulers.filter(item => item.object_link_id === currProduct.product.components[0].link_id)[0].link_id
             //    console.log(xid)
                 scene.traverse(function (child) {
              //      console.log(child.userData.xid, xid)
                     if(child.userData && child.userData.xid && child.userData.xid === xid) {
             //           console.log('setting :', value)     
                        const x = child.visible
                        child.visible = !x                   
                 }}) 
            break;
            case "restart":
             //   console.log('reStart');
                
                break;
            case "resetCamera":
             //   console.log('resetCamera');
                const cameraPosition = experience.cameras.filter(item => item.is_default)[0].camera_position
                const cameraTarget = experience.orbit_control.target
                camera.position.x = cameraPosition.x;
                camera.position.y = cameraPosition.y;
                camera.position.z = cameraPosition.z;
                orbitControls.target.x = cameraTarget.x;
                orbitControls.target.y = cameraTarget.y;
                orbitControls.target.z = cameraTarget.z;
                break;
            case "takeSnapshot":
              //  console.log("takeSnapshot");
                const strMime = "image/png";
                const strDownloadMime = "image/octet-stream";
                renderer.render(scene, camera)
                const imgData = renderer.domElement.toDataURL(strMime);
                downloadFile(imgData.replace(strMime, strDownloadMime), "snapshot.png");
                break;
    }
}

export default changeControls