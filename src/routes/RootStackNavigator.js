import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigator';
import DrawerStackNavigator from './DrawerNavigator';

import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_DRAWER_STACK_NAVIGATOR,
  ROUTE_PDF_SCREEN,
  ROUTE_SPLASH,
  ROUTE_VIDEO_SCREEN,
} from './RouteNames';
import SplashScreen from '../screens/SplashScreen';
import VideoScreen from '../screens/VideoScreen';
// import SubscriptionsScreen from '../screens/user/SubscriptionsScreen';
import {TouchableOpacity, Dimensions} from 'react-native';
import {Image} from 'native-base';
import styles from './styles';
import PdfScreen from '../screens/PdfScreen';
import {setAppOrientation} from '../redux/orientation/actions';
import analytics from '@react-native-firebase/analytics';

const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();
  const signed = useSelector(state => state.auth.signed);

  // LISTEN TO APP ORIENTATION
  React.useEffect(() => {
    // INITIALIZE DEFAULT ORIENTATION
    dispatch(
      setAppOrientation({
        orientation:
          Dimensions.get('window').width < Dimensions.get('window').height
            ? 'PORTRAIT'
            : 'LANDSCAPE',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }),
    );
    // LISTEN TO APP SIZE WHEN ORIENTATION CHANGE
    Dimensions.addEventListener('change', ({window: {width, height}}) => {
      if (width < height) {
        const orientationData = {
          orientation: 'PORTRAIT',
          width,
          height,
        };

        dispatch(setAppOrientation(orientationData));
      } else {
        const orientationData = {
          orientation: 'LANDSCAPE',
          width,
          height,
        };

        dispatch(setAppOrientation(orientationData));
      }
    });

    return () => {
      if (Dimensions.removeStateListener) Dimensions.removeStateListener();
    };
  }, []);

  const linking = {
    prefixes: [
      'fluidform://',
      'https://fluidformpilates.com',
      'https://*.fluidformpilates.com',
    ],
    config: {
      screens: {
        DrawerStackNavigator: {
          screens: {
            UserTabNavigator: {
              screens: {
                DashboardTab: '/dashboard', // Opens Dashboard
                WorkoutsTab: {
                  screens: {
                    Workouts: '/workouts/list',
                    WorkoutDetail: '/workouts/:itemId', //sample itemid 196283 open with workout slug
                  },
                },
                ChallengesTab: {
                  screens: {
                    Challenges: '/challenges',
                    ChallengeDetail: '/challenge/:itemId', //Opens Challenge with Slug sample id 195741
                  },
                },
                RecipesTab: {
                  screens: {
                    Recipes: '/recipes',
                    RecipeDetail: '/recipe/:itemId', // Opens Recipe with Slug 174661
                  },
                },
              },
            },
            HiddenTab: {
              screens: {
                NutritionChallenges: '/meal-plans',
                NutritionChallengeDetail: '/meal-plan/:itemId', // Opens Nutrition Challenge with Slug 174488
              },
            },
          },
        },
      },
    },
  };

  return (
    <NavigationContainer
      theme={WhiteTheme}
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.getCurrentRoute().name;
      }}
      onStateChange={async routeInfo => {
        try {
          const currentRouteName = navigationRef.getCurrentRoute();
          const routeParams = currentRouteName.params
            ? currentRouteName.params
            : {};

          // PREVENT AUTO TRACKING FOR VIEWING VIDEOS
          if (currentRouteName.name === 'VideoView') return;

          // LOG EVENT FOR TRACKING WITH GOOGLE ANALYTICS FIREBASE
          await analytics().logEvent(currentRouteName.name, routeParams);
        } catch (error) {
          // do something here
        }
      }}>
      <Stack.Navigator
        initialRouteName={ROUTE_SPLASH} //ROUTE_SPLASH, ROUTE_DRAWER_STACK_NAVIGATOR
        screenOptions={screenProps => {
          return {
            presentation: 'card', //modal, card, transparentModal

            headerStyle: {
              backgroundColor: 'rgba(255,255,255,1)',
              // elevation: 0, // remove shadow on Android
              // shadowOpacity: 0, // remove shadow on iOS
              borderBottomWidth: 1, // Just in case.
            },
            headerTintColor: 'black',
            headerTitle: '',
            headerLeft: () => (
              <TouchableOpacity style={styles.drawerHeaderLeft}>
                <Image
                  resizeMode="contain"
                  style={styles.drawerHeaderLogo}
                  source={require('../assets/images/logo_text.png')}
                  alt="logo"
                />
              </TouchableOpacity>
            ),
          };
        }}>
        <Stack.Screen
          name={ROUTE_SPLASH}
          component={SplashScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name={ROUTE_AUTH_STACK_NAVIGATOR}
          component={AuthStackNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTE_DRAWER_STACK_NAVIGATOR}
          component={DrawerStackNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTE_VIDEO_SCREEN}
          component={VideoScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={ROUTE_PDF_SCREEN}
          component={PdfScreen}
          options={{
            headerShown: false,
          }}
        />

        {/** MOVING THIS SCREEN TO THE DRAWER SINCE WE WANT TO ADD A DRAWER MENU TO IT */}
        {/* <Stack.Screen
          name={ROUTE_SUBSCRIPTIONS}
          component={SubscriptionsScreen}
          options={{
            headerShown: true,
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigator;
