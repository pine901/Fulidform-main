import React, {useEffect} from 'react';
import {AppState, View, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';

import {signOut} from '../../redux/auth/actions';

import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_CHALLENGES_TAB,
  ROUTE_DASHBOARD_TAB,
  ROUTE_DRAWER_STACK_NAVIGATOR,
  ROUTE_HIDDEN_TAB,
  ROUTE_MY_FAVORITES,
  ROUTE_NUTRITION_CHALLENGES,
  ROUTE_RECIPES_TAB,
  ROUTE_SAVED_VIDEOS,
  ROUTE_SIGNIN,
  ROUTE_USER_TAB_NAVIGATOR,
  ROUTE_WORKOUTS_TAB,
} from '../../routes/RouteNames';
import {Text, ScrollView} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import {navNavigate, navReset} from '../../utils/Nav';
import MyDrawerDigitalCalendar from '../MyDrawerDigitalCalendar';

const DrawerHeader = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    initAppStateFunc();
  }, []);

  const initAppStateFunc = async () => {
    AppState.addEventListener('change', handleAppStateChange);
  };
  const handleAppStateChange = async nextAppState => {
    // navigation.dispatch(DrawerActions.closeDrawer());
  };
  return (
    <TouchableOpacity
      style={[styles.header, styles.menuItem]}
      activeOpacity={1}
      onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}>
      <Image
        resizeMode="contain"
        source={require('../../assets/images/drawer_icon/drawer_close_icon.png')}
        style={styles.closeIcon}
        alt="logo"
      />
    </TouchableOpacity>
  );
};

const DrawerMenu = ({title, icon, opacity, handleMenu}) => {
  const opacityStyle = opacity ? {opacity: opacity} : '';
  return (
    <TouchableOpacity style={styles.menuItem} onPress={handleMenu}>
      {icon && (
        <Image
          resizeMode="contain"
          source={icon}
          style={[styles.menuIcon, opacityStyle]}
          alt="icon"
        />
      )}
      <Text style={[styles.menuItemText, opacityStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const DrawerMenuList = props => {
  const {navigation} = props;
  //const user = useSelector(state => state.auth.user);
  //const deviceToken = useSelector(state => state.settings.deviceToken);

  const dispatch = useDispatch();

  const handleNavToScreen = (screen, params = {}) => {
    navigation.closeDrawer();
    //return true;
    if (Array.isArray(screen)) {
      navNavigate(screen, params, navigation);
    } else {
      navigation.navigate(screen, params);
    }
  };

  const handleSignOut = async () => {
    navigation.closeDrawer();
    // const payload = {
    //   user_id: 0
    // }
    // const response = await logOut(payload, access_token);
    // const { responseCode, status, responseMessage } = response;
    // if (responseCode == '200') {
    //   if (status === 'true') {

    //   } else {

    //   }
    // }
    dispatch(signOut());
    navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation);
  };

  return (
    <View style={styles.drawerMenuList}>
      <DrawerMenu
        title="DASHBOARD"
        handleMenu={() => handleNavToScreen(ROUTE_DASHBOARD_TAB)}
      />
      <DrawerMenu
        title="MY FAVOURITES"
        handleMenu={() =>
          handleNavToScreen([
            ROUTE_DRAWER_STACK_NAVIGATOR,
            ROUTE_HIDDEN_TAB,
            ROUTE_MY_FAVORITES,
          ])
        }
      />
      <DrawerMenu
        title="FIND A WORKOUT"
        handleMenu={() => handleNavToScreen(ROUTE_WORKOUTS_TAB)}
      />
      <DrawerMenu
        title="FIND A CHALLENGE"
        handleMenu={() => handleNavToScreen(ROUTE_CHALLENGES_TAB)}
      />
      <DrawerMenu
        title="FIND A RECIPE"
        handleMenu={() => handleNavToScreen(ROUTE_RECIPES_TAB)}
      />
      <DrawerMenu
        title="FIND A MEAL PLAN"
        handleMenu={() =>
          handleNavToScreen([
            ROUTE_DRAWER_STACK_NAVIGATOR,
            ROUTE_HIDDEN_TAB,
            ROUTE_NUTRITION_CHALLENGES,
          ])
        }
      />

      <View style={styles.menuDivider}></View>

      <DrawerMenu
        title="SAVED VIDEOS"
        icon={require('../../assets/images/drawer_icon/drawer_menu_save_icon.png')}
        handleMenu={() =>
          handleNavToScreen([
            ROUTE_DRAWER_STACK_NAVIGATOR,
            ROUTE_HIDDEN_TAB,
            ROUTE_SAVED_VIDEOS,
          ])
        }
      />
      <DrawerMenu
        title="LOGOUT"
        icon={require('../../assets/images/drawer_icon/drawer_menu_logout_icon.png')}
        opacity={0.75}
        handleMenu={() => handleSignOut()}
      />
    </View>
  );
};

export const DrawerContent = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const drawerContentType = useSelector(
    state => state.config.drawerContentType,
  );

  return (
    <View style={styles.container}>
      <DrawerHeader navigation={navigation} />
      <ScrollView style={styles.menuContainer}>
        {drawerContentType === 'menu' && (
          <DrawerMenuList navigation={navigation} />
        )}
        {drawerContentType === 'calendar' && <MyDrawerDigitalCalendar />}
        {drawerContentType !== 'menu' && drawerContentType !== 'calendar' && (
          <DrawerMenuList navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};
