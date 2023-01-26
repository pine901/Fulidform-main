import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRef} from 'react';
import {SafeAreaView, StatusBar, Image, Linking} from 'react-native';
import {
  View,
  ScrollView,
  Text,
  useToast,
  VStack,
  Pressable,
  Button,
  Center,
  HStack,
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
  joinMultiAssocObjectValue,
} from '../../../utils/Misc';
import {
  useFocusEffect,
  useNavigationState,
  StackActions,
} from '@react-navigation/native';
import {setAppMainStatusBarStyle} from '../../../utils/Utils';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {COLOR, IMAGE_RATIO_16X9} from '../../../utils/Constants';

import {
  apiGetNutritionChallengeDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../../utils/API';
import MyFavoriteBox from '../../../components/MyFavoriteBox';
import MyResponsiveImage from '../../../components/MyResponsiveImage';
import MealCalendar from './MealCalendar';
import ItemDetailSkeleton from '../../../components/MySkeleton/ItemDetailSkeleton';
import {navNavigate, navPush, navReset} from '../../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_CHALLENGE_DETAIL,
  ROUTE_PDF_SCREEN,
  ROUTE_DRAWER_STACK_NAVIGATOR,
  ROUTE_USER_TAB_NAVIGATOR,
  ROUTE_RECIPES_TAB,
  ROUTE_RECIPE_DETAIL,
  ROUTE_NUTRITION_RECIPE_DETAIL,
} from '../../../routes/RouteNames';
import {signOut} from '../../../redux/auth/actions';

import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';
import DynamicView from '../../../components/DynamicView';

import {isPadTablet} from '../../../utils/Misc';
import {TouchableOpacity} from 'react-native-gesture-handler';
import GoBackHandler from '../../../components/GoBackHandler';

const iPadTablet = isPadTablet();

export default NutritionChallengeDetailScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {navigation, route} = props;
  const {itemId} = route.params;
  //console_log("itemId:::", itemId)
  const dispatch = useDispatch();
  const navState = useNavigationState(state => state);

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const apiKey = 'apiGetNutritionChallengeDetail';

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
  const itemFavorites = useSelector(
    state => state.config.favorites.nutrition_challenges,
  );
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
  const detailtItem = {recipe_summary: {}};
  const [itemDetail, setItemDetail] = useState(detailtItem);
  const loadItemDetail = async () => {
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const response = await apiGetNutritionChallengeDetail(itemId);
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

  const handleDownload = pdf_file_type => {
    const pdf_path = itemDetail[pdf_file_type];
    console_log('pdf_file_type, pdf_path', pdf_file_type, pdf_path);

    // const item = {
    //   uri: pdf_path,
    //   itemDetail: itemDetail,
    // }
    // navigation.navigate(ROUTE_PDF_SCREEN, { item: item })

    Linking.canOpenURL(pdf_path).then(supported => {
      if (supported) {
        Linking.openURL(pdf_path);
      } else {
        console.log("Don't know how to open URI: " + pdf_path);
      }
    });
  };

  const DownloadBox = () => {
    return (
      <View style={[CommonStyles.appBox1, styles.downloadBox]}>
        <VStack space={2} mt={1} mb={3}>
          <Center>
            {!empty(itemDetail) && !empty(itemDetail['shopping_list_file']) && (
              <Button
                size="sm"
                variant="outline"
                _text={{color: COLOR.FONT_GRAY}}
                leftIcon={<Icon name="download" />}
                style={[CommonStyles.appWhiteButton, styles.btnDownload]}
                onPress={e => handleDownload('shopping_list_file')}>
                DOWNLOAD SHOPPING LIST
              </Button>
            )}
          </Center>
          <Center>
            {!empty(itemDetail) && !empty(itemDetail['meal_plan_file']) && (
              <Button
                size="sm"
                variant="outline"
                _text={{color: COLOR.FONT_GRAY}}
                leftIcon={<Icon name="download" />}
                style={[CommonStyles.appWhiteButton, styles.btnDownload]}
                onPress={e => handleDownload('meal_plan_file')}>
                DOWNLOAD MEAL PLAN
              </Button>
            )}
          </Center>
        </VStack>
      </View>
    );
  };

  const OnPressRecipeItem = itemId => {
    navigation.navigate(ROUTE_NUTRITION_RECIPE_DETAIL, {itemId: itemId});
    //const routeArr = [ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_USER_TAB_NAVIGATOR, ROUTE_RECIPES_TAB, ROUTE_RECIPE_DETAIL]
    //  navNavigate(routeArr, { itemId: itemId }, navigation) //navPush
  };

  const RecipeSummaryBox = r_props => {
    const {item_list} = r_props;
    let arr = [];
    if (empty(item_list)) {
      return <></>;
    } else {
      for (let k in item_list) {
        const item = item_list[k];
        arr.push(item);
      }
    }
    return (
      <VStack space={1} mt={1}>
        {arr.map((item, index) => {
          return (
            <TouchableOpacity
              key={item['id']}
              onPress={e => OnPressRecipeItem(item['id'])}>
              <Text
                fontSize="xs"
                fontWeight="normal"
                style={CommonStyles.textGray}>
                {item['title']}
              </Text>
            </TouchableOpacity>
          );
        })}
      </VStack>
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
      <ScrollView flex={1}>
        <View style={[CustomStyle.flexibleSplitter]}>
          <View style={[CustomStyle.itemMainBox]}>
            {!empty(itemDetail['id']) ? (
              <View>
                <View style={styles.itemDetailThumbBox}>
                  <MyResponsiveImage
                    source={{uri: itemDetail['feature_image']}}
                    ratio={IMAGE_RATIO_16X9}
                    resizeMode="cover"
                  />
                  <View style={styles.linearGradientBox}>
                    <LinearGradient
                      colors={[
                        'rgba(255,255,255,0)',
                        'rgba(255,255,255,0.5)',
                        'rgba(255,255,255,1)',
                      ]}
                      style={styles.linearGradient}>
                      <View style={styles.itemDetailHeader}>
                        <View flex="1" mr="2">
                          <Text bold fontSize="sm">
                            {itemDetail['subtitle']}
                          </Text>
                          <Text fontSize="2xl">{itemDetail['title']}</Text>
                        </View>
                        <MyFavoriteBox
                          item={itemDetail}
                          itemType="nutrition_challenges"
                          checkApiIsLoading={checkApiIsLoading}
                          startApiLoading={startApiLoading}
                          endApiLoading={endApiLoading}
                          itemFavorites={itemFavorites}
                        />
                      </View>
                    </LinearGradient>
                  </View>
                </View>
                {iPadTablet ? (
                  <>
                    <DownloadBox />
                  </>
                ) : (
                  <></>
                )}
              </View>
            ) : (
              <ItemDetailSkeleton />
            )}
          </View>
          <View style={[CustomStyle.itemSidebarBox]}>
            {!empty(itemDetail['id']) ? (
              <View
                style={[
                  CustomStyle.itemSidebarBoxContent,
                  styles.itemSidebarBoxContent,
                ]}>
                <View style={[CommonStyles.appBox1, CommonStyles.bgWhite]}>
                  <Text fontSize="lg">MEAL SUMMARY</Text>
                </View>
                <View style={[CommonStyles.appBox1, CommonStyles.bgLightGray]}>
                  <Text fontSize="md">BREAKFAST</Text>
                  <RecipeSummaryBox
                    item_list={itemDetail['recipe_summary']['breakfast']}
                  />
                </View>
                <View style={[CommonStyles.appBox1, CommonStyles.bgWhite]}>
                  <Text fontSize="md">LUNCH</Text>
                  <RecipeSummaryBox
                    item_list={itemDetail['recipe_summary']['lunch']}
                  />
                </View>
                <View style={[CommonStyles.appBox1, CommonStyles.bgLightGray]}>
                  <Text fontSize="md">DINNER</Text>
                  <RecipeSummaryBox
                    item_list={itemDetail['recipe_summary']['dinner']}
                  />
                </View>
                <View style={[CommonStyles.appBox1, CommonStyles.bgWhite]}>
                  <Text fontSize="md">SNACK</Text>
                  <RecipeSummaryBox
                    item_list={itemDetail['recipe_summary']['snack']}
                  />
                </View>
              </View>
            ) : (
              <ItemDetailSkeleton />
            )}
          </View>
        </View>
        <View>
          {!empty(itemDetail['id']) ? (
            <>
              {!iPadTablet ? (
                <>
                  <DownloadBox />
                </>
              ) : (
                <></>
              )}
              <MealCalendar
                calendarData={itemDetail['meal_calendar']}
                OnPressRecipeItem={OnPressRecipeItem}
              />
            </>
          ) : (
            <ItemDetailSkeleton />
          )}
        </View>
      </ScrollView>
      {loading && <Indicator />}
    </SafeAreaView>
  );
};
