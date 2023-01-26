import {createStore, combineReducers, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import {persistReducer} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';

import authReducer from './redux/auth/reducers';
import settingsReducer from './redux/settings/reducers';
import configReducer from './redux/config/reducers';
import orientationReducer from './redux/orientation/index';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['auth', 'settings'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  config: configReducer,
  orientation: orientationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  persistedReducer,
  applyMiddleware(),
  // createLogger()
);
