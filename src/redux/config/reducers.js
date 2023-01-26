import { console_log } from '../../utils/Misc';
import types from './types';

const rawState = {
  loading: false,
  firstLogin: false,
  drawerContentType: "menu", //calendar, menu
  digitalCalendar: {
    workoutGroup: [],
    currentDayIndex: 0,
  },
  fullScreenMode: false,
  downloadingVideoList: [],
  data: {},
  favorites: {},
  recentActivity: {},
}

const inDownloadingVideoList = (fileName, itemType, downloading_video_list) => {
  for (let k in downloading_video_list) {
    let row = downloading_video_list[k]
    if (fileName === row['fileName'] && itemType === row['itemType']) {
      return k
    }
  }
  return false
}
const removeItemFromDownloadingVideoList = (item, downloading_video_list) => {
  let newDownloadingVideoList = []
  for (let k in downloading_video_list) {
    let row = downloading_video_list[k]
    if (item['fileName'] === row['fileName'] && item['itemType'] === row['itemType']) {
      //
    } else {
      newDownloadingVideoList.push(row)
    }
  }
  return newDownloadingVideoList
}
const updateDownloadingVideoList = (row, downloading_video_list) => {
  let newDownloadingVideoList = [...downloading_video_list]

  const savedIndex = inDownloadingVideoList(row['fileName'], row['itemType'], downloading_video_list)
  if (savedIndex) {
    newDownloadingVideoList[savedIndex] = row
  } else {
    newDownloadingVideoList.push(row)
  }
  return newDownloadingVideoList
}

export default function dataReducer(state = rawState, action) {
  switch (action.type) {
    case types.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      }
    case types.SET_FIRST_LOGIN:
      return {
        ...state,
        firstLogin: action.payload
      }
    case types.SET_DRAWER_CONTENT_TYPE:
      return {
        ...state,
        drawerContentType: action.payload
      }
    case types.SET_DIGITAL_CALENDAR:
      return {
        ...state,
        digitalCalendar: { ...state.digitalCalendar, ...action.payload }
      }
    case types.SET_FULLSCREEN_MODE:
      return {
        ...state,
        fullScreenMode: action.payload
      }
    case types.SET_DOWNLOADING_VIDEO_LIST:
      return {
        ...state,
        downloadingVideoList: action.payload
      }
    case types.ADD_DOWNLOADING_VIDEO_LIST:
      return {
        ...state,
        downloadingVideoList: updateDownloadingVideoList(action.payload, state['downloadingVideoList'])
      }
    case types.REMOVE_DOWNLOADING_VIDEO_LIST:
      return {
        ...state,
        downloadingVideoList: removeItemFromDownloadingVideoList(action.payload, state['downloadingVideoList'])
      }
    case types.SET_DATA:
      return {
        ...state,
        data: action.payload
      }
    case types.SET_FAVORITES:
      return {
        ...state,
        favorites: action.payload
      }
    case types.SET_RECENT_ACTIVITY:
      return {
        ...state,
        recentActivity: action.payload
      }
    default:
      return state;
  }
}