const getObject = async (xid, scene, type) => {
 // console.log('type', type)
  const obj = []
  if(type === "OBJECT" || type === "LIGHT") {
 //   console.log('searching for -', type, xid, scene)
    scene.traverse(function (child) {
      if (child.userData && child.userData.xid && child.userData.xid === xid) {
        obj.push(child)
    //    console.log('found', child)
        //return child
      }
    });
    

  } else if (type === "LIGHT_TARGET") {
 //   console.log('SEARCHING FOR LIGHT_TARGET', xid)
    scene.traverse(function (child) {
  //    console.log("FOUND LIGHT TARGET", child)
      if (child.userData && child.userData.xid && child.userData.xid === xid) {
        obj.push(child.target)
        //return child.target
      }
    });
  
  }
//console.log('obj[0]', obj[0])  
return obj[0]
};

export default getObject;
