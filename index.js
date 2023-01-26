/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import KeyboardManager from 'react-native-keyboard-manager';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
    KeyboardManager.setShouldResignOnTouchOutside(true);
}
