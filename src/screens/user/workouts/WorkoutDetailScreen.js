import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRef} from 'react';
import {Dimensions, SafeAreaView} from 'react-native';
import {View, ScrollView, Text, useToast, HStack, VStack} from 'native-base';
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
import MyVideoBox from '../../../components/MyVideoBox';
import WorkOutFlatBox from '../../../components/WorkOutFlatBox';
import {
  apiGetWorkoutDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../../utils/API';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_DRAWER_STACK_NAVIGATOR,
} from '../../../routes/RouteNames';
import {signOut} from '../../../redux/auth/actions';
import {navReset} from '../../../utils/Nav';
import MyFavoriteBox from '../../../components/MyFavoriteBox';

import styles from './styles';
import ItemDetailSkeleton from '../../../components/MySkeleton/ItemDetailSkeleton';
import {IMAGE_RATIO_16X9, ITEM_TYPE} from '../../../utils/Constants';
import MoVideoPlayer from '../../../components/MoVideoPlayer/MoVideoPlayer';

import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';
import DynamicView from '../../../components/DynamicView';

import {isPadTablet} from '../../../utils/Misc';
import GoBackHandler from '../../../components/GoBackHandler';
import {useNavigationState} from '@react-navigation/native';

const iPadTablet = isPadTablet();

export default WorkoutDetailScreen = props => {
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
  const itemFavorites = useSelector(state => state.config.favorites.workouts);
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
  }, [itemId]);
  const loadPageData = async () => {
    await loadItemDetail();
  };

  const [itemDetail, setItemDetail] = useState({});
  const loadItemDetail = async () => {
    const apiKey = 'apiGetWorkoutDetail';
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const response = await apiGetWorkoutDetail(itemId);
    endApiLoading(apiKey);
    //console_log("response:::", response)
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

  const getVideoUrl = () => {
    let videoUrl = '';
    const videos = itemDetail['videos'];
    if (videos && videos.length > 0) {
      const video_item = videos[videos.length - 1];
      videoUrl = video_item['url'];
    }
    return videoUrl;
  };
  const dimension = Dimensions.get('window');
  const videoWidth = iPadTablet ? dimension.width * (3 / 5) : dimension.width;

  // const workOutFlatData = [
  //   {
  //     title: "ATHLETES WORKOUTS",
  //     item_list: [
  //       {
  //         id: 1,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 2,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 3,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       }
  //     ]
  //   },
  //   {
  //     title: "ABS WORKOUTS",
  //     item_list: [
  //       {
  //         id: 1,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 2,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 3,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       }
  //     ]
  //   },
  //   {
  //     title: "BANDS WORKOUTS",
  //     item_list: [
  //       {
  //         id: 1,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 2,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       },
  //       {
  //         id: 3,
  //         image: "aaa.png",
  //         title: "test",
  //         time: "14:03",
  //         desc: "No equipment"
  //       }
  //     ]
  //   },
  // ];

  const workOutFlatData = [];

  const ItemBody = () => {
    return (
      <>
        {!empty(itemDetail['id']) ? (
          workOutFlatData.length > 0 ? (
            <>
              <View style={CommonStyles.appBox}>
                <Text
                  fontSize="md"
                  textAlign="left"
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  Add on any of these to your workout...
                </Text>
              </View>
              <View style={styles.itemFlatBoxList}>
                {workOutFlatData.map((flatData, index) => {
                  return (
                    <WorkOutFlatBox
                      key={index}
                      flatData={flatData}
                      navigation={navigation}
                      route={route}
                    />
                  );
                })}
              </View>
            </>
          ) : (
            <></>
          )
        ) : (
          <>
            <ItemDetailSkeleton />
          </>
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
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <GoBackHandler />
      <DynamicView mscroll={true} tscroll={true}>
        <View style={[CustomStyle.itemMainBox_new]}>
          {!empty(itemDetail['id']) ? (
            <DynamicView
              style={[BaseStyle.flex, {paddingTop: iPadTablet ? 50 : 0}]}
              tscroll={false}>
              <MoVideoPlayer
                style={{
                  width: videoWidth,
                  height: videoWidth * IMAGE_RATIO_16X9,
                }}
                source={{uri: getVideoUrl()}}
                videoSourceType="remote"
                videoDownloadStatus={0}
                itemType={ITEM_TYPE.WORKOUT}
                itemDetail={itemDetail}
                title={itemDetail['title']}
                poster={itemDetail['thumbnail']}
                autoPlay={false}
                playInBackground={true}
                showHeader={true}
                showSeeking10SecondsButton={true}
                showFullScreenButton={true}
                showBackButton={false}
                navigation={navigation}
                placeholderMode={true}
              />

              <DynamicView style={[BaseStyle.flex]} mscroll={true}>
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
                      {itemDetail['duration_display'] &&
                        itemDetail['duration_display'].length > 0 && (
                          <HStack>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              style={CommonStyles.textGray}>
                              Length:{' '}
                            </Text>
                            <Text
                              flex={1}
                              fontSize="xs"
                              fontWeight="normal"
                              style={CommonStyles.textGray}>
                              {itemDetail['duration_display']}
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
                    itemType="workouts"
                    checkApiIsLoading={checkApiIsLoading}
                    startApiLoading={startApiLoading}
                    endApiLoading={endApiLoading}
                    itemFavorites={itemFavorites}
                  />
                </View>

                {!iPadTablet ? <ItemBody /> : <></>}
              </DynamicView>
            </DynamicView>
          ) : (
            <ItemDetailSkeleton />
          )}
        </View>
        <View style={[CustomStyle.itemSidebarBox]}>
          <DynamicView
            style={[
              CustomStyle.itemSidebarBoxContent,
              styles.itemSidebarBoxContent,
            ]}
            tscroll={false}>
            {iPadTablet ? <ItemBody /> : <></>}
          </DynamicView>
        </View>
      </DynamicView>

      {loading && <Indicator />}
    </SafeAreaView>
  );
};
