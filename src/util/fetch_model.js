const fetchModel = async (model, callAPI, type) => {
    try {
      //console.log('url', model)
    const data = await callAPI( {url:  model}, type)
    return data;
  } catch (err) {
    return 
  }
};

export default fetchModel