import React from 'react';
import { View, Text, FlatList, HStack, Spinner } from 'native-base';
import styles from './styles';
import { API_PAGE_SIZE } from '../../utils/API';
import { useEffect } from 'react';

export default MyFlatList = (props) => {
  const { title, itemList, renderItem, scrollEndCallback, itemsLoading, reloadTimestamp, numColumns=1, onScroll } = props;

  const num = API_PAGE_SIZE // This is the number which defines how many data will be loaded for every 'onReachEnd'
  const initialLoadNumber = 40 // This is the number which defines how many data will be loaded on first open

  const flatListRef = React.useRef()

  const toTop = () => {
    // use current
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 })
  }

  const renderHeaderComponent = () => {
    return (
      title ? <View style={styles.flatHeader}><Text fontSize="md" textAlign="center">{title}</Text></View> : <></>
    )
  }
  const renderFooterComponent = () => {
    return (
      <>
        {
          (itemsLoading && itemList.length > 0) ? (
            <HStack space={2} justifyContent="center" padding={3}>
              <Spinner accessibilityLabel="Loading" color="black" />
              <Text color="black" fontSize="md">
                Loading
              </Text>
            </HStack>
          ) : (
            <View></View>
          )
        }
      </>
    )
  }

  useEffect(() => {
    if(reloadTimestamp && reloadTimestamp > 0) {
      toTop()
    }
  }, [reloadTimestamp]);

  return (
    <FlatList
      ref={flatListRef}
      style={styles.flatItemList}
      data={itemList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={renderFooterComponent}    
      maxToRenderPerBatch={num}
      updateCellsBatchingPeriod={num / 2}
      onEndReachedThreshold={20} //While you scolling the offset number and your data number will increases.So endReached will be triggered earlier because our data will be too many
      onEndReached={scrollEndCallback}
      onScroll={onScroll}
      // removeClippedSubviews={true} // REMOVE THE CLIP SUBVIEW BECAUSE THIS IS CAUSING THE ISSUE WHERE THE LIST IS EMPTY UNTIL YOU PULL DOWN THE SCROLL
      refreshing={true}
      numColumns={numColumns}
      horizontal={false}
    />
  )
}