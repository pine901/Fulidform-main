import 'react-native-gesture-handler';
import React from 'react';
import {LogBox, Platform, StatusBar, View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import {store} from './src/store';
import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';

import BaseStyle from './src/styles/BaseStyle';
import RootStackNavigator from './src/routes/RootStackNavigator';
import {NativeBaseProvider, Text, Box, extendTheme} from 'native-base';
import Toast from 'react-native-toast-message';
import {console_log} from './src/utils/Misc';
import {Config} from './src/utils/Constants';
import './IgnoreWarnings';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import MaintenanceAndUpdate from './src/components/MaintenanceAndUpdate';
import ErrorBoundary from 'react-native-error-boundary';

////////////////////////////////////////////////////////////////////////////////
store.subscribe(listener);

function select(state) {
  //console_log("state:", state);
  const {token} = state.auth.user;

  if (token === undefined || token === '') return '';
  return token;
}

function listener() {
  let token = select(store.getState());
  //console_log("Authorization token:", token);
  axios.defaults.headers.common['Content-Type'] =
    'application/json; charset=UTF-8';
  if (token === '') {
    delete axios.defaults.headers.common['Authorization'];
  } else {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
}
//axios.defaults.baseURL = Config.SERVER_API_URL;
//////////////////////////////////////////////////////////////////////////////////////

const persistor = persistStore(store);

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
  fontConfig: {
    AlrightSans: {
      100: {
        normal: 'AlrightSans-Light',
        italic: 'AlrightSans-LightItalic',
      },
      200: {
        normal: 'AlrightSans-Regular',
        italic: 'AlrightSans-RegularItalic',
      },
      300: {
        normal: 'AlrightSans-Medium',
        italic: 'AlrightSans-MediumItalic',
      },
      400: {
        normal: 'AlrightSans-Bold',
        italic: 'AlrightSans-BoldItalic',
      },
      500: {
        normal: 'AlrightSans-Ultra',
        italic: 'AlrightSans-UltraItalic',
      },
    },
    fonts: {
      heading: 'AlrightSans',
      body: 'AlrightSans',
      mono: 'AlrightSans',
      customFont: 'AlrightSans',
    },
  },
};
const app11Theme = extendTheme({config: config});

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const App = () => {
  //Hide Splash screen on app load.
  React.useEffect(() => {
    SplashScreen.hide();

    // IF IOS THEN REQUEST PUSH NOTIFICATION PERMISSION
    if (Platform.OS === 'ios') requestUserPermission();
  });

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const errorHandler = props => {
    /** SEND LOGS TO CRASHLYTICS */
    const {error, stackTrace} = props;
    crashlytics().log(error);
    crashlytics().log(`STACK_TRACE: ${stackTrace}`);
  };

  const CustomFallback = props => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Something happened!</Text>
      <Text>{props.error.toString()}</Text>
      <Button onPress={props.resetError} title={'Try again'} />
    </View>
  );

  // USE ERROR BOUNDARY TO CAPTURE ERROR HAPPENING INSIDE THE APP
  return (
    <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NativeBaseProvider safeArea theme={app11Theme}>
            <StatusBar
              backgroundColor={'transparent'}
              translucent={true}
              barStyle="dark-content"
            />
            <RootStackNavigator />
            <Toast />
            <MaintenanceAndUpdate />
          </NativeBaseProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
