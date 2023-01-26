import React, {useEffect} from 'react';
import {LogBox, StatusBar, Image} from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Box,
  Center,
  Container,
  Button,
  VStack,
  HStack,
  useToast,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {SimpleAnimation} from 'react-native-simple-animations';

import {useDispatch, useSelector} from 'react-redux';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_DRAWER_STACK_NAVIGATOR,
  ROUTE_INTRODUCTION,
} from '../../routes/RouteNames';

import styles from './styles';
import BaseStyle from '../../styles/BaseStyle';
import {setAppMainStatusBarStyle} from '../../utils/Utils';
import {console_log} from '../../utils/Misc';
import {Dimensions} from 'react-native';
import MoVideoPlayer from '../../components/MoVideoPlayer/MoVideoPlayer';
import {DOWNLOAD_STATUS, IMAGE_RATIO_16X9} from '../../utils/Constants';

const VideoScreen = props => {
  const {navigation, route} = props;
  const {item, playSetting} = route.params;

  console_log('video item:::', item);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   setAppMainStatusBarStyle(StatusBar)
  // }, []);

  const signed = useSelector(state => state.auth.signed);
  //const user = useSelector(state => state.auth.user);
  //console_log("user:::", user)

  const dimension = Dimensions.get('window');
  const videoWidth = dimension.width;
  const wHeight = dimension.height;
  const videoHeight =
    videoWidth * IMAGE_RATIO_16X9 > wHeight
      ? wHeight
      : videoWidth * IMAGE_RATIO_16X9;

  return (
    <View safeArea style={styles.videoScreenContainer}>
      <Center style={styles.videoBG}>
        {playSetting['videoSourceType'] === 'remote' ? (
          <MoVideoPlayer
            style={{width: videoWidth, height: videoHeight}}
            source={item['source']} //{{uri:"https://2050today.org/wp-content/uploads/2020/07/Video-Placeholder.mp4"}}
            videoSourceType="remote"
            videoDownloadStatus={DOWNLOAD_STATUS.NONE}
            itemType={item['itemType']}
            itemDetail={item['itemDetail']}
            title={item['title']}
            poster={item['poster']}
            autoPlay={playSetting['autoPlay']}
            playInBackground={true}
            showHeader={true}
            showSeeking10SecondsButton={true}
            showFullScreenButton={true}
            showBackButton={true}
            navigation={navigation}
            showCastButton={true}
          />
        ) : (
          <MoVideoPlayer
            style={{width: videoWidth, height: videoHeight}}
            source={{uri: item['filePath']}}
            videoSourceType="local"
            videoDownloadStatus={DOWNLOAD_STATUS.DOWNLOADED}
            itemType={item['itemType']}
            itemDetail={item['itemDetail']}
            title={item['title']}
            poster={item['poster']}
            autoPlay={true}
            playInBackground={true}
            showHeader={true}
            showSeeking10SecondsButton={true}
            showFullScreenButton={true}
            showBackButton={true}
            navigation={navigation}
            showCastButton={true}
          />
        )}
      </Center>
    </View>
  );
};

export default VideoScreen;
