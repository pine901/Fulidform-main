import types from './types';

export const setAppOrientation = data => ({
  type: types.SET_APP_ORIENTATION,
  payload: data,
});
