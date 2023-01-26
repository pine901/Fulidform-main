import React, { useState } from 'react';

import { Button, Center, CheckIcon, Select, Text, View } from 'native-base';
import { console_log } from '../../utils/Misc';
import styles from './styles';
import { ImageBackground, Image } from 'react-native';


const MyImageBox = (props) => {

  const { source } = props;
  const [focused, setFocused] = useState(false)


  return (
    <View style={styles.videoBox}>
      <ImageBackground resizeMode="cover" source={source} style={styles.videoThumbnail} alt="thumb" />
      <View style={styles.videoThumbnailOverlay}>
        <Center flex={1}>
          <Text fontSize="lg" textAlign="center" color="white"></Text>
        </Center>
      </View>
    </View>

  )
}

export default MyImageBox;