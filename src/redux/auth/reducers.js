import types from './types';

const rawState = {
  signed: false,
  user: {},
  subscriptionDetails: null,
};

export default function authReducer(state = rawState, action) {
  switch (action.type) {
    case types.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case types.SIGN_IN:
      return {
        ...state,
        signed: true,
        user: action.payload,
      };
    case types.SIGN_UP:
      return {
        ...state,
        signed: true,
        user: action.payload,
      };
    case types.SIGN_OUT:
      return {
        ...state,
        signed: false,
        user: rawState.user,
      };
    case types.SUBSCRIPTION_DETAILS:
      return {
        ...state,
        subscriptionDetails: action.payload,
      };
    default:
      return state;
  }
}
