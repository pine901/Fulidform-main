import { Spinner } from 'native-base';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

export const Indicator = ({color = 'black'}) => {
  return (
    <View style={styles.wrapper}>
       <Spinner size="lg" color={color} />
    </View>
  )
}