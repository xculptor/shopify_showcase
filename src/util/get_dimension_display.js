import fetchModel from "./fetch_model";


const getDimensionDisplay = async (item, display, callAPI) => {
 // console.log('display', display)
    const blob1 = await fetchModel(
        "/canvas/get_dimension_display?axis="+item.axis+
          "&is_ruler="+item.is_ruler+
          "&is_display="+item.is_display+
          "&aspect_ratio="+item.aspect_ratio+
          "&value="+item.value+
          "&display_is_border="+display.is_border+
          "&display_border_width="+display.border_width+
          "&display_border_color="+display.border_color+
          "&display_border_radius="+display.border_radius+
          "&display_is_background="+display.is_background+
          "&display_background_color="+display.background_color+
          "&display_font_type="+display.font_type+
          "&display_font_color="+display.font_color,
        callAPI,
        "blob"
      );
      const imgUrl = window.URL.createObjectURL(blob1);
      
      return imgUrl
}

export default getDimensionDisplay