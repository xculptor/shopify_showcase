import fetchModel from "./fetch_model";


const getDimensionRuler = async (item, ruler, callAPI) => {
    const blob1 = await fetchModel(
        "/canvas/get_dimension_ruler?axis="+item.axis+
          "&is_ruler="+item.is_ruler+
          "&is_display="+item.is_display+
          "&aspect_ratio="+item.aspect_ratio+
          "&value="+item.value+
          "&ruler_is_background="+ruler.is_background+
          "&ruler_is_border="+ruler.is_border+
          "&ruler_background_color="+ruler.background_color+
          "&ruler_template="+ruler.template,
        callAPI,
        "blob"
      );
      const imgUrl = window.URL.createObjectURL(blob1);
      
      return imgUrl
}

export default getDimensionRuler