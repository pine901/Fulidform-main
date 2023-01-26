import React, {useEffect, useState} from 'react';
import ReactNative, {
  Pressable,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {Dimensions, Platform} from 'react-native';
import {
  Text,
  View,
  ScrollView,
  Button,
  useToast,
  VStack,
  HStack,
  Box,
  Skeleton,
} from 'native-base';

import useStyles from './styles';

import {Indicator} from '../../../components/Indicator';
import {CommonStyles} from '../../../utils/CommonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';
import {setAppMainStatusBarStyle, arrayToString} from '../../../utils/Utils';

import {
  addItemToArray,
  console_log,
  empty,
  removeItemFromArray,
} from '../../../utils/Misc';
import {useRef} from 'react';
import {
  ROUTE_PERSONAL_PROGRAM,
  ROUTE_SUBSCRIPTIONS,
} from '../../../routes/RouteNames';
import {
  apiGetDashboardDetail,
  apiGetWorkoutDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
  apiGetPlanDetail,
  apiGetProgramDetail,
} from '../../../utils/API';
import RecommendedChallengeBox from './RecommendedChallengeBox';
import {navReset} from '../../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_CHALLENGE_DETAIL,
} from '../../../routes/RouteNames';
import {signOut} from '../../../redux/auth/actions';
import BaseStyle from '../../../styles/BaseStyle';
import DynamicView from '../../../components/DynamicView';
import {
  IMAGE_RATIO_16X9,
  ITEM_TYPE,
  SIZE,
  VIDEO_SKELTON_HEIGHT,
} from '../../../utils/Constants';
import {isPadTablet} from '../../../utils/Misc';
import MoVideoPlayer from '../../../components/MoVideoPlayer/MoVideoPlayer';
import CustomStyle from '../../../styles/CustomStyle';
import {setFavorites, setRecentActivity} from '../../../redux/config/actions';
import {setSubscriptionDetails} from '../../../redux/auth/actions';
import MyResponsiveImage from '../../../components/MyResponsiveImage';

// BRAZE
import Braze from 'react-native-appboy-sdk';
import {width} from 'styled-system';

const iPadTablet = isPadTablet();
const permissionOptions = {
  alert: true,
  sound: true,
  badge: true,
  provisional: false,
};

export default DashboardScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {navigation, route} = props;
  const dispatch = useDispatch();
  useEffect(() => {
    loadPageData();
  }, []);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const appOrientation = useSelector(state => state.orientation.appOrientation);

  const styles = useStyles(appOrientation);

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
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const recentActivity = useSelector(state => state.config.recentActivity);
  useEffect(() => {
    if (
      recentActivity &&
      recentActivity['latest'] &&
      recentActivity['latest']['workoutId']
    ) {
      loadLatestActivityData(recentActivity['latest']['workoutId']);
    }
  }, [recentActivity]);

  const defaultPageData = {};
  const [pageData, setPageData] = useState(defaultPageData);
  const loadPageData = async () => {
    const apiKey = 'apiGetDashboardDetail';
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const response = await apiGetDashboardDetail();

    if (apiResponseIsSuccess(response)) {
      const {external_id} = response.data;
      // BRAZE
      // USE EXTERNAL ID AS USER ID
      Braze.changeUser(external_id);
      Braze.requestPushPermission(permissionOptions);

      dispatch(setSubscriptionDetails(response.data));
      dashboardLogicHandler(response.data);
      setPageData(response.data);
      dispatch(setFavorites(response.data['favourites']));
      //console_log("response['data']['recent_activity']", response['data']['recent_activity'])
      dispatch(setRecentActivity(response['data']['recent_activity']));

      if (
        response['data']['recent_activity'] &&
        !empty(response['data']['recent_activity']['latest'])
      ) {
        const latestWorkoutId =
          response['data']['recent_activity']['latest']['workoutId'];
        await loadLatestActivityData(latestWorkoutId);
      }
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
    endApiLoading(apiKey);
  };
  /////////////////////////////////////////// end common header for screen  ////////////////////////////////////////////

  const firstLogin = useSelector(state => state.config.firstLogin);
  useEffect(() => {
    // if (firstLogin) {
    //   navigation.navigate(ROUTE_SUBSCRIPTIONS)
    // }
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      setAppMainStatusBarStyle(StatusBar);
    }, []),
  );
  const handleSubmit = () => {
    navigation.navigate(ROUTE_PERSONAL_PROGRAM, {
      itemId: pageData.program['program_id'],
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////
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
  const videoWidth = iPadTablet
    ? appOrientation.width * 0.925
    : dimension.width - SIZE.APP_BODY_PADDING * 2;

  const [itemDetail, setItemDetail] = useState(null);
  const loadLatestActivityData = async itemId => {
    //workout
    const apiKey = 'apiGetWorkoutDetail-' + itemId;
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const response = await apiGetWorkoutDetail(itemId);
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

  /**
   * DASHBOARD SUBSCRIPTION LOGIC
   */
  const dashboardLogicHandler = async payload => {
    const {
      weekly_activity,
      featured_challenges,
      program: {program_id, plan_id},
      subscription: {status, message},
      purchased_challenges: {challenges},
    } = payload;

    // THIS IS TO REMOVE THE <P></P> TAG
    const newMsg = message ? message.replace(/(<([^>]+)>)/gi, '') : null;

    if (status === 'inactive' && challenges.length < 1) {
      // SHOW $details->subscription->message
      setSubscriptionInfo(prevState => {
        return {...prevState, message: newMsg, program_id, plan_id};
      });
    } else {
      //SHOW Subscription Section as follows:
      if (status !== 'inactive') {
        if (status === 'on-hold') {
          // SHOW $details->subscription->message
          setSubscriptionInfo(prevState => {
            return {...prevState, message: newMsg, program_id, plan_id};
          });
        }
        if (status === 'active') {
          if (program_id === 'none') {
            // SHOW $details->subscription->message
            setSubscriptionInfo(prevState => {
              return {...prevState, message: newMsg, program_id, plan_id};
            });
          } else if (program_id === 'in-review') {
            // SHOW $details->subscription->message
            setSubscriptionInfo(prevState => {
              return {...prevState, message: newMsg, program_id, plan_id};
            });
          } else {
            // SHOW $details->subscription->message
            // SHOW $details->weekly_activity
            // SHOW PERSONALISED PROGRAM using $details->program->program_id
            const personalised_program = await apiGetProgramDetail(program_id);
            setSubscriptionInfo(prevState => {
              return {
                ...prevState,
                message: newMsg,
                program_id,
                plan_id,
                weekly_activity:
                  weekly_activity instanceof Array
                    ? weekly_activity.length < 1
                      ? null
                      : weekly_activity
                    : Object.keys(weekly_activity).length < 1
                    ? null
                    : weekly_activity,
                personalised_program: personalised_program.data,
              };
            });
            if (featured_challenges.length > 0) {
              // SHOW $details->featured_challenges under a section title "What's New"
              setSubscriptionInfo(prevState => {
                return {...prevState, whats_new: featured_challenges};
              });
            }
            if (plan_id !== 'none') {
              // SHOW RECOMMENDED CHALLENGES using $details->$details->plan_id
              const recommended_challenges_data = await apiGetPlanDetail(
                plan_id,
              );

              setSubscriptionInfo(prevState => {
                return {
                  ...prevState,
                  recommended_challenges:
                    recommended_challenges_data.data.recommended_challenges,
                };
              });
            }
          }
        }
      }

      //SHOW Purchased Challenges Section as follows:
      if (challenges.length > 0) {
        // SHOW $details->purchased_challenges->title
        // SHOW $details->purchased_challenges->message
        // SHOW PURCHASED CHALLENGES using $details->purchased_challenges->challenges
        setSubscriptionInfo(prevState => {
          return {
            ...prevState,
            message: payload.purchased_challenges.message,
            title: payload.purchased_challenges.title,
            purchased_challenges: challenges,
            plan_id,
            program_id,
          };
        });
      }
    }
  };

  const WEEKLY_COUNT_LABEL =
    pageData && pageData.weekly_activity
      ? pageData.weekly_activity.weekly_count > 9
        ? pageData.weekly_activity.weekly_count
        : '0' + pageData.weekly_activity.weekly_count
      : 0;

  const USER_TOTALLY_INACTIVE =
    (pageData &&
      pageData.subscription &&
      pageData.subscription.status === 'active') ||
    (subscriptionInfo &&
      subscriptionInfo.purchased_challenges &&
      subscriptionInfo.purchased_challenges.length > 0)
      ? false
      : true;

  /**
   * UI FOR TABLET
   */
  if (iPadTablet === true) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <DynamicView style={BaseStyle.flex} mscroll={true} tscroll={true}>
          <View
            style={[
              styles[
                `screenWrapper_${appOrientation.orientation.toLowerCase()}`
              ],
              {
                alignItems: 'center',
              },
            ]}>
            {/** GREETINGS */}
            {pageData && pageData.subscription ? (
              <View
                style={
                  styles[
                    `dashboard_section_wrapper_${appOrientation.orientation.toLowerCase()}`
                  ]
                }>
                <Text style={styles.user_greeting_label}>
                  Hi {pageData.first_name}
                </Text>
                <Text style={styles.dashboard_intro_msg}>
                  {USER_TOTALLY_INACTIVE ? (
                    <Text fontWeight="bold">Access Limited: </Text>
                  ) : null}
                  {pageData &&
                    pageData.subscription &&
                    pageData.subscription.message.replace(/(<([^>]+)>)/gi, '')}
                </Text>
                {USER_TOTALLY_INACTIVE ? (
                  <Text marginTop={10} fontSize={18}>
                    Did you know you get a FREE equipment pack with the purchase
                    of your first subscription?
                  </Text>
                ) : null}

                {USER_TOTALLY_INACTIVE ? (
                  <Button
                    size="lg"
                    colorScheme="gray"
                    bg="black"
                    marginTop={10}
                    style={[
                      CommonStyles.appDefaultButton,
                      styles.dashboardButton,
                    ]}
                    onPress={() => {}}>
                    SUBSCRIBE NOW
                  </Button>
                ) : null}
              </View>
            ) : (
              <View
                style={
                  styles[
                    `dashboard_section_wrapper_${appOrientation.orientation.toLowerCase()}`
                  ]
                }>
                <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                  <Skeleton.Text lines={2} alignItems="center" px="12" />
                </HStack>
                <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                  <Skeleton h={8} />
                </HStack>
                <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                  <Skeleton.Text lines={2} alignItems="center" px="12" />
                </HStack>
              </View>
            )}

            {!USER_TOTALLY_INACTIVE ? (
              <View style={[styles.signature_wrapper]}>
                <Image
                  source={require('../../../assets/images/signature-v2.png')}
                  style={{
                    height: 60,
                    width: 120,
                  }}
                  resizeMode="contain"
                />
              </View>
            ) : null}

            {!USER_TOTALLY_INACTIVE ? (
              <Image
                source={require('../../../assets/images/ff-slider-v2-welcome-1800.jpeg')}
                style={
                  styles[
                    `dashboard_photo_intro_${appOrientation.orientation.toLowerCase()}`
                  ]
                }
                resizeMode="contain"
              />
            ) : null}

            {/** WORKOUT THIS WEEK */}
            {subscriptionInfo && subscriptionInfo.weekly_activity ? (
              <View
                style={
                  styles[
                    `dashboard_weekly_workout_wrapper_${appOrientation.orientation.toLowerCase()}`
                  ]
                }>
                <View style={styles.dashboard_weekly_workout_count_wrapper}>
                  {/* <ReactNative.Text
                    style={styles.dashboard_weekly_workout_count_label(
                      WEEKLY_COUNT_LABEL.toString(),
                    )}>
                    {WEEKLY_COUNT_LABEL}
                  </ReactNative.Text> */}
                  <Text
                    fontFamily="body"
                    fontWeight="400"
                    fontSize={`${
                      WEEKLY_COUNT_LABEL
                        ? 6 - WEEKLY_COUNT_LABEL.toString().length
                        : ''
                    }xl`}>
                    {WEEKLY_COUNT_LABEL}
                  </Text>
                  <ReactNative.Text
                    style={
                      styles.dashboard_weekly_workout_below_countlabel
                    }>{`WORKOUTS\nTHIS WEEK`}</ReactNative.Text>
                </View>
                <View style={styles.weekly_message_wrapper}>
                  <ReactNative.Text
                    numberOfLines={3}
                    style={
                      styles[
                        `dashboard_weekly_workout_message_${appOrientation.orientation.toLowerCase()}`
                      ]
                    }>
                    {subscriptionInfo.weekly_activity.weekly_message}
                  </ReactNative.Text>
                </View>
              </View>
            ) : !subscriptionInfo ? (
              <View style={styles.dashboard_section_wrapper}>
                <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                  <Skeleton h={8} />
                </HStack>
                <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                  <Skeleton h={8} />
                </HStack>
              </View>
            ) : null}

            {/** PERSONALISED PROGRAM AND CURRENT WORKOUT */}
            {(subscriptionInfo && subscriptionInfo.program_id !== 'none') ||
            (pageData &&
              pageData.subscription &&
              pageData.subscription.status === 'active') ? (
              <View style={styles.section_content_container}>
                {!empty(pageData['email']) ? (
                  <View>
                    <View style={[CustomStyle.mb4]}>
                      <Text fontSize="2xl" textAlign="center">
                        YOUR PERSONALISED PROGRAM
                      </Text>
                    </View>
                    {pageData['recent_activity'] &&
                    !empty(pageData['recent_activity']['latest']) ? (
                      <View>
                        <View style={[CustomStyle.mb4]}>
                          <Text fontSize="lg" textAlign="center">
                            CURRENT WORKOUT
                          </Text>
                        </View>
                        {!empty(itemDetail) ? (
                          <View style={[CustomStyle.mb4]}>
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
                          </View>
                        ) : (
                          <View style={[CustomStyle.mb4]}>
                            <Skeleton h={VIDEO_SKELTON_HEIGHT} />
                          </View>
                        )}
                        <View
                          style={[CustomStyle.mb4, CustomStyle.tFlexCenter]}>
                          <Button
                            size={iPadTablet ? 'lg' : 'sm'}
                            colorScheme="gray"
                            bg="black"
                            style={[CommonStyles.appDefaultButton]}
                            onPress={e => handleSubmit()}>
                            VIEW YOUR PERSONALISED PROGRAM
                          </Button>
                        </View>
                      </View>
                    ) : (
                      <>
                        <View
                          style={[CustomStyle.mb4, CustomStyle.tFlexCenter]}>
                          <Button
                            size="sm"
                            colorScheme="gray"
                            bg="black"
                            textAlign="center"
                            justifyContent="center"
                            alignItems="center"
                            style={[CommonStyles.appDefaultButton]}
                            onPress={e => handleSubmit()}>
                            <Text
                              textAlign="center"
                              fontWeight="bold"
                              style={CommonStyles.textWhite}>
                              GET STARTED WITH YOUR PERSONALISED PROGRAM
                            </Text>
                          </Button>
                        </View>
                      </>
                    )}
                  </View>
                ) : (
                  <View>
                    <HStack
                      space="2"
                      alignItems="center"
                      style={[CustomStyle.mb4]}>
                      <Skeleton.Text lines={2} alignItems="center" px="12" />
                    </HStack>
                    <HStack
                      space="2"
                      alignItems="center"
                      style={[CustomStyle.mb4]}>
                      <Skeleton h={VIDEO_SKELTON_HEIGHT} />
                    </HStack>
                    <HStack
                      space="2"
                      alignItems="center"
                      style={[CustomStyle.mb4]}>
                      <Skeleton h={8} />
                    </HStack>
                  </View>
                )}
              </View>
            ) : null}

            {/** WHAT'S NEW */}
            {pageData.featured_challenges &&
            pageData.featured_challenges.length > 0 ? (
              <View style={styles.section_content_container}>
                <View style={styles.section_title_wrapper}>
                  <Text fontSize="2xl" fontWeight="bold">
                    WHAT'S NEW
                  </Text>
                </View>

                {pageData.featured_challenges.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item ? (
                        <View>
                          <View style={styles.whatsNewItem}>
                            <MyResponsiveImage
                              style={
                                styles[
                                  `responsive_image_${appOrientation.orientation.toLowerCase()}`
                                ]
                              }
                              source={{uri: item['thumbnail']}}
                              ratio={IMAGE_RATIO_16X9}
                              resizeMode="cover"
                            />
                            <Button
                              size="lg"
                              colorScheme="gray"
                              style={[styles.itemThumbnailBtn]}
                              onPress={e => {
                                navigation.navigate(ROUTE_CHALLENGE_DETAIL, {
                                  itemId: item.id,
                                });
                              }}>
                              {item.experience_levels.length < 2
                                ? 'PLAY'
                                : 'RESUME'}
                            </Button>
                          </View>
                          <View style={styles.recommendedChallengeTextBox}>
                            <Text
                              mb="1"
                              fontSize={iPadTablet ? 'lg' : 'sm'}
                              textAlign="left"
                              fontWeight="bold"
                              numberOfLines={1}
                              ellipsizeMode={`tail`}>
                              {item['title']}
                            </Text>
                            <Text
                              fontSize={iPadTablet ? 'lg' : 'sm'}
                              textAlign="left"
                              numberOfLines={4}
                              ellipsizeMode={`tail`}
                              style={CommonStyles.textGray}>
                              Equipment:{' '}
                              {arrayToString(item['equipment'], 'name')}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            ) : null}

            {/** RECOMMENDED CHALLENGES */}
            {subscriptionInfo && subscriptionInfo.recommended_challenges ? (
              <View style={styles.section_content_container}>
                <View style={styles.section_title_wrapper}>
                  <Text fontSize="2xl" fontWeight="bold">
                    RECOMMENDED CHALLENGES
                  </Text>
                </View>

                {subscriptionInfo.recommended_challenges.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      {item ? (
                        <View>
                          <View style={styles.whatsNewItem}>
                            <MyResponsiveImage
                              style={
                                styles[
                                  `responsive_image_${appOrientation.orientation.toLowerCase()}`
                                ]
                              }
                              source={{uri: item['thumbnail']}}
                              ratio={IMAGE_RATIO_16X9}
                              resizeMode="cover"
                            />
                            <Button
                              size="lg"
                              colorScheme="gray"
                              style={[styles.itemThumbnailBtn]}
                              onPress={e => {
                                navigation.navigate(ROUTE_CHALLENGE_DETAIL, {
                                  itemId: item.id,
                                });
                              }}>
                              {item.experience_levels.length < 2
                                ? 'PLAY'
                                : 'RESUME'}
                            </Button>
                          </View>
                          <View style={styles.recommendedChallengeTextBox}>
                            <Text
                              mb="1"
                              fontSize={iPadTablet ? 'lg' : 'sm'}
                              textAlign="left"
                              fontWeight="bold"
                              numberOfLines={1}
                              ellipsizeMode={`tail`}>
                              {item['title']}
                            </Text>
                            <Text
                              fontSize={iPadTablet ? 'lg' : 'sm'}
                              textAlign="left"
                              numberOfLines={4}
                              ellipsizeMode={`tail`}
                              style={CommonStyles.textGray}>
                              Equipment:{' '}
                              {arrayToString(item['equipment'], 'name')}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            ) : null}
          </View>
        </DynamicView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <DynamicView style={BaseStyle.flex} mscroll={true} tscroll={true}>
        <View
          style={[
            styles[`screenWrapper_${appOrientation.orientation.toLowerCase()}`],
            {
              alignItems: 'center',
            },
          ]}>
          {/** GREETINGS */}
          {pageData && pageData.subscription ? (
            <View
              style={
                styles[
                  `dashboard_section_wrapper_${appOrientation.orientation.toLowerCase()}`
                ]
              }>
              <Text style={styles.user_greeting_label}>
                Hi {pageData.first_name}
              </Text>
              <Text style={styles.dashboard_intro_msg}>
                {USER_TOTALLY_INACTIVE ? (
                  <Text fontWeight="bold">Access Limited: </Text>
                ) : null}
                {pageData &&
                  pageData.subscription &&
                  pageData.subscription.message.replace(/(<([^>]+)>)/gi, '')}
              </Text>
              {USER_TOTALLY_INACTIVE ? (
                <Text marginTop={10} fontSize={18}>
                  Did you know you get a FREE equipment pack with the purchase
                  of your first subscription?
                </Text>
              ) : null}

              {USER_TOTALLY_INACTIVE ? (
                <Button
                  size="lg"
                  colorScheme="gray"
                  bg="black"
                  marginTop={10}
                  style={[
                    CommonStyles.appDefaultButton,
                    styles.dashboardButton,
                  ]}
                  onPress={() => {}}>
                  SUBSCRIBE NOW
                </Button>
              ) : null}
            </View>
          ) : (
            <View
              style={
                styles[
                  `dashboard_section_wrapper_${appOrientation.orientation.toLowerCase()}`
                ]
              }>
              <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                <Skeleton.Text lines={2} alignItems="center" px="12" />
              </HStack>
              <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                <Skeleton h={8} />
              </HStack>
              <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                <Skeleton.Text lines={2} alignItems="center" px="12" />
              </HStack>
            </View>
          )}

          {!USER_TOTALLY_INACTIVE ? (
            <View style={[styles.signature_wrapper]}>
              <Image
                source={require('../../../assets/images/signature-v2.png')}
                style={{
                  height: 60,
                  width: 120,
                }}
                resizeMode="contain"
              />
            </View>
          ) : null}

          {!USER_TOTALLY_INACTIVE ? (
            <Image
              source={require('../../../assets/images/ff-slider-v2-welcome-1800.jpeg')}
              style={
                styles[
                  `dashboard_photo_intro_${appOrientation.orientation.toLowerCase()}`
                ]
              }
              resizeMode="contain"
            />
          ) : null}

          {/** WORKOUT THIS WEEK */}
          {subscriptionInfo && subscriptionInfo.weekly_activity ? (
            <View
              style={
                styles[
                  `dashboard_weekly_workout_wrapper_${appOrientation.orientation.toLowerCase()}`
                ]
              }>
              <View style={styles.dashboard_weekly_workout_count_wrapper}>
                {/* <ReactNative.Text
                  style={styles.dashboard_weekly_workout_count_label(
                    WEEKLY_COUNT_LABEL.toString(),
                  )}>
                  {WEEKLY_COUNT_LABEL}
                </ReactNative.Text> */}
                <Text
                  fontFamily="body"
                  fontWeight="400"
                  fontSize={`${
                    WEEKLY_COUNT_LABEL
                      ? 6 - WEEKLY_COUNT_LABEL.toString().length
                      : ''
                  }xl`}>
                  {WEEKLY_COUNT_LABEL}
                </Text>
                <ReactNative.Text
                  style={
                    styles.dashboard_weekly_workout_below_countlabel
                  }>{`WORKOUTS\nTHIS WEEK`}</ReactNative.Text>
              </View>
              <View style={styles.weekly_message_wrapper}>
                <ReactNative.Text
                  // numberOfLines={3}
                  style={
                    styles[
                      `dashboard_weekly_workout_message_${appOrientation.orientation.toLowerCase()}`
                    ]
                  }>
                  {subscriptionInfo.weekly_activity.weekly_message}
                </ReactNative.Text>
              </View>
            </View>
          ) : !subscriptionInfo ? (
            <View style={styles.dashboard_section_wrapper}>
              <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                <Skeleton h={8} />
              </HStack>
              <HStack space="2" alignItems="center" style={[CustomStyle.mb4]}>
                <Skeleton h={8} />
              </HStack>
            </View>
          ) : null}

          {/** PERSONALISED PROGRAM AND CURRENT WORKOUT */}
          {(subscriptionInfo && subscriptionInfo.program_id !== 'none') ||
          (pageData &&
            pageData.subscription &&
            pageData.subscription.status === 'active') ? (
            <View style={[styles.mainContentWrapper]}>
              <DynamicView
                style={[BaseStyle.flex, BaseStyle.col12]}
                tscroll={true}>
                <View style={[CommonStyles.appBox, styles.headerBox]}>
                  {!empty(pageData['email']) ? (
                    <View>
                      <View style={[CustomStyle.mb4]}>
                        <Text
                          fontSize="lg"
                          textAlign="center"
                          fontWeight="bold">
                          YOUR PERSONALISED PROGRAM
                        </Text>
                      </View>
                      {pageData['recent_activity'] &&
                      !empty(pageData['recent_activity']['latest']) ? (
                        <View>
                          <View style={[CustomStyle.mb4]}>
                            <Text fontSize="md" textAlign="center">
                              CURRENT WORKOUT
                            </Text>
                          </View>
                          {!empty(itemDetail) ? (
                            <View style={[CustomStyle.mb4]}>
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
                            </View>
                          ) : (
                            <View style={[CustomStyle.mb4]}>
                              <Skeleton h={VIDEO_SKELTON_HEIGHT} />
                            </View>
                          )}
                          <View
                            style={[CustomStyle.mb4, CustomStyle.tFlexCenter]}>
                            <Button
                              size={iPadTablet ? 'lg' : 'sm'}
                              colorScheme="gray"
                              bg="black"
                              style={[CommonStyles.appDefaultButton]}
                              onPress={e => handleSubmit()}>
                              VIEW YOUR PERSONALISED PROGRAM
                            </Button>
                          </View>
                        </View>
                      ) : (
                        <>
                          <View
                            style={[CustomStyle.mb4, CustomStyle.tFlexCenter]}>
                            <Button
                              size="sm"
                              colorScheme="gray"
                              bg="black"
                              textAlign="center"
                              justifyContent="center"
                              alignItems="center"
                              style={[CommonStyles.appDefaultButton]}
                              onPress={e => handleSubmit()}>
                              <Text
                                textAlign="center"
                                fontWeight="bold"
                                style={CommonStyles.textWhite}>
                                GET STARTED WITH YOUR PERSONALISED PROGRAM
                              </Text>
                            </Button>
                          </View>
                        </>
                      )}
                    </View>
                  ) : (
                    <View>
                      <HStack
                        space="2"
                        alignItems="center"
                        style={[CustomStyle.mb4]}>
                        <Skeleton.Text lines={2} alignItems="center" px="12" />
                      </HStack>
                      <HStack
                        space="2"
                        alignItems="center"
                        style={[CustomStyle.mb4]}>
                        <Skeleton h={VIDEO_SKELTON_HEIGHT} />
                      </HStack>
                      <HStack
                        space="2"
                        alignItems="center"
                        style={[CustomStyle.mb4]}>
                        <Skeleton h={8} />
                      </HStack>
                    </View>
                  )}
                </View>
              </DynamicView>
            </View>
          ) : null}

          {/** WHAT'S NEW */}
          {pageData.featured_challenges &&
          pageData.featured_challenges.length > 0 ? (
            <View style={styles.whats_new_wrapper}>
              <DynamicView
                style={[BaseStyle.flex, BaseStyle.col12]}
                tscroll={true}>
                <Text fontSize="lg" fontFamily="body" fontWeight="500">
                  WHAT'S NEW
                </Text>

                <View mt="3">
                  {pageData.featured_challenges.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {item ? (
                          <Pressable style={styles.whatsNewItem}>
                            <View style={styles.whatsNewThumbBox}>
                              <MyResponsiveImage
                                style={
                                  styles[
                                    `responsive_image_${appOrientation.orientation.toLowerCase()}`
                                  ]
                                }
                                source={{uri: item['thumbnail']}}
                                ratio={IMAGE_RATIO_16X9}
                                resizeMode="cover"
                              />
                              <Button
                                size="xs"
                                colorScheme="gray"
                                style={[styles.itemThumbnailBtn]}
                                onPress={e => {
                                  navigation.navigate(ROUTE_CHALLENGE_DETAIL, {
                                    itemId: item.id,
                                  });
                                }}>
                                {item.experience_levels.length < 2
                                  ? 'PLAY'
                                  : 'RESUME'}
                              </Button>
                            </View>
                            <View style={styles.recommendedChallengeTextBox}>
                              <Text
                                mb="1"
                                fontSize={iPadTablet ? 'lg' : 'sm'}
                                textAlign="left"
                                fontWeight="bold"
                                numberOfLines={1}
                                ellipsizeMode={`tail`}>
                                {item['title']}
                              </Text>
                              <Text
                                fontSize={iPadTablet ? 'lg' : 'sm'}
                                fontFamily="body"
                                fontWeight="300"
                                textAlign="left"
                                numberOfLines={4}
                                ellipsizeMode={`tail`}
                                style={CommonStyles.textGray}>
                                Equipment:{' '}
                                {arrayToString(item['equipment'], 'name')}
                              </Text>
                            </View>
                          </Pressable>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </DynamicView>
            </View>
          ) : null}

          {subscriptionInfo && subscriptionInfo.recommended_challenges ? (
            <View style={styles.whats_new_wrapper}>
              <DynamicView
                style={[BaseStyle.flex, BaseStyle.col12]}
                tscroll={false}>
                <Text fontSize="lg" fontFamily="body" fontWeight="500">
                  RECOMMENDED CHALLENGES
                </Text>

                <View mt="3">
                  {subscriptionInfo.recommended_challenges.map(
                    (item, index) => {
                      return (
                        <React.Fragment key={index}>
                          {item ? (
                            <Pressable style={styles.whatsNewItem}>
                              <View style={styles.whatsNewThumbBox}>
                                <MyResponsiveImage
                                  style={
                                    styles[
                                      `responsive_image_${appOrientation.orientation.toLowerCase()}`
                                    ]
                                  }
                                  source={{uri: item['thumbnail']}}
                                  ratio={IMAGE_RATIO_16X9}
                                  resizeMode="cover"
                                />
                                <Button
                                  size="xs"
                                  colorScheme="gray"
                                  style={[styles.itemThumbnailBtn]}
                                  onPress={e => {
                                    navigation.navigate(
                                      ROUTE_CHALLENGE_DETAIL,
                                      {
                                        itemId: item.id,
                                      },
                                    );
                                  }}>
                                  {item.experience_levels.length < 2
                                    ? 'PLAY'
                                    : 'RESUME'}
                                </Button>
                              </View>
                              <View style={styles.recommendedChallengeTextBox}>
                                <Text
                                  mb="1"
                                  fontSize={iPadTablet ? 'lg' : 'sm'}
                                  fontWeight="bold"
                                  textAlign="left"
                                  numberOfLines={1}
                                  ellipsizeMode={`tail`}>
                                  {item['title']}
                                </Text>
                                <Text
                                  fontSize={iPadTablet ? 'lg' : 'sm'}
                                  textAlign="left"
                                  fontFamily="body"
                                  fontWeight="300"
                                  numberOfLines={4}
                                  ellipsizeMode={`tail`}
                                  style={CommonStyles.textGray}>
                                  Equipment:{' '}
                                  {arrayToString(item['equipment'], 'name')}
                                </Text>
                              </View>
                            </Pressable>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      );
                    },
                  )}
                </View>
              </DynamicView>
            </View>
          ) : null}

          {/** PURCHASED CHALLENGES */}
          {pageData &&
          pageData.purchased_challenges &&
          subscriptionInfo &&
          subscriptionInfo.purchased_challenges ? (
            <View
              style={
                styles[
                  `purchase_challenge_wrapper_${appOrientation.orientation.toLowerCase()}`
                ]
              }>
              <DynamicView
                style={[BaseStyle.flex, BaseStyle.col12]}
                tscroll={true}>
                <Text fontSize="lg" fontFamily="body" fontWeight="500">
                  {pageData.purchased_challenges.title.toUpperCase()}
                </Text>
                <Text fontSize="sm" marginBottom={5}>
                  {pageData.purchased_challenges.message.replace(
                    /(<([^>]+)>)/gi,
                    '',
                  )}
                </Text>

                <View mt="3">
                  {subscriptionInfo.purchased_challenges.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {item ? (
                          <Pressable style={styles.whatsNewItem}>
                            <View style={styles.whatsNewThumbBox}>
                              <MyResponsiveImage
                                style={
                                  styles[
                                    `responsive_image_${appOrientation.orientation.toLowerCase()}`
                                  ]
                                }
                                source={{uri: item['thumbnail']}}
                                ratio={IMAGE_RATIO_16X9}
                                resizeMode="cover"
                              />
                              <Button
                                size="xs"
                                colorScheme="gray"
                                style={[styles.itemThumbnailBtn]}
                                onPress={e => {
                                  navigation.navigate(ROUTE_CHALLENGE_DETAIL, {
                                    itemId: item.id,
                                  });
                                }}>
                                PLAY
                              </Button>
                            </View>
                            <View style={styles.recommendedChallengeTextBox}>
                              <Text
                                mb="1"
                                fontSize="lg"
                                textAlign="left"
                                fontWeight="bold"
                                // numberOfLines={1}
                                ellipsizeMode={`tail`}>
                                {item['title']}
                              </Text>
                              {arrayToString(item['equipment'], 'name') !==
                              '' ? (
                                <Text
                                  fontSize="sm"
                                  textAlign="left"
                                  fontFamily="body"
                                  fontWeight="300"
                                  // numberOfLines={4}
                                  ellipsizeMode={`tail`}
                                  style={CommonStyles.textGray}>
                                  Equipment:{' '}
                                  {arrayToString(item['equipment'], 'name')}
                                </Text>
                              ) : null}
                            </View>
                          </Pressable>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </DynamicView>
            </View>
          ) : null}
        </View>
      </DynamicView>
      {loading && <Indicator />}
    </SafeAreaView>
  );
};
