import { useEffect, useState } from "react"

function useUIElements (ui) {
    const [top, setTop] = useState(10)
    const [left, setLeft] = useState(10)
    const [isBackground, setIsBackground] = useState(true)
    const [background, setBackground] = useState("linear-gradient(red, yellow)")
    const [opacity, setOpacity] = useState(1)
    const [isBorder, setIsBorder] = useState(true)
    const [border, setBorder] = useState(0)
    const [borderColor, setBorderColor] = useState("linear-gradient(green, blue)")
    const [isBoxShadow, setIsBoxShadow] = useState(true)
    const [boxShadow, setBoxShadow] = useState("0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)")
    const [titleFontName, setTitleFontName] = useState("helvetica")
    const [titleFontStyle, setTitleFontStyle] = useState("regular")
    const [titleFontColor, setTitleFontColor] = useState("#000000")
    const [titleFontSize, setTitleFontSize] = useState("14px")
    const [textFontName, setTextFontName] = useState("helvetica")
    const [textFontStyle, setTextFontStyle] = useState("regular")
    const [textFontColor, setTextFontColor] = useState("#000000")
    const [textFontSize, setTextFontSize] = useState("14px")
    const [buttonVariant, setButtonVariant] = useState("contained")
    const [buttonColor, setButtonColor] = useState("#000000")
    const [buttonSize, setButtonSize] = useState("medium")
    const [hotspotColor, setHotspotColor] = useState("#000000")
    const [iconColor, setIconColor] = useState("#000000")

    useEffect(()=>{
        if(ui) {
            setTop(ui.top ? ui.top : 10)
            setLeft(ui.left ? ui.left : 10)
            setIsBackground(ui.is_background ? ui.isBackground : true)
            setBackground(ui.background ? ui.background : "linear-gradient(white, #D3D3D3)")
            setOpacity(ui.opacity ? ui.opacity : 1)
            setIsBorder( ui.is_border ? ui.is_border : true)
            setBorder( ui.border ? ui.border : 1)
            setBorderColor( ui.borderColor ? ui.borderColor : "linear-gradient(to right, #D3D3D3,#878787)")
            setIsBoxShadow(ui.is_boxShadow ? ui.is_boxShadow : true)
            setBoxShadow( ui.boxShadow ? ui.boxShadow : "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)")

            setTitleFontName(ui.title_font_name ? ui.title_font_name : "helvetica");
            setTitleFontStyle(ui.title_font_style ? ui.title_font_style : "regular");
            setTitleFontColor(ui.title_font_color ? ui.title_font_color : "#000000");
            setTitleFontSize(ui.title_font_size ? ui.title_font_size : "14px");
            setTextFontName(ui.text_font_name ? ui.text_font_name : "helvetica");
            setTextFontStyle(ui.text_font_style ? ui.text_font_style : "regular");
            setTextFontColor(ui.text_font_color ? ui.text_font_color : "#696969");
            setTextFontSize(ui.text_font_size ? ui.text_font_size : "14px");

            setHotspotColor(ui.hotspot_color ? ui.hotspot_color : "#000000");
            
            setButtonVariant(ui.button_variant ? ui.button_variant : "contained") //only contained, outlined or text allowed
            setButtonColor(ui.button_color ? ui.button_color : "#000000")
            setButtonSize(ui.button_size ? ui.button_size : "medium") //small, medium or large. or XXpx

            setIconColor(ui.icon_color ? ui.icon_color : "#000000")
            
        }
    }, [ui])

return {top, left, isBackground, background, opacity, isBorder, border, borderColor, isBoxShadow, boxShadow, titleFontName, titleFontStyle, titleFontColor, titleFontSize, textFontName, textFontStyle, textFontColor, textFontSize, buttonVariant, buttonColor, buttonSize, hotspotColor, iconColor}

}

export default useUIElements