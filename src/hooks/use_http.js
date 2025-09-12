import { useState, useCallback } from 'react';

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, responseType) => {
    setIsLoading(true);
    setError(null);
    
    const modifyResponse = async (response) => {
      setIsLoading(false);
        if(!requestConfig.method || requestConfig.method==='GET'){
          if (responseType==='json') {return await response.json()}
        else if (responseType==='blob') {return await response.blob()}
        //else if (responseType==='blob') {return await getBlobURL(response, 'model/gltf-binary')}
      
      } else {return await response}
        
    }

    const getBlobURL = async (code, type) => {
      const blob = new Blob([code], { type })
      return URL.createObjectURL(blob)
    }

    try {
      
      const response = await fetch( process.env.REACT_APP_BACKEND_BASE_URL+ "/api" +requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        credentials: 'include',
        headers: requestConfig.headers ? requestConfig.headers : {},
        //body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        body:  requestConfig.body ? (responseType==='blob') ? requestConfig.body : JSON.stringify(requestConfig.body) : null,
      });
     
      //setIsLoading(false);
      if (!response.ok) {
        throw new Error('Request failed!');
      }
      
      return await modifyResponse(response);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;