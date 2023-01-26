import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRef} from 'react';
import {SafeAreaView, StatusBar, Image} from 'react-native';
import {
  View,
  ScrollView,
  Text,
  useToast,
  HStack,
  VStack,
  Pressable,
  Skeleton,
} from 'native-base';

import styles from './styles';

import {Indicator} from '../../../components/Indicator';
import {CommonStyles} from '../../../utils/CommonStyles';
import {useDispatch} from 'react-redux';
import {
  console_log,
  joinMultiAssocArrayValue,
  addItemToArray,
  empty,
  equalTwoOjects,
  get_utc_timestamp_ms,
  removeItemFromArray,
} from '../../../utils/Misc';
import {useFocusEffect, useNavigationState} from '@react-navigation/native';
import {setAppMainStatusBarStyle} from '../../../utils/Utils';
import WorkOutFlatBox from '../../../components/WorkOutFlatBox';
import {
  apiGetRecipeDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../../utils/API';
import MyFavoriteBox from '../../../components/MyFavoriteBox';
import MyThumbnailBox from '../../../components/MyThumbnailBox';
import MyResponsiveImage from '../../../components/MyResponsiveImage';
import {IMAGE_RATIO_16X9} from '../../../utils/Constants';
import HTMLView from 'react-native-htmlview';
import ItemDetailSkeleton from '../../../components/MySkeleton/ItemDetailSkeleton';
import {navReset} from '../../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_DRAWER_STACK_NAVIGATOR,
} from '../../../routes/RouteNames';
import {signOut} from '../../../redux/auth/actions';

import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';
import DynamicView from '../../../components/DynamicView';

import {isPadTablet} from '../../../utils/Misc';
import GoBackHandler from '../../../components/GoBackHandler';

const iPadTablet = isPadTablet();

export default RecipeDetailScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {navigation, route} = props;
  const {itemId} = route.params;
  //console_log("itemId:::", itemId)
  const dispatch = useDispatch();
  const navState = useNavigationState(state => state);

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const STATIC_VALUES = useRef({
    apiLoadingList: [],
    page: 1,
    fullLoaded: false,
    searchPayload: {},
  });
  const checkLoading = (loadingList = null) => {
    let curLoadingList = [...STATIC_VALUES.current['apiLoadingList']];
    if (loadingList !== null) {
      curLoadingList = loadingList;
    }
    const isLoading = !empty(curLoadingList) && curLoadingList.length > 0;
    setLoading(isLoading);
    return isLoading;
  };
  const startApiLoading = apiKey => {
    const newApiLoadingList = addItemToArray(
      [...STATIC_VALUES.current['apiLoadingList']],
      apiKey,
    );
    STATIC_VALUES.current['apiLoadingList'] = newApiLoadingList;
    checkLoading(newApiLoadingList);
  };
  const endApiLoading = apiKey => {
    const newApiLoadingList = removeItemFromArray(
      [...STATIC_VALUES.current['apiLoadingList']],
      apiKey,
    );
    STATIC_VALUES.current['apiLoadingList'] = newApiLoadingList;
    checkLoading(newApiLoadingList);
  };
  const checkApiIsLoading = apiKey => {
    if (!STATIC_VALUES.current['apiLoadingList'].includes(apiKey)) {
      return false;
    } else {
      return true;
    }
  };
  /////////////////////////////////////////// end common header for screen  ////////////////////////////////////////////
  const itemFavorites = useSelector(state => state.config.favorites.recipes);
  const subscriptionDetails = useSelector(
    state => state.auth.subscriptionDetails,
  );
  const IS_OPENED_VIA_DEEPLINK = navState.routes.length < 2 ? true : false;

  useEffect(() => {
    if (subscriptionDetails) {
      const IS_CHALLENGE_EMPTY =
        subscriptionDetails.purchased_challenges.challenges.length > 0
          ? false
          : true;

      if (subscriptionDetails.status !== 'active' && IS_CHALLENGE_EMPTY) {
        // IF ROUTES IS LESS THAN 2 THAT MEANS THE APP WAS OPENED VIA DEEP LINK
        if (IS_OPENED_VIA_DEEPLINK) {
          // BACK TO DASHBOARD IF CHALLENGE IS NOT PURCHASED AND SUBSCRIPTION NOT ACTIVE
          navigation.replace(ROUTE_DRAWER_STACK_NAVIGATOR);
        }
      }
    }
  }, [subscriptionDetails, IS_OPENED_VIA_DEEPLINK]);

  useEffect(() => {
    if (itemId) {
      loadPageData();
    }
  }, [itemId]);
  const loadPageData = async () => {
    await loadItemDetail();
  };

  const [itemDetail, setItemDetail] = useState({});
  const loadItemDetail = async () => {
    const apiKey = 'apiGetRecipeDetail';
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const response = await apiGetRecipeDetail(itemId);
    endApiLoading(apiKey);
    if (apiResponseIsSuccess(response)) {
      setItemDetail(response.data);
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation);
      } else {
        toast.show({
          description: response.message,
        });
      }
    }
  };

  const ItemIngrementMethod = () => {
    return (
      <>
        {itemDetail.ingredients ? (
          <View style={styles.itemDetailIngredientBox}>
            <Text fontSize="md" mb={3}>
              INGREDIENTS
            </Text>
            <HTMLView
              value={itemDetail.ingredients ? itemDetail.ingredients : ''}
            />
          </View>
        ) : (
          <></>
        )}
        {itemDetail.method ? (
          <View style={styles.itemDetailMethodBox}>
            <Text fontSize="md" mb={3}>
              METHOD
            </Text>
            <HTMLView value={itemDetail.method ? itemDetail.method : ''} />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  if (IS_OPENED_VIA_DEEPLINK) {
    // PREVENT ANY RENDERING IF SUBSCRIPTION IS NOT ACTIVE
    if (
      !subscriptionDetails ||
      (subscriptionDetails &&
        subscriptionDetails.subscription.status !== 'active')
    ) {
      return (
        <View style={CommonStyles.appBox}>
          <VStack space="6">
            <HStack>
              <View flex={1} justifyContent="center" alignItems="flex-start">
                <Skeleton h="4" w="12" rounded="full" />
              </View>
              <View flex={1} justifyContent="center" alignItems="center">
                <Skeleton h="4" w="12" rounded="full" />
              </View>
              <View flex={1} justifyContent="center" alignItems="flex-end">
                <Skeleton h="4" w="12" rounded="full" />
              </View>
            </HStack>
            <Skeleton style={styles.videoSkelton} />
            <Skeleton.Text mt={6} />
          </VStack>
        </View>
      );
    }

    // PREVENT ANY RENDERING IF CHALLENGE DOES NOT EXIST IN THE PURCHASED CHALLENGE
    // THIS WILL HANDLE THE SCENARIO WHERE USER IS NOT ACTIVE BUT HAS PURCHASED CHALLENGE
    if (subscriptionDetails) {
      const IS_CHALLENGE_EMPTY =
        subscriptionDetails.purchased_challenges.challenges.length > 0
          ? false
          : true;

      if (IS_CHALLENGE_EMPTY) {
        return (
          <View style={CommonStyles.appBox}>
            <VStack space="6">
              <HStack>
                <View flex={1} justifyContent="center" alignItems="flex-start">
                  <Skeleton h="4" w="12" rounded="full" />
                </View>
                <View flex={1} justifyContent="center" alignItems="center">
                  <Skeleton h="4" w="12" rounded="full" />
                </View>
                <View flex={1} justifyContent="center" alignItems="flex-end">
                  <Skeleton h="4" w="12" rounded="full" />
                </View>
              </HStack>
              <Skeleton style={styles.videoSkelton} />
              <Skeleton.Text mt={6} />
            </VStack>
          </View>
        );
      }
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <GoBackHandler />
      <DynamicView mscroll={true} tscroll={true}>
        <View style={[CustomStyle.itemMainBox_new]}>
          {!empty(itemDetail['id']) ? (
            <DynamicView style={[BaseStyle.flex]} tscroll={true} mscroll={true}>
              <MyResponsiveImage
                source={{uri: itemDetail['original_image']}}
                ratio={IMAGE_RATIO_16X9 * 1.8}
                resizeMode="contain"
              />

              <DynamicView style={[BaseStyle.flex]} mscroll={false}>
                <View style={styles.itemDetailHeader}>
                  <View flex="1" mr="2">
                    <Text fontSize="lg">{itemDetail['title']}</Text>
                  </View>
                  <MyFavoriteBox
                    item={itemDetail}
                    itemType="recipes"
                    checkApiIsLoading={checkApiIsLoading}
                    startApiLoading={startApiLoading}
                    endApiLoading={endApiLoading}
                    itemFavorites={itemFavorites}
                  />
                </View>
                <View style={CommonStyles.appBox}>
                  <View style={styles.itemParamsBox}>
                    <View style={styles.itemParam}>
                      <Text
                        fontSize="xs"
                        fontWeight="normal"
                        style={CommonStyles.textLightGray}>
                        MAKES
                      </Text>
                      <Text fontSize="xs" style={CommonStyles.textGray}>
                        {itemDetail['makes']}
                      </Text>
                    </View>
                    <View style={styles.itemParam}>
                      <Text
                        fontSize="xs"
                        fontWeight="normal"
                        style={CommonStyles.textLightGray}>
                        PREP TIME
                      </Text>
                      <Text fontSize="xs" style={CommonStyles.textGray}>
                        {itemDetail['prep_time']}
                      </Text>
                    </View>
                    <View style={styles.itemParam}>
                      <Text
                        fontSize="xs"
                        fontWeight="normal"
                        style={CommonStyles.textLightGray}>
                        COOKING TIME
                      </Text>
                      <Text fontSize="xs" style={CommonStyles.textGray}>
                        {itemDetail['cooking_time']}
                      </Text>
                    </View>
                  </View>
                  {itemDetail.body ? (
                    <View style={styles.itemDetailBodyBox}>
                      <HTMLView
                        value={itemDetail.body ? itemDetail.body : ''}
                      />
                    </View>
                  ) : (
                    <></>
                  )}

                  {!iPadTablet ? <ItemIngrementMethod /> : <></>}
                </View>
              </DynamicView>
            </DynamicView>
          ) : (
            <ItemDetailSkeleton />
          )}
        </View>
        <View style={[CustomStyle.itemSidebarBox]}>
          <DynamicView
            style={[CustomStyle.itemSidebarBoxContent]}
            tscroll={true}>
            {iPadTablet ? <ItemIngrementMethod /> : <></>}
          </DynamicView>
        </View>
      </DynamicView>

      {loading && <Indicator />}
    </SafeAreaView>
  );
};
