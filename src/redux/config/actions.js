import types from './types';

export const showLoading = (data) => ({
    type: types.SET_LOADING,
    payload: data
});

export const setFirstLogin = (data) => ({
    type: types.SET_FIRST_LOGIN,
    payload: data
});

export const setDrawerContentType = (data) => ({
    type: types.SET_DRAWER_CONTENT_TYPE,
    payload: data
});

export const setDigitalCalendar = (data) => ({
    type: types.SET_DIGITAL_CALENDAR,
    payload: data
});

export const setFullScreenMode = (data) => ({
    type: types.SET_FULLSCREEN_MODE ,
    payload: data
});

export const setDownloadingVideoList = (data) => ({
    type: types.SET_DOWNLOADING_VIDEO_LIST ,
    payload: data
});

export const addDownloadingVideoList = (data) => ({
    type: types.ADD_DOWNLOADING_VIDEO_LIST ,
    payload: data
});

export const removeDownloadingVideoList = (data) => ({
    type: types.REMOVE_DOWNLOADING_VIDEO_LIST ,
    payload: data
});

export const setData = (data) => ({
    type: types.SET_DATA,
    payload: data
});

export const setFavorites = (data) => ({
    type: types.SET_FAVORITES,
    payload: data
});

export const setRecentActivity = (data) => ({
    type: types.SET_RECENT_ACTIVITY,
    payload: data
});