import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import { ROUTE_INTRODUCTION, ROUTE_SIGNIN, ROUTE_FORGOT_PASSWORD, ROUTE_RESET_PASSWORD, ROUTE_UPDATE_PASSWORD } from './RouteNames';
import ForgotScreen from '../screens/auth/ForgotScreen';
import IntroductionScreen from '../screens/IntroductionScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import UpdatePasswordScreen from '../screens/auth/UpdatePasswordScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTE_INTRODUCTION}>
      <Stack.Screen
        name={ROUTE_INTRODUCTION}
        component={IntroductionScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_SIGNIN}
        component={SignInScreen}
        options={{
          // animationEnabled: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_FORGOT_PASSWORD}
        component={ForgotScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_RESET_PASSWORD}
        component={ResetPasswordScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_UPDATE_PASSWORD}
        component={UpdatePasswordScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;