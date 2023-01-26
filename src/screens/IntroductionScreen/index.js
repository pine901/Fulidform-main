import React, {useEffect, useRef} from 'react';
import {ImageBackground, Image, StatusBar, Platform} from 'react-native';
import {
  Text,
  View,
  TouchableOpacity,
  Box,
  Center,
  Container,
  Button,
  VStack,
  HStack,
} from 'native-base';

import AppIntroSlider from 'react-native-app-intro-slider';
import ResponsiveImageView from 'react-native-responsive-image-view';
import {useSelector} from 'react-redux';
import BaseStyle from '../../styles/BaseStyle';
import useStyles from './styles';
import logoWhite from '../../assets/images/logo_text_white.png';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
} from '../../routes/RouteNames';
import {useFocusEffect} from '@react-navigation/native';
import {console_log, get_utc_timestamp_ms} from '../../utils/Misc';
import {isPadTablet} from '../../utils/Misc';
import {useState} from 'react';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

const iPadTablet = isPadTablet();
const data = [
  {
    key: 1,
    title: 'WORKOUTS',
    text: 'Find the best workouts for you\n based on your daily needs.',
    image: iPadTablet
      ? require('../../assets/images/carousel/ipt-1.png')
      : require('../../assets/images/carousel/1.png'),
    bg: '#59b2ab',
  },
  {
    key: 2,
    title: 'CHALLENGES',
    text: 'Choose a challeng based on your\n individual goals and desired length.',
    image: iPadTablet
      ? require('../../assets/images/carousel/ipt-2.png')
      : require('../../assets/images/carousel/2.png'),
    bg: '#febe29',
  },
  {
    key: 3,
    title: 'RECIPES',
    text: 'Choose the recipes that seem\n right for you.',
    image: iPadTablet
      ? require('../../assets/images/carousel/ipt-3.png')
      : require('../../assets/images/carousel/3.png'),
    bg: '#febe29',
  },
];

const IntroductionScreen = props => {
  const {navigation} = props;
  const appOrientation = useSelector(state => state.orientation.appOrientation);
  const styles = useStyles(appOrientation);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('rgba(255,255,255,0)');
        StatusBar.setTranslucent(true);
      }
    }, []),
  );

  const sliderRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideTimestamp, setSlideTimestamp] = useState(0);

  const onSlideChange = (index, lastIndex) => {
    console_log('index, lastIndex:::', index, lastIndex);
    setCurrentSlideIndex(index);
    setSlideTimestamp(get_utc_timestamp_ms());
  };

  const gotoLoginPage = () => {
    console_log('gotoLoginPage::::');
    navigation.replace(ROUTE_SIGNIN);
  };

  const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeLeft = gestureState => {
    //console_log("gestureState left:::", currentSlideIndex)
    if (currentSlideIndex < data.length - 1) {
      const newIndex = currentSlideIndex + 1;
      sliderRef.current.goToSlide(newIndex);
      setCurrentSlideIndex(newIndex);
      setSlideTimestamp(get_utc_timestamp_ms());
    }
  };

  const onSwipeRight = gestureState => {
    //console_log("gestureState right:::", currentSlideIndex)
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      sliderRef.current.goToSlide(newIndex);
      setCurrentSlideIndex(newIndex);
      setSlideTimestamp(get_utc_timestamp_ms());
    }
  };

  const _renderItem = slideItem => {
    const item = slideItem.item;
    return (
      <ImageBackground
        style={[styles.slide, BaseStyle.h100p]}
        source={item.image}></ImageBackground>
    );
  };

  const _keyExtractor = item => {
    return item.text;
  };

  return (
    <View style={styles.introScreen}>
      <View style={styles.sliderContainer}>
        <AppIntroSlider
          ref={sliderRef}
          keyExtractor={_keyExtractor}
          renderItem={_renderItem}
          data={data}
          showNextButton={false}
          showDoneButton={false}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          onSlideChange={onSlideChange}
        />
      </View>

      <GestureRecognizer
        onSwipeLeft={gestureState => onSwipeLeft(gestureState)}
        onSwipeRight={gestureState => onSwipeRight(gestureState)}
        config={gestureConfig}
        style={styles.startBox}>
        <View style={styles.slideDescWrapper}>
          <View style={styles.slideDescContent}>
            {data.map((item, index) => {
              if (index === currentSlideIndex) {
                return (
                  <View key={index}>
                    <Text
                      fontSize="4xl"
                      textAlign="center"
                      color="white"
                      fontFamily="body"
                      fontWeight="300">
                      {item.title}
                    </Text>
                    <Text
                      fontSize="sm"
                      textAlign="center"
                      color="white"
                      fontFamily="body"
                      fontWeight="300">
                      {item.text}
                    </Text>
                  </View>
                );
              }
            })}
          </View>
        </View>

        <View style={styles.startWrapper}>
          <View style={styles.startContent}>
            <View>
              <ResponsiveImageView aspectRatio={711 / 136} source={logoWhite}>
                {({getViewProps, getImageProps}) => (
                  <View {...getViewProps()}>
                    <Image {...getImageProps()} alt="logo" />
                  </View>
                )}
              </ResponsiveImageView>
            </View>
            <View p="2" mt="2">
              <Button
                colorScheme="gray"
                bg="black"
                borderRadius="0"
                fontFamily="body"
                fontWeight="300"
                onPress={e => gotoLoginPage()}>
                GET STARTED
              </Button>
            </View>
          </View>
        </View>
      </GestureRecognizer>
    </View>
  );
};

export default IntroductionScreen;
