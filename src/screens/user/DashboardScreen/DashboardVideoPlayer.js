import React, { } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Dimensions, Platform } from 'react-native';
import { View } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { setAppMainStatusBarStyle } from '../../../utils/Utils';

import MoVideoPlayer from '../../../components/MoVideoPlayer/MoVideoPlayer';
import { IMAGE_RATIO_16X9, ITEM_TYPE } from '../../../utils/Constants';
import MoVideoPlayerPlaceholder from '../../../components/MoVideoPlayer/MoVideoPlayerPlaceholder';

export default DashboardVideoPlayer = (props) => {
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
    <SafeAreaView>
      <View>
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
      </View>

      {/* <View style={{ width: '100%', height: 200}}>        
        <VideoPlayer
          source={{ uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }}   // Can be a URL or a local file.
          disableBack={true}
          showOnStart={false}
          resizeMode="contain"
          paused={false}
        />
      </View> */}
    </SafeAreaView>
  )
}
