import React, { useEffect, useState } from 'react';
import { Text, View, useToast, Center } from 'native-base';

import styles from './styles';

import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { addItemToArray, console_log, empty, removeItemFromArray } from '../../../utils/Misc';
import { useRef } from 'react';
import { apiGetChallengeDetail, apiGetChallengeList, apiGetNutritionChallengeDetail, apiGetNutritionChallengeList, apiGetRecipeDetail, apiGetRecipeList, apiGetWorkoutDetail, apiGetWorkoutList, apiLoginRequired, apiResponseIsSuccess } from '../../../utils/API';
import { navReset } from '../../../utils/Nav';
import { ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN, ROUTE_MY_FAVORITE_WORKOUT_DETAIL, ROUTE_MY_FAVORITE_CHALLENGE_DETAIL, ROUTE_MY_FAVORITE_RECIPE_DETAIL, ROUTE_MY_FAVORITE_NUTRITION_DETAIL } from '../../../routes/RouteNames';
import { signOut } from '../../../redux/auth/actions';
import { Indicator } from '../../../components/Indicator';
import MyFlatList from '../../../components/MyFlatList';
import WorkoutItem from '../workouts/WorkoutItem';
import ChallengeItem from '../challenges/ChallengeItem';
import RecipeItem from '../recipes/RecipeItem';
import NutritionChallengeItem from '../nutritionChallenges/NutritionChallengeItem';
import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';

import { isPadTablet } from '../../../utils/Misc';
import ItemListSkeleton3 from '../../../components/MySkeleton/ItemListSkeleton3';

const iPadTablet = isPadTablet();

export default FavoriteList = (props) => {
  const { objectType, itemFavorites } = props
  const dispatch = useDispatch();
  const navigation = useNavigation()

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const STATIC_VALUES = useRef(
    {
      initialized: false,
      apiLoadingList: [],
      page: 1,
      fullLoaded: false,
      searchPayload: {}
    }
  )
  const checkLoading = (loadingList = null) => {
    let curLoadingList = [...STATIC_VALUES.current['apiLoadingList']]
    if (loadingList !== null) {
      curLoadingList = loadingList
    }
    const isLoading = (!empty(curLoadingList) && curLoadingList.length > 0)
    setLoading(isLoading)
    return isLoading
  }
  const startApiLoading = (apiKey) => {
    const newApiLoadingList = addItemToArray([...STATIC_VALUES.current['apiLoadingList']], apiKey)
    STATIC_VALUES.current['apiLoadingList'] = (newApiLoadingList)
    checkLoading(newApiLoadingList)
  }
  const endApiLoading = (apiKey) => {
    const newApiLoadingList = removeItemFromArray([...STATIC_VALUES.current['apiLoadingList']], apiKey)
    STATIC_VALUES.current['apiLoadingList'] = (newApiLoadingList)
    checkLoading(newApiLoadingList)
  }
  const checkApiIsLoading = (apiKey) => {
    if (!STATIC_VALUES.current['apiLoadingList'].includes(apiKey)) {
      return false;
    } else {
      return true;
    }
  }
  /////////////////////////////////////////// end common header for screen  ////////////////////////////////////////////


  //const [itemList, setItemList] = useState(false);
  let item_count_per_row = 3;
  let item_list = [];
  const [itemList, setItemList] = useState([]);
  const [pageInitialized, setPageInitialized] = useState(false);

  useEffect(() => {
    console_log("objectType, itemFavorites::::", objectType, itemFavorites)
    loadPageData();
  }, [itemFavorites]);

  const loadPageData = async () => {
    setPageInitialized(false);
    if (empty(itemFavorites) || itemFavorites.length === 0) {
      setItemList([])
    } else {
      await loadItemList(itemFavorites)
    }
    setPageInitialized(true);
  }

  const loadItemList = async (favorite_ids) => {
    const payload = {
      "ids": favorite_ids
    }
    let apiKey = "";
    if (objectType === 'workouts') {
      apiKey = "apiGetWorkoutList"
    }
    else if (objectType === 'bundles') {
      apiKey = "apiGetChallengeList"
    }
    else if (objectType === 'recipes') {
      apiKey = "apiGetRecipeList"
    }
    else if (objectType === 'nutrition_challenges') {
      apiKey = "apiGetNutritionChallengeList"
    }

    startApiLoading(apiKey);

    let response = null;
    if (objectType === 'workouts') {
      response = await apiGetWorkoutList(payload);
    }
    else if (objectType === 'bundles') {
      response = await apiGetChallengeList(payload);
    }
    else if (objectType === 'recipes') {
      response = await apiGetRecipeList(payload);
    }
    else if (objectType === 'nutrition_challenges') {
      response = await apiGetNutritionChallengeList(payload);
    }

    endApiLoading(apiKey)
    //console_log("response:::", response)
    if (apiResponseIsSuccess(response)) {
      item_list = response.data
      if (iPadTablet) {
        let mod_val = item_list.length % item_count_per_row;
        console_log("mod_val:::::", mod_val)
        if (mod_val > 0) {
          let empty_item_count = item_count_per_row - mod_val;
          for (let i = 0; i < empty_item_count; i++) {
            item_list.push({ id: "empty-item-" + objectType + "-" + i, empty_object: 1 })
          }
        }
      }
      setItemList(item_list)
      console_log("item_list.length, objectType:::", item_list.length, objectType)
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation)
      } else {
        toast.show({
          description: response.message
        });
      }
    }
  }

  const renderItem = ({ item, index, separators }) => {
    if (objectType === 'workouts') {
      return (
        <WorkoutItem item={item} vewItemDetail={vewItemDetail} />
      )
    }
    else if (objectType === 'bundles') {
      return (
        <ChallengeItem item={item} vewItemDetail={vewItemDetail} />
      )
    }
    else if (objectType === 'recipes') {
      return (
        <RecipeItem item={item} vewItemDetail={vewItemDetail} />
      )
    }
    else if (objectType === 'nutrition_challenges') {
      return (
        <NutritionChallengeItem item={item} vewItemDetail={vewItemDetail} />
      )
    }
  }

  const vewItemDetail = (itemId) => {
    if (objectType === 'workouts') {
      navigation.navigate(ROUTE_MY_FAVORITE_WORKOUT_DETAIL, { itemId: itemId })
    }
    else if (objectType === 'bundles') {
      navigation.navigate(ROUTE_MY_FAVORITE_CHALLENGE_DETAIL, { itemId: itemId })
    }
    else if (objectType === 'recipes') {
      navigation.navigate(ROUTE_MY_FAVORITE_RECIPE_DETAIL, { itemId: itemId })
    }
    else if (objectType === 'nutrition_challenges') {
      navigation.navigate(ROUTE_MY_FAVORITE_NUTRITION_DETAIL, { itemId: itemId })
    }
  }

  const EmptyComponent = () => {
    return (
      <Center flex={1}>
        <Text fontSize="md" textAlign="center">No favourited item found</Text>
      </Center>
    )
  }

  return (
    <View style={styles.itemListBox}>
      {
        (pageInitialized) ? (
          <>
            {
              (!loading && itemList.length === 0) ? (
                <EmptyComponent />
              ) : (
                <>
                  <MyFlatList
                    itemList={itemList}
                    renderItem={renderItem}
                    scrollEndCallback={() => { }}
                    numColumns={iPadTablet ? item_count_per_row : 1}
                  />
                </>
              )
            }
          </>
        ) : (
          <>
          <ItemListSkeleton3 />
          </>
        )
      }


      {loading && <Indicator />}
    </View >
  )
}