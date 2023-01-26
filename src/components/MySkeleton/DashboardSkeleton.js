import React from 'react';
import { Button, View, HStack, VStack, Center, Skeleton } from 'native-base';
import styles from './styles';


const DashboardSkeleton = (props) => {

  return (
    <View style={CommonStyles.appBox}>
      <VStack space="6">
        <Skeleton style={styles.responsiveImage} />
        <HStack space="2" alignItems="center">
          <Skeleton.Text flex="1" />
          <Skeleton size="30" rounded="full" />
        </HStack>
        <Skeleton.Text mt={8} />
        <Skeleton.Text mt={8} />
      </VStack>
    </View>
  )
}

export default DashboardSkeleton;