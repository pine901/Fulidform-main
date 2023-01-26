import React, {useEffect, useState} from 'react';
import {useRef} from 'react';
import {Dimensions, SafeAreaView} from 'react-native';
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

import styles from './styles';

import {Indicator} from '../../components/Indicator';
import {CommonStyles} from '../../utils/CommonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {
  console_log,
  joinMultiAssocArrayValue,
  addItemToArray,
  empty,
  equalTwoOjects,
  get_utc_timestamp_ms,
  removeItemFromArray,
  addIndexItemToArray,
  is_null,
} from '../../utils/Misc';
import {COLOR, IMAGE_RATIO_16X9, ITEM_TYPE, SIZE} from '../../utils/Constants';
import {
  apiGetChallengeDetail,
  apiGetWorkoutDetail,
  apiGetWorkoutList,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../utils/API';
import MyDigitalCalendar from '../../components/MyDigitalCalendar';
import MyVideoBox from '../../components/MyVideoBox';
import {signOut} from '../../redux/auth/actions';
import {navReset} from '../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_CHALLENGE_DETAIL,
} from '../../routes/RouteNames';
import MoVideoPlayer from '../MoVideoPlayer/MoVideoPlayer';

import {isPadTablet} from '../../utils/Misc';
import {width} from 'styled-system';
const iPadTablet = isPadTablet();

export default DaySessionBox = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {
    navigation,
    checkApiIsLoading,
    startApiLoading,
    endApiLoading,
    daySession,
    session_index = 0,
    itemType = '',
    itemDetail = {},
  } = props;
  //console_log("itemId:::", itemId)
  const dispatch = useDispatch();
  const appOrientation = useSelector(state => state.orientation.appOrientation);

  const toast = useToast();

  const [dayWorkouts, setDayWorkouts] = useState([]);

  useEffect(() => {
    if (daySession) {
      loadPageData();
    }
    return () => {};
  }, [daySession]);

  const loadPageData = async () => {
    setDayWorkouts(null);
    let newDayWorkouts = [];
    console_log('daySession:::', daySession);
    const workouts = daySession['workouts'];
    if (workouts && workouts.length > 0) {
      let workout_ids = [];
      for (let i = 0; i < workouts.length; i++) {
        workout_ids.push(workouts[i]['id']);
      }
      console_log('workout_ids:::', workout_ids);
      let workout_list = await loadWorkoutItemList(workout_ids);
      if (workout_list) {
        setDayWorkouts(workout_list);
      }
    } else {
      setDayWorkouts(newDayWorkouts);
    }
  };

  const loadWorkoutItemList = async workout_ids => {
    //console_log('workout:::', workout)
    const apiKey = 'apiGetWorkoutList';
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const payload = {
      ids: workout_ids,
    };
    const response = await apiGetWorkoutList(payload);
    endApiLoading(apiKey);
    if (apiResponseIsSuccess(response)) {
      return response.data;
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation);
      } else {
        toast.show({
          description: response.message,
        });
      }
      return false;
    }
  };
  const getVideoUrl = item => {
    let videoUrl = '';
    const videos = item['videos'];
    if (videos && videos.length > 0) {
      const video_item = videos[videos.length - 1];
      videoUrl = video_item['url'];
    }
    console.log('video url__________', videoUrl);
    return videoUrl;
  };

  const getWorkoutGroupItemDesc = () => {
    let desc = '';
    if (daySession && !empty(daySession['message'])) {
      desc = daySession['message'];
    }
    return desc;
  };

  // const dimension = Dimensions.get('window');
  // const videoWidth = (iPadTablet ? dimension.width * 3 / 5 - (SIZE.APP_BODY_PADDING * 2) : dimension.width - (SIZE.APP_BODY_PADDING * 2));
  const videoWidth = iPadTablet
    ? appOrientation.width * 0.65
    : appOrientation.width * 0.8;

  return (
    <React.Fragment>
      {!is_null(daySession) && !is_null(dayWorkouts) ? (
        <View>
          {dayWorkouts && dayWorkouts.length > 0 ? (
            dayWorkouts.map((item, index) => {
              //console_log("workouts item", item)
              return (
                <React.Fragment key={index}>
                  {item ? (
                    <View style={styles.dayWorkoutItem}>
                      <MoVideoPlayer
                        style={{
                          width: videoWidth,
                          height: videoWidth * IMAGE_RATIO_16X9,
                        }}
                        source={{uri: getVideoUrl(item)}}
                        videoSourceType="remote"
                        videoDownloadStatus={0}
                        itemType={itemType}
                        itemDetail={{
                          ...itemDetail,
                          session_index: session_index,
                          video_index: index,
                        }}
                        title={item['title']}
                        poster={item['thumbnail']}
                        autoPlay={false}
                        playInBackground={true}
                        showHeader={true}
                        showSeeking10SecondsButton={true}
                        showFullScreenButton={true}
                        showBackButton={false}
                        navigation={navigation}
                        placeholderMode={true}
                      />
                      <Text
                        fontSize="md"
                        textAlign="center"
                        mt={2}
                        style={CommonStyles.textGray}>
                        {item.title}
                      </Text>
                      <Text
                        fontSize="xs"
                        textAlign="center"
                        style={CommonStyles.textGray}>
                        {item.duration_display}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <View style={CommonStyles.appBox}>
              <Text
                fontSize="md"
                textAlign="center"
                style={CommonStyles.textGray}>
                {getWorkoutGroupItemDesc()}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.dayWorkoutItem}>
          <VStack space="6">
            <Skeleton style={styles.videoSkelton} />
            <Skeleton.Text lines={2} alignItems="center" px="12" />
          </VStack>
        </View>
      )}
    </React.Fragment>
  );
};
