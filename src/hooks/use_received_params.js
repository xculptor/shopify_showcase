import { useEffect, useState } from "react";

const useReceivedParams = (params) => {
  const [meta, setMeta] = useState();
  const [showcaseId, setShowcaseId] = useState();
  const [sessionId, setSessionId] = useState();
  const [pageHeight, setPageHeight] = useState()
  const [pageWidth, setPageWidth] = useState()
  const [currScreenTypeId, setCurrScreenTypeId] = useState()
  const [ui, setUI] = useState()
  useEffect(() => {
    
    if (params) {
      const meta=JSON.parse(params.get("meta"))
      //const showcaseId = params.get("showcase");
      const showcaseId = meta.showcase
      const sessionId = params.get("session");
      const ui = JSON.parse(params.get("ui"))
      setUI(ui)
      //const sessionId = param.session
      //const pageHeight = params.get("page_height")
      //const pageWidth = params.get('page_width')
      //const currScreenTypeId = params.get('curr_screen_type_id')
      
      setMeta(meta)
      setShowcaseId(showcaseId);
      setSessionId(sessionId);
      //setPageHeight(pageHeight);
      //setPageWidth(pageWidth)
     //setCurrScreenTypeId(currScreenTypeId)
     
    }
  }, [params]);
 
  return { showcaseId, sessionId, meta/* , pageHeight, pageWidth, currScreenTypeId */, ui };
};

export default useReceivedParams;
