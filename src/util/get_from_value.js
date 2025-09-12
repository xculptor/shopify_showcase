const getFromValue = (tweenData) => {
  const fromList = [];
  const toList = [];
 
  for (let i = 0; i < tweenData.length; i++) {
    switch (tweenData[i].property) {
      case "clip" :
        fromList.push({x: tweenData[i].fromValue});
        break
      case "rotation":
      case "position":
      case "scale":
      case "target":
        fromList.push({
          [tweenData[i].action_id]: {
            [tweenData[i].id]: {
              [tweenData[i].property]: {
                // x: Number(tweenData[i].object[tweenData[i].property].x),
                // y: Number(tweenData[i].object[tweenData[i].property].y),
                // z: Number(tweenData[i].object[tweenData[i].property].z),
                x: Number(tweenData[i].fromValue.x),
                y: Number(tweenData[i].fromValue.y),
                z: Number(tweenData[i].fromValue.z)
              },
            },
          },
        });
    break
      case "intensity":
      case "visible":
        fromList.push({
          [tweenData[i].action_id]: {
            [tweenData[i].id]: {
              [tweenData[i].property]: Number(
                tweenData[i].object[tweenData[i].property]
              ),
            },
          },
        });
        break
        
    }
  }
  for (let i = 0; i < tweenData.length; i++) {
    switch (tweenData[i].property) {
      case "clip" :
        toList.push({x: tweenData[i].fromValue});
        break
      case "rotation":
      case "position":
      case "scale":
      case "target":
        toList.push({
          [tweenData[i].action_id]: {
            [tweenData[i].id]: {
              [tweenData[i].property]: {
                x: Number(tweenData[i].toValue.x),
                y: Number(tweenData[i].toValue.y),
                z: Number(tweenData[i].toValue.z),
              },
            },
          },
        });
        break
      case "intensity":
      case "visible":
        toList.push({
          [tweenData[i].action_id]: {
            [tweenData[i].id]: {
              [tweenData[i].property]: tweenData[i].toValue,
            },
          },
        });
        break
    }
  }


  return { fromList, toList };
};

export default getFromValue;
