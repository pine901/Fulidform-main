import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../../utils/Constants';


const mStyles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING / 2,
  },
  tabbar: {
    backgroundColor: '#ffffff',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0 // Just in case. 
  },
  tab: {
    width: 'auto',
    backgroundColor: COLOR.WHITE,
    textAlign: 'left',
    paddingVertical: SIZE.APP_BODY_PADDING / 2,
    paddingLeft: SIZE.APP_BODY_PADDING,
    paddingRight: 0,
  },
  label: {
    fontWeight: 'bold',
    color: COLOR.FONT_WARNING,
  },
  itemListBox: {
    flex: 1,
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING/2,
  }
  
});

export default mStyles;