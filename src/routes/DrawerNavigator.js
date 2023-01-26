import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import UserTabNavigator from './user/UserTabNavigator';

import {DrawerContent} from '../components/DrawerContent';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {Image} from 'native-base';
import {
  ROUTE_DASHBOARD_TAB,
  ROUTE_HIDDEN_TAB,
  ROUTE_USER_TAB_NAVIGATOR,
  ROUTE_SUBSCRIPTIONS,
} from './RouteNames';
import UserHiddenStackNavigator from './user/UserHiddenStackNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {setDrawerContentType} from '../redux/config/actions';
import {createStackNavigator} from '@react-navigation/stack';
import styles from './styles';
import {CommonActions} from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerStackNavigator = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onClickShowMenuDrawer = () => {
    dispatch(setDrawerContentType('menu'));
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const normalScreenOptions = {
    drawerPosition: 'right',
    headerStyle: {
      backgroundColor: 'rgba(255,255,255,1)',
      // elevation: 0, // remove shadow on Android
      // shadowOpacity: 0, // remove shadow on iOS
      borderBottomWidth: 1, // Just in case.
    },
    headerTintColor: 'black',
    headerTitle: '',
    headerLeft: () => (
      <TouchableOpacity
        style={styles.drawerHeaderLeft}
        onPress={() => {
          // USING THE BACK METHOD IS THE ONLY POSSIBLE SOLUTION
          // BECAUSE OF HOW THE NAVIGATION STRUCTURE WAS CREATED IN THIS APP
          // ROUTING IT TO DASHBOARD AFTER VISITING PERSONALIZED PROGRAM WILL NOT WORK
          // BECAUSE PERSONALIZED PROGRAM IS UNDER DASHBOARD SO IT DOES NOTHING
          // RESET THE ROUTES AFTER GOING BACK TO THE ROOT SCREEN
          navigation.goBack();
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: ROUTE_DASHBOARD_TAB,
                },
              ],
            }),
          );
        }}>
        <Image
          resizeMode="contain"
          style={styles.drawerHeaderLogo}
          source={require('../assets/images/logo_text.png')}
          alt="logo"
        />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        style={styles.drawerHeaderRight}
        onPress={() => onClickShowMenuDrawer()}>
        <Image
          resizeMode="contain"
          style={styles.drawerHeaderToggleIcon}
          source={require('../assets/images/drawer_icon/drawer_toggle_icon.png')}
          alt="toggleIcon"
        />
      </TouchableOpacity>
    ),
  };

  const fullScreenOption = {
    headerShown: false,
    gestureEnabled: false,
    swipeEnabled: false,
  };

  return (
    <Drawer.Navigator
      id="MainRightDrawer"
      // drawerStyle={{
      //   backgroundColor: 'black',
      //   width: wp('100%') - 48,
      // }}
      screenOptions={normalScreenOptions}
      drawerContent={props => <DrawerContent {...props} />}
      initialRouteName={ROUTE_USER_TAB_NAVIGATOR}
      defaultStatus="closed">
      <Drawer.Screen
        name={ROUTE_USER_TAB_NAVIGATOR}
        options={{title: 'Dashboard'}}
        component={UserTabNavigator}
      />
      <Drawer.Screen
        name={ROUTE_HIDDEN_TAB}
        component={UserHiddenStackNavigator}
      />
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
};

export default DrawerStackNavigator;
