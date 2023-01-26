import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../../screens/user/DashboardScreen';
import SubscriptionsScreen from '../../screens/user/SubscriptionsScreen';
import PersonalProgramScreen from '../../screens/user/PersonalProgramScreen';
import DashboardVideoPlayer from '../../screens/user/DashboardScreen/DashboardVideoPlayer';

import { ROUTE_CHALLENGE_DETAIL, ROUTE_DASHBOARD, ROUTE_PERSONAL_PROGRAM, ROUTE_SUBSCRIPTIONS } from '../RouteNames';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChallengeDetailScreen from '../../screens/user/challenges/ChallengeDetailScreen';
import DashboardCastScreen from '../../screens/user/DashboardScreen/DashboardCastScreen';

const Stack = createNativeStackNavigator();

export default UserDashboardStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTE_DASHBOARD}>
      <Stack.Screen
        name={ROUTE_DASHBOARD}
        component={DashboardScreen} //{DashboardScreen DashboardVideoPlayer DashboardCastScreen}
        options={{
          headerShown: false
        }}
      />
      
      <Stack.Screen
        name={ROUTE_PERSONAL_PROGRAM}
        component={PersonalProgramScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_CHALLENGE_DETAIL}
        component={ChallengeDetailScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};