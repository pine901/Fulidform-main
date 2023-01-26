import React from 'react';
import { View } from 'native-base';

import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { console_log } from '../../utils/Misc';
import { Dimensions } from 'react-native';

const PdfScreen = (props) => {
  const { navigation, route } = props;
  const { item } = route.params;
  const source = { uri: item.uri, cache: true };

  console_log("source:::", source)

  const dimension = Dimensions.get('window')
  const videoWidth = dimension.width
  const wHeight = dimension.height

  return (
    <View style={styles.container}>
      {/* <Pdf
        trustAllCerts={false}
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf} /> */}
    </View>
  )
}

export default PdfScreen;

