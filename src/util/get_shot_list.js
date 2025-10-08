const getShotList = (id, id_is_first, sequenceList, experience, direction, previousAct) => {
    const list = []
   // console.log('********* sequence List ***********', sequenceList)
    for(let i = 0; i < sequenceList.length; i++) {
     // console.log('id', id, 'id_is_first', id_is_first)
     // console.log(sequenceList[i])
      
        const sequenceId = sequenceList[i].sequence_id;
      const sequence = experience.sequences.filter(item => item.sequence_id === sequenceId)[0]
      const sequence_end_state = sequenceList[i].sequence_end_state ? sequenceList[i].sequence_end_state : []
      //const sequence_end_state = sequence.sequence_end_state ? sequence.sequence_end_state : []
     // console.log('********* sequence ***********', sequence)
      for(let j = 0; j < sequence.shots.length; j++) {
        const shot = sequence.shots[j] 
        const is_last_shot = sequence.shots.findIndex(item => item.previous_shot === shot.shot_id)
       
        const item = {
          shot_key: id+'.'+sequence.sequence_id+'.'+shot.shot_id,
          id: id,
          id_is_first: id_is_first,
          sequence_id: sequence.sequence_id,
          is_first_sequence: sequenceList[i].is_first_sequence,
          previous_sequence: sequenceList[i].previous_sequence,
          shot_id : shot.shot_id,
          is_first_shot: shot.is_first_shot,
          previous_shot: shot.previous_shot,
          shot_controls: shot.shot_controls,
          action: shot.action,
          is_last_shot: is_last_shot === -1 ? true : false,
          sequence_end_state : is_last_shot === -1 ? sequence_end_state : [],
          next_ele: sequenceList[i].is_next_act ? sequenceList[i].next_act : "",
          direction: direction,
          previous_ele: previousAct
        }
        //console.log('item', item)
        list.push(item)
      }
    
    
    const list2 = []
    for(let i = 0; i < list.length; i++) {
      //console.log('in list2')
      let previous_shot_key = ""  
      if(!list[i].is_first_shot) {
        previous_shot_key = list[i].id + '.' + list[i].sequence_id + '.' +list[i].previous_shot
      } else {
        if(list[i].is_first_sequence) {
          previous_shot_key = ""
        } else {
          //find the last shot of the previous sequence
          const prevSeq = list.filter(item => item.sequence_id === list[i].previous_sequence)
          const endShots = []
          for(let j = 0; j < prevSeq.length; j++) {
            const isEnd = prevSeq.findIndex(item => item.previous_shot === prevSeq[j].shot_id) 
            if(isEnd === -1) {
              endShots.push(prevSeq[j].shot_id)
            }
          }
          previous_shot_key = list[i].id + '.' + list[i].previous_sequence + '.' + endShots[0] 
        }
      }
      list2.push({previous_shot_key: previous_shot_key, ...list[i]})
    }


    const list3 = []
    for(let i = 0; i < list2.length; i++) {
     // console.log('in list 3')
      let elapsed_time = 0
      const shot = list2[i]
      function getElapsedTime (shot) {
        const previousShotKey = shot.previous_shot_key
        elapsed_time += Number(shot.shot_controls.duration)
        if(previousShotKey === "") {
          return
        } else {
          const prevShot = list2.filter(item => item.shot_key === previousShotKey)[0]
         
          getElapsedTime(prevShot)
        }
      }
      getElapsedTime(shot)
      list3.push({elapsed_time: elapsed_time, ...list2[i]})
    }

    let finalShotKey = -1
    let maxElapsedTime = -1
    for(let i = 0; i < list3.length; i++) {
     // console.log('adding final shot key')
      if(list3[i].elapsed_time > maxElapsedTime) {
        maxElapsedTime = list3[i].elapsed_time
        finalShotKey = list3[i].shot_key
      }
    }

    const list4 = []
    for(let i = 0; i < list3.length; i++) {
    //  console.log('in list 4')
      const is_final_shot = list3[i].shot_key === finalShotKey ? true : false
      list4.push({is_final_shot: is_final_shot,  ...list3[i]})
    }
  //updateFunction(list4)
return list4 
      }
        
}

   export default getShotList