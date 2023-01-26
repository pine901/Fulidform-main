import React from 'react';
import { Button, View, HStack, VStack, Center, Skeleton } from 'native-base';
import styles from './styles';
import { CommonStyles } from '../../utils/CommonStyles';


const ItemSkeleton3 = (props) => {

  return (
    <View style={styles.itemSkeltonWrapper3}>
      <VStack space="6">
        <Skeleton style={styles.itemThumb} />
        <HStack space="2" alignItems="flex-start">
          <Skeleton.Text lines={2} flex="1" />
          <Skeleton size="10" h={3} rounded="full" />
        </HStack>
      </VStack>
    </View>
  )
}

export default ItemSkeleton3;