import React, { useEffect } from 'react';
import {
  ImageBackground,
} from 'react-native';
import { View, Text, Button, useToast, FlatList } from 'native-base';


import styles from './styles';

import { CommonStyles } from '../../utils/CommonStyles';
import { useDispatch } from 'react-redux';


export default WorkOutFlatBox = (props) => {
  const { flatData, navigation, route, image } = props;
  const dispatch = useDispatch();

  useEffect(() => {

  }, []);

  const toast = useToast();
 
  
  const vewWorkOut = () => {
    //navigation.navigate(ROUTE_DASHBOARD)
  }
 

  const renderItem = ({ item, index, separators }) => {

    var boxStyle = [styles.workOutItemFlatBox]
    if (index === 0) {
      boxStyle.push(styles.workOutItemFlatBoxFirst)
    }
    if (index === flatData.item_list.length - 1) {
      boxStyle.push(styles.workOutItemFlatBoxLast)
    }
    return (
      <View style={boxStyle}>
        <View style={styles.workOutItemFlatThumbnailBox}>
          <ImageBackground resizeMode="cover" source={image} style={styles.workOutItemFlatThumbnail} alt="thumb" />
          <View style={styles.workOutItemFlatThumbnailOverlay}>
            <Button size="xs" colorScheme="gray" style={[styles.workOutItemFlatThumbnailBtn]} onPress={(e) => vewWorkOut()}>VIEW WORKOUT</Button>
          </View>
        </View>
        <View style={styles.workOutItemFlatTextBox}>
          <View style={styles.workOutItemFlatTitleBox}>
            <Text fontSize="sm" style={styles.workOutItemFlatTitle}>MINI REFORMER 4</Text>
          </View>
          <View style={styles.workOutItemFlatDateBox}>
            <Text fontSize="xs" style={styles.workOutItemFlatDate}>19:59</Text>
          </View>
          <View style={styles.workOutItemFlatDescBox}>
            <Text fontSize="xs" style={styles.workOutItemFlatDesc}>Ankle Weights, Bands, Small Ball</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.workOutFlatBox}>
      <View style={styles.workOutFlatBoxTitle}>
        <Text mb={1} fontSize="md" textAlign="left" style={[CommonStyles.textGray]}>{flatData.title}</Text>
      </View>
      <FlatList style={styles.workOutFlatItemList}
        horizontal={true}
        data={flatData.item_list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}