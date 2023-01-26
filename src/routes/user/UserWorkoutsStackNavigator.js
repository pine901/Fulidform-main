import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import WorkoutListScreen from '../../screens/user/workouts/WorkoutListScreen';
import WorkoutDetailScreen from '../../screens/user/workouts/WorkoutDetailScreen';
import { ROUTE_WORKOUTS, ROUTE_WORKOUT_DETAIL } from '../RouteNames';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
//const Stack = createStackNavigator();

export default UserWorkoutsStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_WORKOUTS} //ROUTE_WORKOUTS,ROUTE_WORKOUT_DETAIL
    >
      <Stack.Screen
        name={ROUTE_WORKOUTS}
        component={WorkoutListScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_WORKOUT_DETAIL}
        component={WorkoutDetailScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};