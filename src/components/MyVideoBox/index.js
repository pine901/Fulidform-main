import React, { useEffect, useState } from 'react';

import { Button, Center, CheckIcon, Select, Text, View } from 'native-base';
import { console_log } from '../../utils/Misc';
import styles from './styles';
import { ImageBackground, Image } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

const MyVideoBox = (props) => {

  const { navigation, url } = props;
  useEffect(() => {

  }, []);

  return (
    <View style={styles.videoBox}>
      {(url) ? (
        <VideoPlayer
          source={{ uri: url }}   // Can be a URL or a local file.
          disableBack={true}
          showOnStart={false}
          resizeMode="contain"
          paused={false}
          style={styles.backgroundVideo}
        />
      ) : ( <></> )
      }
    </View>
  )
}

export default MyVideoBox;