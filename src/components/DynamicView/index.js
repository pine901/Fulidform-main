import {View} from 'native-base';
import React from 'react';
import {ScrollView} from 'react-native';
import {isPadTablet} from '../../utils/Misc';
import styles from './styles';

const ipadTablet = isPadTablet();
const DynamicView = vprops => {
  if (ipadTablet) {
    if (vprops.tscroll) {
      return <ScrollView {...vprops}>{vprops.children}</ScrollView>;
    } else {
      return <View {...vprops}>{vprops.children}</View>;
    }
  } else {
    if (vprops.mscroll) {
      return <ScrollView {...vprops}>{vprops.children}</ScrollView>;
    } else {
      return <View {...vprops}>{vprops.children}</View>;
    }
  }
};

export default DynamicView;
