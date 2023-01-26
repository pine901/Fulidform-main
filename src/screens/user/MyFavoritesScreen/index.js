import {View, Text} from 'native-base';
import * as React from 'react';

import {Dimensions, SafeAreaView} from 'react-native';
const {width, height} = Dimensions.get('window');

import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import {COLOR} from '../../../utils/Constants';
import FavoriteList from './FavoriteList';
import styles from './styles';

const workOutsRoute = () => {
  const itemFavorites = useSelector(state => {
    if (state.config.favorites && state.config.favorites.workouts) {
      return state.config.favorites.workouts;
    } else {
      return [];
    }
  });

  return (
    <>
      <FavoriteList objectType="workouts" itemFavorites={itemFavorites} />
    </>
  );
};

const challengsRoute = () => {
  const itemFavorites = useSelector(state => {
    if (state.config.favorites && state.config.favorites.bundles) {
      return state.config.favorites.bundles;
    } else {
      return [];
    }
  });

  return (
    <>
      <FavoriteList objectType="bundles" itemFavorites={itemFavorites} />
    </>
  );
};

const recipesRoute = () => {
  const itemFavorites = useSelector(state => {
    if (state.config.favorites && state.config.favorites.recipes) {
      return state.config.favorites.recipes;
    } else {
      return [];
    }
  });

  return (
    <>
      <FavoriteList objectType="recipes" itemFavorites={itemFavorites} />
    </>
  );
};

const nutritionRoute = () => {
  const itemFavorites = useSelector(state => {
    if (state.config.favorites && state.config.favorites.nutrition_challenges) {
      return state.config.favorites.nutrition_challenges;
    } else {
      return [];
    }
  });

  return (
    <>
      <FavoriteList
        objectType="nutrition_challenges"
        itemFavorites={itemFavorites}
      />
    </>
  );
};

const renderScene = SceneMap({
  workOuts: workOutsRoute,
  challengs: challengsRoute,
  recipes: recipesRoute,
  nutrition: nutritionRoute,
});

export default MyFavoritesScreen = props => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'workOuts', title: 'WORKOUTS'},
    {key: 'challengs', title: 'CHALLENGES'},
    {key: 'recipes', title: 'RECIPES'},
    {key: 'nutrition', title: 'MEAL PLANS       '}, // space is for padding right
  ]);

  const renderTabBar = t_props => {
    return (
      <TabBar
        {...t_props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
        pressColor={'transparent'}
        activeColor={COLOR.FONT_DARK}
        inactiveColor={COLOR.FONT_WARNING}
      />
    );
  };

  // const renderTabBar = (t_props) => {
  //   const inputRange = t_props.navigationState.routes.map((x, i) => i);
  //   return <ScrollView horizontal={true} flexDirection="row" pt="3" pb="3">
  //     {t_props.navigationState.routes.map((route, i) => {
  //       const color = index === i ? COLOR.FONT_DARK : COLOR.FONT_WARNING
  //       return <Box flex={1} alignItems="flex-start" cursor="pointer" key={i}>
  //         <Pressable  p="3" onPress={() => {
  //           //console_log(i);
  //           setIndex(i);
  //         }}>
  //           <Animated.Text style={{
  //             color: color,
  //             fontWeight: 'bold'
  //           }}>{route.title}</Animated.Text>
  //         </Pressable>
  //       </Box>;
  //     })}
  //   </ScrollView>;
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View flex={1}>
        <View style={styles.header}>
          <Text fontSize="lg">MY FAVOURITES</Text>
        </View>

        <TabView
          navigationState={{index, routes}}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: width}}
          style={{
            shadowOffset: {height: 0, width: 0},
            shadowColor: 'transparent',
            shadowOpacity: 0,
            elevation: 0,
          }}
        />
      </View>
    </SafeAreaView>
  );
};
