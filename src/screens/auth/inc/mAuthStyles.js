import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLOR, SIZE} from '../../../utils/Constants';
const {width, height} = Dimensions.get('window');

const mAuthStyles = StyleSheet.create({
  authScreen: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: COLOR.BG_GRAY,
  },
  login_bg: {
    flex: 1,
    minHeight: height * 0.45,
  },
  authScreenBgWrapper: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    flex: 1,
    alignItems: 'center',
  },
  authScreenBgContent: {
    flex: 1,
    width: '100%',
    marginTop: 40,
  },
  authScreenPadding: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  },
  authScreenContentWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLOR.BG_GRAY,
  },
  authScreenContent: {},
  bg_color: {
    flex: 1,
    backgroundColor: COLOR.BG_GRAY,
  },
});

export default mAuthStyles;
