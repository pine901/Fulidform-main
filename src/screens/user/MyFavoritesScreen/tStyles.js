import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../../utils/Constants';


const tStyles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING / 2,
  },
  tabbar: {
    width: '100%',
    backgroundColor: '#ffffff',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0, // Just in case. 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { height: 0, width: 0 }, 
    shadowColor: 'transparent',
  },
  tab: {
    width: 'auto',
    backgroundColor: COLOR.WHITE,
    textAlign: 'center',
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
  },
  indicator:{
    backgroundColor: '#ffffff',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0, // Just in case. 
    shadowOffset: { height: 0, width: 0 }, 
    shadowColor: 'transparent',
  },
  
});

export default tStyles;