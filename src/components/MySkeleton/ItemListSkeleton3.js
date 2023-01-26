import React from 'react';
import { Button, View, HStack, VStack, Center, Skeleton } from 'native-base';
import styles from './styles';
import CustomStyle from '../../styles/CustomStyle';
import ItemSkeleton3 from './ItemSkeleton3';

// for favorite  and saved videos
const ItemListSkeleton3 = (props) => {

  return (
    <View style={styles.itemListSkelton3}>
      <View style={[styles.itemList]}>
        <ItemSkeleton3 />
        <ItemSkeleton3 />
        <ItemSkeleton3 />       
      </View>

    </View>
  )
}

export default ItemListSkeleton3;