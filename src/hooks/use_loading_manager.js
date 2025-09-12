import { useEffect, useState } from "react";

function useLoadingManager(loadingManager) {
 
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      if (!loadingManager) return;
        
      loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
       
        //console.log('loading', itemsLoaded, itemsTotal)
        //const percent = Math.round(( itemsLoaded / itemsTotal) * 100).toString() + " %";
        const percent = ( itemsLoaded / itemsTotal) * 100
        setLoadingPercent(percent);
        if(percent===100){
           setIsLoaded(true);
      }
	


    };

        
    }, [loadingManager]);

    return {loadingPercent, isLoaded}
}

export default useLoadingManager;
