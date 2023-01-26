import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {
  View,
  ScrollView,
  Text,
  useToast,
  Button,
  VStack,
  HStack,
  Box,
  Skeleton,
} from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
  DrawerActions,
  useNavigation,
  useNavigationState,
} from '@react-navigation/native';
import styles from './styles';
import _ from 'lodash';

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
import {COLOR, ITEM_TYPE} from '../../../utils/Constants';
import {
  apiGetChallengeDetail,
  apiGetWorkoutDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../../utils/API';
import MyFavoriteBox from '../../../components/MyFavoriteBox';
import MyDigitalCalendar from '../../../components/MyDigitalCalendar';
import {
  setDigitalCalendar,
  setDrawerContentType,
} from '../../../redux/config/actions';
import {signOut} from '../../../redux/auth/actions';
import {useFocusEffect} from '@react-navigation/native';
import {navReset} from '../../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_DRAWER_STACK_NAVIGATOR,
} from '../../../routes/RouteNames';

import ItemDetailSkeleton from '../../../components/MySkeleton/ItemDetailSkeleton';
import DaySessionBox from '../../../components/DaySessionBox';

import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';
import DynamicView from '../../../components/DynamicView';

import {isPadTablet} from '../../../utils/Misc';
import GoBackHandler from '../../../components/GoBackHandler';

const iPadTablet = isPadTablet();

export default ChallengeDetailScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {route} = props;
  const navigation = useNavigation();
  const {itemId} = route.params;
  //console_log("itemId:::", itemId)
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navState = useNavigationState(state => state);

  const STATIC_VALUES = useRef({
    apiLoadingList: [],
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
  const itemFavorites = useSelector(state => state.config.favorites.bundles);
  const subscriptionDetails = useSelector(
    state => state.auth.subscriptionDetails,
  );
  const workoutGroup = useSelector(
    state => state.config.digitalCalendar.workoutGroup,
  );
  const currentDayIndex = useSelector(
    state => state.config.digitalCalendar.currentDayIndex,
  );
  const IS_OPENED_VIA_DEEPLINK = navState.routes.length < 2 ? true : false;

  useEffect(() => {
    if (subscriptionDetails) {
      const IS_CHALLENGE_EMPTY =
        subscriptionDetails.purchased_challenges.challenges.length > 0
          ? false
          : true;

      if (subscriptionDetails.status !== 'active' && IS_CHALLENGE_EMPTY) {
        // BACK TO DASHBOARD IF CHALLENGE IS NOT PURCHASED AND SUBSCRIPTION NOT ACTIVE
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
    return () => {
      //console_log("destroy challenge detail itemId:::", itemId)
      setItemDetail({});
      dispatch(
        setDigitalCalendar({
          workoutGroup: [],
          currentDayIndex: 0,
        }),
      );
    };
  }, [itemId]);

  useFocusEffect(
    React.useCallback(() => {
      ///
      return () => {
        //console_log("Challenge detail screen is inactive")
        dispatch(setDrawerContentType('menu'));
        navigation.dispatch(DrawerActions.closeDrawer());
      };
    }, []),
  );

  const loadPageData = async () => {
    await loadItemDetail();
  };

  const [itemDetail, setItemDetail] = useState({});

  const loadItemDetail = async () => {
    const apiKey = 'apiGetChallengeDetail-' + itemId;
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const response = await apiGetChallengeDetail(itemId);
    console_log('challenge detail itemId:::', itemId);
    endApiLoading(apiKey);
    if (apiResponseIsSuccess(response)) {
      setItemDetail(response.data);
      dispatch(
        setDigitalCalendar({
          workoutGroup: response.data.workout_group,
          currentDayIndex: 0,
        }),
      );
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

  const showDitialCalendarDrawer = () => {
    dispatch(setDrawerContentType('calendar'));
    navigation.dispatch(DrawerActions.openDrawer());
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
      <View style={[CustomStyle.flexibleSplitter_single_col]}>
        <GoBackHandler />

        <DynamicView mscroll={true} tscroll={true}>
          <View style={[CustomStyle.itemMainBox_new]}>
            {!empty(itemDetail['id']) ? (
              <DynamicView style={[BaseStyle.flex]} tscroll={false}>
                <View style={[CommonStyles.appBox, styles.headerBox]}>
                  <MyDigitalCalendar />

                  <DaySessionBox
                    {...props}
                    checkApiIsLoading={checkApiIsLoading}
                    startApiLoading={startApiLoading}
                    endApiLoading={endApiLoading}
                    daySession={
                      !empty(workoutGroup) && workoutGroup.length > 0
                        ? workoutGroup[currentDayIndex]
                        : null
                    }
                    itemType={ITEM_TYPE.CHALLENGE}
                    itemDetail={itemDetail}
                    session_index={currentDayIndex}
                  />
                </View> 

                <View style={styles.itemDetailButtonBox}>
                  <>
                    <Button
                      size={iPadTablet ? 'lg' : 'sm'}
                      colorScheme="gray"
                      bg="black"
                      leftIcon={
                        <Ionicon name="calendar-outline" color={COLOR.WHITE} />
                      }
                      style={[CommonStyles.appDefaultButton]}
                      onPress={e => showDitialCalendarDrawer()}>
                      VIEW DIGITAL CALENDAR
                    </Button>
                  </>
                </View>
              </DynamicView>
            ) : (
              <View style={CommonStyles.appBox}>
                <VStack space="6">
                  <HStack>
                    <View
                      flex={1}
                      justifyContent="center"
                      alignItems="flex-start">
                      <Skeleton h="4" w="12" rounded="full" />
                    </View>
                    <View flex={1} justifyContent="center" alignItems="center">
                      <Skeleton h="4" w="12" rounded="full" />
                    </View>
                    <View
                      flex={1}
                      justifyContent="center"
                      alignItems="flex-end">
                      <Skeleton h="4" w="12" rounded="full" />
                    </View>
                  </HStack>
                  <Skeleton style={styles.videoSkelton} />
                  <Skeleton.Text mt={6} />
                </VStack>
              </View>
            )}
          </View>

          <View
            style={[
              CustomStyle.itemSidebarBoxContent,
              styles.itemSidebarBoxContent,
            ]}>
            {!empty(itemDetail['id']) ? (
              <>
                <View style={styles.itemDetailHeader}>
                  <View flex="1" mr="2">
                    <Text fontSize="lg">{itemDetail['title']}</Text>
                    <VStack style={styles.itemDetailDescBox}>
                      {itemDetail['experience_levels'] &&
                        itemDetail['experience_levels'].length > 0 && (
                          <HStack>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              style={CommonStyles.textGray}>
                              Level:{' '}
                            </Text>
                            <Text
                              flex={1}
                              fontSize="xs"
                              fontWeight="normal"
                              style={CommonStyles.textGray}>
                              {joinMultiAssocArrayValue(
                                itemDetail['experience_levels'],
                              )}
                            </Text>
                          </HStack>
                        )}
                      {itemDetail['spans'] &&
                        itemDetail['spans'].length > 0 && (
                          <HStack>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              style={CommonStyles.textGray}>
                              Duration:{' '}
                            </Text>
                            <Text
                              flex={1}
                              fontSize="xs"
                              fontWeight="normal"
                              style={CommonStyles.textGray}>
                              {joinMultiAssocArrayValue(itemDetail['spans'])}
                            </Text>
                          </HStack>
                        )}
                      {itemDetail['equipment'] &&
                        itemDetail['equipment'].length > 0 && (
                          <HStack>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              style={CommonStyles.textGray}>
                              Equipment:{' '}
                            </Text>
                            <Text
                              flex={1}
                              fontSize="xs"
                              fontWeight="normal"
                              style={CommonStyles.textGray}>
                              {joinMultiAssocArrayValue(
                                itemDetail['equipment'],
                              )}
                            </Text>
                          </HStack>
                        )}
                    </VStack>
                  </View>
                  <MyFavoriteBox
                    item={itemDetail}
                    itemType="bundles"
                    checkApiIsLoading={checkApiIsLoading}
                    startApiLoading={startApiLoading}
                    endApiLoading={endApiLoading}
                    itemFavorites={itemFavorites}
                  />
                </View>
                <View style={[CommonStyles.appBox, CommonStyles.bgWhite]}>
                  <Text fontSize="xs" style={CommonStyles.textGray}>
                    {itemDetail['description']}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </DynamicView>
      </View>

      {loading && <Indicator />}
    </SafeAreaView>
  );
};
