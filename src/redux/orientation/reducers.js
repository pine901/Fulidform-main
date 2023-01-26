import {console_log} from '../../utils/Misc';
import types from './types';

const rawState = {
  appOrientation: {},
};

export default function orientationReducer(state = rawState, action) {
  switch (action.type) {
    case types.SET_APP_ORIENTATION:
      return {
        ...state,
        appOrientation: action.payload,
      };

    default:
      return state;
  }
}
