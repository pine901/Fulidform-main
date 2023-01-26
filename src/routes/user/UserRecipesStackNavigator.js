import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import RecipeListScreen from '../../screens/user/recipes/RecipeListScreen';
import RecipeDetailScreen from '../../screens/user/recipes/RecipeDetailScreen';
import { ROUTE_RECIPES, ROUTE_RECIPE_DETAIL } from '../RouteNames';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
//const Stack = createStackNavigator();

export default UserRecipesStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_RECIPES}
    >
      <Stack.Screen
        name={ROUTE_RECIPES}
        component={RecipeListScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_RECIPE_DETAIL}
        component={RecipeDetailScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};