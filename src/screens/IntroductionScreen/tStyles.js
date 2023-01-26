import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {COLOR} from '@utils/Constants';

const tStyles = ({width, height}) => {
  return StyleSheet.create({
    introScreen: {
      position: 'relative',
      flex: 1,
    },
    sliderContainer: {
      position: 'relative',
      flex: 1,
    },
    startBox: {
      position: 'absolute',
      width: '100%',
      flex: 1,
      top: 0,
      //  left: 0,
      right: 0,
      bottom: 0,
      width: width * 0.5,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    slide: {
      flex: 1,
      resizeMode: 'cover',
    },
    dotStyle: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    activeDotStyle: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      width: 30,
    },
    slideLogoWhite: {
      width: 150,
    },
    text: {
      textAlign: 'center',
    },
    slideDescWrapper: {
      paddingTop: 24,
    },
    slideDescContent: {},
    startWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // width: '100%'
    },
    startContent: {
      width: 180,
    },
  });
};

export default tStyles;
