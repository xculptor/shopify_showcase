function useScrollEvent ( setNewScrollTimeStamp) {
       
    function scrollEvent (e) {
            setNewScrollTimeStamp(e.timeStamp)     
            console.log('e.timeStamp', e.timeStamp)
    } 
    return {scrollEvent}
}

export default useScrollEvent