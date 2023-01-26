import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChallengeListScreen from '../../screens/user/challenges/ChallengeListScreen';

import { ROUTE_CHALLENGES, ROUTE_CHALLENGE_DETAIL } from '../RouteNames';
import ChallengeDetailScreen from '../../screens/user/challenges/ChallengeDetailScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
//const Stack = createStackNavigator();

export default UserChallengesStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_CHALLENGES}
    >
      <Stack.Screen
        name={ROUTE_CHALLENGES}
        component={ChallengeListScreen}
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