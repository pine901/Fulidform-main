import React from 'react';
import { Button, View, HStack, VStack, Center, Skeleton } from 'native-base';
import styles from './styles';
import CustomStyle from '../../styles/CustomStyle';
import ItemSkeleton from './ItemSkeleton';


const ItemListSkeleton = (props) => {

  return (
    <View style={styles.itemListSkelton}>
      <View style={[styles.itemListTitle, CustomStyle.mb3]}>
        <Skeleton h={6} rounded="full" />
      </View>
      <View style={[styles.itemList]}>
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />
        <ItemSkeleton />       
      </View>

    </View>
  )
}

export default ItemListSkeleton;