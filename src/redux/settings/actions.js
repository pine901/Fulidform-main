import types from './types';

export const setDeviceToken = (data) => ({
    type: types.SET_DEVICE_TOKEN,
    payload: data
});

export const addSavedVideoList = (data) => ({
    type: types.ADD_SAVED_VIDEO_LIST,
    payload: data
});

export const setSavedVideoList = (data) => ({
    type: types.SET_SAVED_VIDEO_LIST,
    payload: data
});

export const setAppOrientation = (data) => ({
    type: types.SET_APP_ORIENTATION,
    payload: data
});