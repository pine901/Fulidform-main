import React, { useEffect } from 'react';
import { LogBox, StatusBar, Image } from 'react-native';
import { Text, View, TouchableOpacity, Box, Center, Container, Button, VStack, HStack } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { SimpleAnimation } from 'react-native-simple-animations';

import { useDispatch, useSelector } from 'react-redux';
import { ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_INTRODUCTION } from '../../routes/RouteNames';

import styles from './styles';
import BaseStyle from '../../styles/BaseStyle';
import { setAppMainStatusBarStyle } from '../../utils/Utils';
import { console_log } from '../../utils/Misc';

const SplashScreen = (props) => {

  const { navigation } = props;

  const dispatch = useDispatch();
  useEffect(() => {
    //setAppMainStatusBarStyle(StatusBar)
    gotoIntroScreen();
  }, []);

  const signed = useSelector(state => state.auth.signed);
  //const user = useSelector(state => state.auth.user);
  //console_log("user:::", user)
  
  const gotoIntroScreen = () => {
    setTimeout(function () {
      navigation.replace(!signed ? ROUTE_AUTH_STACK_NAVIGATOR : ROUTE_DRAWER_STACK_NAVIGATOR);
    }, 2000);
  }

  return (
    <View style={BaseStyle.screenContainer}>
      <Center safeArea style={[styles.splashContainer, BaseStyle.h100p]}>
        <View pb="16" style={styles.splashBox}>
          <VStack space={0}>
            <SimpleAnimation delay={100} duration={1000} movementType="slide" distance={60} direction="up">
              <Text fontSize="xl" my="0">WELCOME TO</Text>
            </SimpleAnimation>

            <SimpleAnimation delay={1000} duration={1000} movementType="spring" distance={60} tension={3} friction={3} direction="up">
              <Image resizeMode={"contain"} source={require('../../assets/images/logo_text.png')} alt="Logo" style={BaseStyle.imgResponsive} />
            </SimpleAnimation>
            <View pt={4} style={[BaseStyle.col12]}>
              <HStack space={0} justifyContent="center" >
                <Center style={BaseStyle.col4} >
                 
                </Center>
                <Center style={BaseStyle.col4} >
                  
                </Center>
                <Center style={BaseStyle.col4} >
                  
                </Center>
              </HStack>
            </View>
          </VStack>
        </View>
      </Center>
    </View>
  )
}

export default SplashScreen;

