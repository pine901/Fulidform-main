import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { ROUTE_MY_FAVORITES, ROUTE_MY_FAVORITE_CHALLENGE_DETAIL, ROUTE_MY_FAVORITE_NUTRITION_DETAIL, ROUTE_MY_FAVORITE_RECIPE_DETAIL, ROUTE_MY_FAVORITE_WORKOUT_DETAIL, ROUTE_NUTRITION_CHALLENGES, ROUTE_NUTRITION_CHALLENGE_DETAIL, ROUTE_NUTRITION_RECIPE_DETAIL, ROUTE_SAVED_VIDEOS } from '../RouteNames';
import MyFavoritesScreen from '../../screens/user/MyFavoritesScreen';
import NutritionChallengeListScreen from '../../screens/user/nutritionChallenges/NutritionChallengeListScreen';
import NutritionChallengeDetailScreen from '../../screens/user/nutritionChallenges/NutritionChallengeDetailScreen';
import SavedVideosScreen from '../../screens/user/SavedVideosScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutDetailScreen from '../../screens/user/workouts/WorkoutDetailScreen';
import ChallengeDetailScreen from '../../screens/user/challenges/ChallengeDetailScreen';
import RecipeDetailScreen from '../../screens/user/recipes/RecipeDetailScreen';

const Stack = createNativeStackNavigator();
//const Stack = createStackNavigator();

export default UserHiddenStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_MY_FAVORITES}
    >
      <Stack.Screen
        name={ROUTE_MY_FAVORITES}
        component={MyFavoritesScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_MY_FAVORITE_WORKOUT_DETAIL}
        component={WorkoutDetailScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_MY_FAVORITE_CHALLENGE_DETAIL}
        component={ChallengeDetailScreen}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name={ROUTE_MY_FAVORITE_RECIPE_DETAIL }
        component={RecipeDetailScreen}
        options={{
          headerShown: false
        }}
      />
        <Stack.Screen
        name={ROUTE_MY_FAVORITE_NUTRITION_DETAIL }
        component={NutritionChallengeDetailScreen}
        options={{
          headerShown: false
        }}
      />


      <Stack.Screen
        name={ROUTE_NUTRITION_CHALLENGES}
        component={NutritionChallengeListScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_NUTRITION_CHALLENGE_DETAIL}
        component={NutritionChallengeDetailScreen}
        options={{
          headerShown: false
        }}
      />
       <Stack.Screen
        name={ROUTE_NUTRITION_RECIPE_DETAIL}
        component={RecipeDetailScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name={ROUTE_SAVED_VIDEOS}
        component={SavedVideosScreen}
        options={{
          headerShown: false
        }}
      />

    </Stack.Navigator>
  );
};