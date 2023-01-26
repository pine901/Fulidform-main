import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLOR, SIZE} from '../../../utils/Constants';
const {width, height} = Dimensions.get('window');

const tAuthStyles = StyleSheet.create({
  authScreen: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    height: height,
  },
  login_bg: {
    flex: 2,
    height: height,
  },
  authScreenBgWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  authScreenBgContent: {
    flex: 1,
    width: 300,
    marginTop: 60,
  },
  authScreenPadding: {
    paddingTop: 80,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBottom: 80,
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

export default tAuthStyles;
