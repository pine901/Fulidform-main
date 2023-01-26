import React, {useEffect, useState} from 'react';
import {useRef} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
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

import {Indicator} from '../../../components/Indicator';
import {CommonStyles} from '../../../utils/CommonStyles';
import {useDispatch, useSelector} from 'react-redux';
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
  apiGetProgramDetail,
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
import {setAppMainStatusBarStyle} from '../../../utils/Utils';
import HTMLView from 'react-native-htmlview';

import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';
import DynamicView from '../../../components/DynamicView';

import {isPadTablet} from '../../../utils/Misc';
import GoBackHandler from '../../../components/GoBackHandler';

const iPadTablet = isPadTablet();

export default PersonalProgramScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {route} = props;
  const navigation = useNavigation();
  const {itemId} = route.params;
  //console_log("itemId:::", itemId)
  const dispatch = useDispatch();
  const navState = useNavigationState(state => state);

  const toast = useToast();
  const [loading, setLoading] = useState(false);

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

  const workoutGroup = useSelector(
    state => state.config.digitalCalendar.workoutGroup,
  );
  const currentDayIndex = useSelector(
    state => state.config.digitalCalendar.currentDayIndex,
  );
  const subscriptionDetails = useSelector(
    state => state.auth.subscriptionDetails,
  );
  const IS_OPENED_VIA_DEEPLINK = navState.routes.length < 2 ? true : false;

  useEffect(() => {
    if (subscriptionDetails) {
      if (subscriptionDetails.status !== 'active') {
        // BACK TO DASHBOARD IF SUBSCRIPTION NOT ACTIVE
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
      setAppMainStatusBarStyle(StatusBar);

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
    const apiKey = 'apiGetProgramDetail-' + itemId;
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const response = await apiGetProgramDetail(itemId);
    console_log('Program detail itemId:::', itemId);
    endApiLoading(apiKey);
    if (apiResponseIsSuccess(response)) {
      setItemDetail(response.data);
      dispatch(
        setDigitalCalendar({
          workoutGroup: response.data.program.workout_group,
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
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <DynamicView style={[CustomStyle.flexibleSplitter]} mscroll={true}>
        <GoBackHandler />
        <View style={[CustomStyle.itemMainBox]}>
          {!empty(itemDetail['program']) ? (
            <DynamicView style={[BaseStyle.flex]} tscroll={true}>
              <View style={[CommonStyles.appBox, styles.headerBox]}>
                <MyDigitalCalendar />
                <View style={[styles.titleBox]}>
                  {!empty(itemDetail['program']) ? (
                    <Text fontSize="lg" textAlign="center">
                      {itemDetail['program']['title']}
                    </Text>
                  ) : (
                    <Skeleton h="10" />
                  )}
                </View>

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
                  itemType={ITEM_TYPE.PROGRAM}
                  itemDetail={itemDetail['program']}
                  session_index={currentDayIndex}
                />
              </View>

              <View style={styles.itemDetailButtonBox}>
                <Button
                  size="sm"
                  colorScheme="gray"
                  bg="black"
                  leftIcon={
                    <Ionicon name="calendar-outline" color={COLOR.WHITE} />
                  }
                  style={CommonStyles.appDefaultButton}
                  onPress={e => showDitialCalendarDrawer()}>
                  VIEW DIGITAL CALENDAR
                </Button>
              </View>
            </DynamicView>
          ) : (
            <View style={CommonStyles.appBox}>
              <VStack space="6">
                <Skeleton.Text mt={8} />
              </VStack>
            </View>
          )}
        </View>
        <View style={[CustomStyle.itemSidebarBox]}>
          <DynamicView
            style={[
              CustomStyle.itemSidebarBoxContent,
              styles.itemSidebarBoxContent,
            ]}
            tscroll={true}>
            {!empty(itemDetail['program']) ? (
              <View style={styles.itemDetailMainBox}>
                <View style={styles.itemDetailHeader}>
                  <View flex="1" mr="2">
                    <Text fontSize="lg">PERSONALISED PROGRAM</Text>
                  </View>
                </View>

                <View style={[CommonStyles.appBox, CommonStyles.bgWhite]}>
                  <HTMLView value={itemDetail['program_note']} />
                </View>
              </View>
            ) : (
              <View style={CommonStyles.appBox}>
                <VStack space="6">
                  <Skeleton h="8" />
                  <Skeleton.Text mt={8} />
                  <Skeleton.Text mt={8} />
                </VStack>
              </View>
            )}
          </DynamicView>
        </View>
      </DynamicView>

      {loading && <Indicator />}
    </SafeAreaView>
  );
};
