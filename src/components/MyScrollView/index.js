import React, { } from 'react';
import { ScrollView, Text } from 'react-native';
import styles from './styles';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 1 // 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

// const MyScrollView = ({enableSomeButton}) => (
//   <ScrollView
//     onScroll={({nativeEvent}) => {
//       if (isCloseToBottom(nativeEvent)) {
//         enableSomeButton();
//       }
//     }}
//     scrollEventThrottle={400}
//   />
// );

const MyScrollView = (props) => {
  const { scrollEndCallback } = props;
  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          scrollEndCallback();
        }
      }}
      scrollEventThrottle={400}
    >
      {props.children}
    </ScrollView>
  )
}

export default MyScrollView;