import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
  AppState,
} from 'react-native';
import useStyles from './index.styles';
import Logo from '../../assets/images/logo_text.png';
import {version} from '../../../package.json';
import {compare} from 'compare-versions';
import axios from 'axios';

const MaintenanceAndUpdate = () => {
  const Styles = useStyles();
  const [appStateInfo, setAppStateInfo] = React.useState(null);
  const appState = React.useRef(AppState.currentState);

  const fetchAppStatus = async () => {
    try {
      const appStatus = await axios({
        method: 'get',
        url: 'https://www.fluidformpilates.com/mobile-upgrade.json',
      });

      const {ios, android} = appStatus.data;

      if (Platform.OS === 'ios') {
        setAppStateInfo({
          ...ios,
          isForceUpdate: compare(ios.minVersion, version, '>'),
        });
      }
      if (Platform.OS === 'android') {
        setAppStateInfo({
          ...android,
          isForceUpdate: compare(android.minVersion, version, '>'),
        });
      }
    } catch (error) {
      throw error;
    }
  };

  React.useState(() => {
    // CHECK VERSION ON FIRST RENDER
    fetchAppStatus();

    // CHECK VERSION WHEN APP OPENED
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        //App has come to the foreground
        fetchAppStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onLinkPress = url => {
    Linking.openURL(url);
  };

  const show =
    (appStateInfo && appStateInfo.isForceUpdate) ||
    (appStateInfo && appStateInfo.maintenanceMode)
      ? true
      : false;

  return (
    <Modal
      animationType="fade"
      visible={show}
      transparent={false}
      onRequestClose={() => {}}>
      <View style={Styles.container}>
        <Image source={Logo} style={Styles.logo} resizeMode="contain" />
        {appStateInfo ? (
          <Text style={Styles.message}>{appStateInfo.message}</Text>
        ) : null}
        {appStateInfo &&
        appStateInfo.isForceUpdate &&
        !appStateInfo.maintenanceMode ? (
          <TouchableOpacity
            style={Styles.update_btn}
            onPress={() => onLinkPress(appStateInfo.appStoreLink)}>
            <Text style={Styles.update_btn_label}>UPDATE NOW</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Modal>
  );
};

export default MaintenanceAndUpdate;
