import React, { } from 'react';
import { Pressable, SafeAreaView, StatusBar } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import { Button, Center, View } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { setAppMainStatusBarStyle } from '../../../utils/Utils';

import MoVideoPlayer from '../../../components/MoVideoPlayer/MoVideoPlayer';
import { IMAGE_RATIO_16X9, ITEM_TYPE } from '../../../utils/Constants';
import MoVideoPlayerPlaceholder from '../../../components/MoVideoPlayer/MoVideoPlayerPlaceholder';

import GoogleCast, { useDevices, useCastDevice, CastButton, useRemoteMediaClient } from 'react-native-google-cast'
import { console_log } from '../../../utils/Misc';
import MyCastButton from '../../../components/MyCastButton';


export default DashboardCastScreen = (props) => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const { navigation, route } = props;

  useFocusEffect(
    React.useCallback(() => {
      setAppMainStatusBarStyle(StatusBar)
    }, [])
  )

  const dimension = Dimensions.get('window')
  const videoWidth = dimension.width

  return (
    <SafeAreaView flex={1}>
      <Center flex={1}>
        <MoVideoPlayer
          style={{ width: videoWidth, height: videoWidth * IMAGE_RATIO_16X9, }}
          source={{ uri: "https://2050today.org/wp-content/uploads/2020/07/Video-Placeholder.mp4" }}
          videoDownloadStatus={0}
          itemType={ITEM_TYPE.WORKOUT}
          title={`Demo Video`}
          poster='https://pbs.twimg.com/media/FDX7UCbVcAUcNXj.jpg'
          autoPlay={false}
          playInBackground={true}
          showHeader={true}
          showSeeking10SecondsButton={true}
          showFullScreenButton={true}
          showBackButton={false}
          navigation={navigation}
          videoSourceType="remote"
          placeholderMode={true}
        />
        <MyCastButton
          buttonStyle={{ width: 18, height: 18, color: 'white', marginRight: 15 }}
          item={{
            source: { uri: "https://2050today.org/wp-content/uploads/2020/07/Video-Placeholder.mp4" },         
          }}
        />
        {/* <MoVideoPlayer
          style={{ width: videoWidth, height: videoWidth * IMAGE_RATIO_16X9, }}
          source={{ uri: "https://2050today.org/wp-content/uploads/2020/07/Video-Placeholder.mp4" }}
          videoDownloadStatus={0}
          itemType={ITEM_TYPE.WORKOUT}
          title={`Demo Video`}
          poster='https://pbs.twimg.com/media/FDX7UCbVcAUcNXj.jpg'
          autoPlay={false}
          playInBackground={true}
          showHeader={true}
          showSeeking10SecondsButton={true}
          showFullScreenButton={true}
          showBackButton={false}
          navigation={navigation}
          videoSourceType="remote"
          placeholderMode={true}
        /> */}
      </Center>


    </SafeAreaView>
  )
}
