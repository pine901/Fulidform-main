import React, { useEffect } from 'react';
import { ImageBackground, Image, StatusBar } from 'react-native';
import { Text, View, TouchableOpacity, Box, Center, Container, Button, VStack, HStack, KeyboardAvoidingView, FormControl, Input, WarningOutlineIcon, ScrollView, Heading, Pressable } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { SimpleAnimation } from 'react-native-simple-animations';


import BaseStyle from '../../../styles/BaseStyle';
import AuthStyles from './AuthStyles';

const AuthHeaderSection = () => {

  return (
    <ImageBackground source={require('../../../assets/images/login_bg.png')} style={[AuthStyles.login_bg]} resizeMode="cover">
      <View style={[AuthStyles.authScreenBgWrapper, AuthStyles.authScreenPadding]}>
        <View style={[AuthStyles.authScreenBgContent]}>
          <Text fontSize="xl" textAlign="left" my="0">WELCOME TO</Text>
          <View>
            <Image resizeMode={"contain"} source={require('../../../assets/images/logo_text.png')} alt="Logo" style={BaseStyle.imgResponsive} />
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

export default AuthHeaderSection;

