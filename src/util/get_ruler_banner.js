import fetchModel from "./fetch_model";


const getRulerBanner = async (banner_file_path, size, callAPI) => {
  
    const blob1 = await fetchModel(
        "/canvas/get_ruler_banner?path="+banner_file_path+"&size="+size ,
        callAPI,
        "blob"
      );
      const imgUrl = window.URL.createObjectURL(blob1);
      
      return imgUrl
}

export default getRulerBanner