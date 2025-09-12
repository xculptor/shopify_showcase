import { useEffect, useState } from "react";

function useChangeFrame(
  frameAnimationList,
  currFrameIndex,
  currScrollDirection
) {
 
  const [prevFrameIndex, setPrevFrameIndex] = useState();
  const [prevScrollDirection, setPrevScrollDirection] = useState();

  const [qShotList, setQShotList] = useState([])
  const [shotList, setShotList] = useState([]);
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    //setShotList([]);
    if (currFrameIndex > -1) {
      const qShotList = []
      console.log("zzzz shotList frame", prevFrameIndex, "->", currFrameIndex, "currScrollDirection", currScrollDirection);

      if(currScrollDirection === "down") {
        for(let i = prevFrameIndex+1 ? prevFrameIndex+1 : currFrameIndex; i < currFrameIndex + 1; i++) {
            const qShotListItem = frameAnimationList.filter(
                (item) =>
                  Number(item.frame_index) === i &&
                  item.scroll_direction === currScrollDirection
              )[0];
              
              if(qShotListItem) {
                qShotList.push(qShotListItem)
              }
              console.log( 'zzzz qShotList', qShotList)
                    }
      } else if(currScrollDirection === "up") {
        for(let i = prevFrameIndex-1 ? prevFrameIndex-1 : currFrameIndex; i > currFrameIndex - 1; i--) {
            const qShotListItem = frameAnimationList.filter(
                (item) =>
                  Number(item.frame_index) === i &&
                  item.scroll_direction === currScrollDirection
              )[0];
              
              if(qShotListItem) {
                qShotList.push(qShotListItem)
              }
              console.log( 'zzzz qShotList', qShotList)
                    }
      }
      
        
      setPrevFrameIndex(() => currFrameIndex);
      setPrevScrollDirection(currScrollDirection);
      if (qShotList && qShotList.length > 0) {
        console.log('zzzz ADDING')
        setQShotList(prevList => [...prevList, ...qShotList]);
      }
    }
  }, [currFrameIndex]);

useEffect(()=>{
    if(!isRunning && qShotList && qShotList.length > 0) {
        console.log('zzzz adding qShotList', qShotList)
        setShotList([...qShotList])
        setQShotList([])
        setIsRunning(true)
    }

}, [isRunning, qShotList])


return { shotList, setIsRunning};
}

export default useChangeFrame;
