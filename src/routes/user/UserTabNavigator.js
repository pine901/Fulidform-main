import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MyTabBar from '../../components/MyTabBar';
import UserDashboardStackNavigator from './UserDashboardStackNavigator';
import UserWorkoutsStackNavigator from './UserWorkoutsStackNavigator';
import UserChallengesStackNavigator from './UserChallengesStackNavigator';
import UserRecipesStackNavigator from './UserRecipesStackNavigator';
import SubscriptionsScreen from '../../screens/user/SubscriptionsScreen';

import { ROUTE_CHALLENGES_TAB, ROUTE_DASHBOARD_TAB, ROUTE_HIDDEN_TAB, ROUTE_RECIPES_TAB, ROUTE_WORKOUTS_TAB, ROUTE_SUBSCRIPTIONS } from '../RouteNames';
import { useSelector } from 'react-redux';
// import UserHiddenStackNavigator from './UserHiddenStackNavigator';

const FluidTab = createBottomTabNavigator();

export default UserTabNavigator = () => {

  return (
    <FluidTab.Navigator
      initialRouteName={ROUTE_DASHBOARD_TAB}
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={
        {
          lazy: true,
        }        
      }
    >
      {/* <FluidTab.Screen
        name={ROUTE_SUBSCRIPTIONS}
        component={SubscriptionsScreen}
        options={{
          headerShown: false,
        }}
      /> */}
      <FluidTab.Screen name={ROUTE_DASHBOARD_TAB} component={UserDashboardStackNavigator} options={{ headerShown: false }} />
      <FluidTab.Screen name={ROUTE_WORKOUTS_TAB} component={UserWorkoutsStackNavigator} options={{ headerShown: false }} />
      <FluidTab.Screen name={ROUTE_CHALLENGES_TAB} component={UserChallengesStackNavigator} options={{ headerShown: false }} />
      <FluidTab.Screen name={ROUTE_RECIPES_TAB} component={UserRecipesStackNavigator} options={{ headerShown: false }} />

      {/* <FluidTab.Screen name={ROUTE_HIDDEN_TAB} component={ UserHiddenStackNavigator} options={{ headerShown: false }} /> */}

    </FluidTab.Navigator>
  )
}