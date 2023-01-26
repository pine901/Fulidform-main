import React from 'react';
import {Image} from 'react-native';
import {View} from 'native-base';
import styles from './styles';
import FastImage from 'react-native-fast-image';

const MyResponsiveImage = props => {
  const {source, ratio, resizeMode, style} = props; // 0.5625 means 16:9
  const defaultSource = require('../../assets/images/placeholder.png');

  return (
    <View style={style}>
      <View
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: ratio * 100 + '%',
        }}>
        <FastImage
          defaultSource={defaultSource}
          source={source}
          style={styles.responsiveImage}
          alt="responsiveImage"
          resizeMode={resizeMode}
        />
      </View>
    </View>
  );
};

export default MyResponsiveImage;
