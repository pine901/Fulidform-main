import types from './types';

export const setUser = data => ({
  type: types.SET_USER,
  payload: data,
});

export const signIn = data => ({
  type: types.SIGN_IN,
  payload: data,
});

export const signUp = data => ({
  type: types.SIGN_UP,
  payload: data,
});

export const signOut = () => ({
  type: types.SIGN_OUT,
});

export const setSubscriptionDetails = payload => ({
  type: types.SUBSCRIPTION_DETAILS,
  payload,
});
