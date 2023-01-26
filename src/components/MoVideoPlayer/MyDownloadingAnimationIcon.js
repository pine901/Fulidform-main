import React, { useEffect, useRef, useState } from 'react';

import { console_log } from '../../utils/Misc';
import { View, ImageBackground, Image, Animated } from 'react-native';
import { DOWNLOAD_STATUS } from '../../utils/Constants';
import { Easing } from 'react-native';

const MyDownloadingAnimationIcon = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  const springValue = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  const fadeInAndOut = Animated.sequence([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }),
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }),
  ]);

  const spinValue = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        fadeInAndOut,
        Animated.timing(springValue, {
          toValue: 1,
          friction: 3,
          tension: 40,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true
        }
      )
    ).start();

  }, []) //fadeAnim, springValue

  return (
    <>
      <View>
        <Animated.Image                 // Special animatable View
          source={require('./images/downloading-arrow.png')}
          style={{
            width: 17, height: 17,
            opacity: fadeAnim,         // Bind opacity to animated value
            //transform: [{ rotate: spin }]
          }}
        />
        <Animated.Image                 // Special animatable View
          source={require('./images/downloading-circle.png')}
          style={{
            width: 17, height: 17, marginTop: -17,
            //opacity: fadeAnim,         // Bind opacity to animated value
            transform: [{ rotate: spin }]
          }}
        />
      </View>
    </>
  )
}

export default MyDownloadingAnimationIcon;