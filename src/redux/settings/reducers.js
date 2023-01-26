import { console_log } from '../../utils/Misc';
import types from './types';

const rawState = {
  deviceToken: '',
  savedVideoList: [],
  appOrientation: {}
}

const inSavedVideoList = (fileName, itemType, saved_video_list) => {
  for (let k in saved_video_list) {
    let row = saved_video_list[k]
    if (fileName === row['fileName'] && itemType === row['itemType']) {
      return k
    }
  }
  return false
}
const updateSavedVideoList = (row, saved_video_list) => {
  let newSavedVideoList = [...saved_video_list]
  const savedIndex = inSavedVideoList(row['fileName'], row['itemType'], saved_video_list)
  console_log("savedVideoList:::", saved_video_list)
  console_log("savedIndex:::", savedIndex)
  if (savedIndex) {
    newSavedVideoList[savedIndex] = row
  } else {
    newSavedVideoList.push(row)
  }
  console_log("newSavedVideoList:::", newSavedVideoList)
  return newSavedVideoList
}


export default function settingsReducer(state = rawState, action) {

  switch (action.type) {
    case types.SET_DEVICE_TOKEN:
      return {
        ...state,
        deviceToken: action.payload
      }
    case types.SET_SAVED_VIDEO_LIST:
      return {
        ...state,
        savedVideoList: action.payload
      }
    case types.ADD_SAVED_VIDEO_LIST:
      return {
        ...state,
        savedVideoList: updateSavedVideoList(action.payload, state['savedVideoList'])
      }
    case types.SET_APP_ORIENTATION:
      return {
        ...state,
        appOrientation: action.payload
      }

    default:
      return state;
  }
}