import { View } from 'native-base';
import React, { } from 'react';
import { ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { isPadTablet } from '../../utils/Misc';
import styles from './styles';

const ipadTablet = isPadTablet();
const DynamicCollapsible = (vprops) => {
  if (ipadTablet) {
    if (vprops.tcollapse) {
      return (
        <Collapsible {...vprops}>{vprops.children}</Collapsible>
      )
    } else {
      return (
        <View {...vprops}>{vprops.children}</View>
      )
    }
  } else {
    if (vprops.mcollapse) {
      return (
        <Collapsible {...vprops}>{vprops.children}</Collapsible>
      )
    } else {
      return (
        <View {...vprops}>{vprops.children}</View>
      )
    }
  }
}

export default DynamicCollapsible;