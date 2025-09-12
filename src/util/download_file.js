const downloadFile = async (file, name) => {
    //console.log("blob", blob);
    //const blobURL = URL.createObjectURL(blob);
    const fileName = name ? name : "test.glb";
    const aTag = document.createElement("a");
    aTag.href =  file; //blobURL;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  export default downloadFile