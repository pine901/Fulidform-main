import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE, VIDEO_SKELTON_HEIGHT } from '../../../utils/Constants';


const mStyles = StyleSheet.create({
  // item detail style
  headerBox:{
    marginBottom: 0,
    paddingBottom: 0,
  },
  itemDetailHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    borderTopWidth: 1,
    borderTopColor: COLOR.LIGHT_GRAY
  },
  itemDetailDescBox: {
    marginTop: SIZE.APP_BODY_PADDING / 2
  },
  itemDetailMainBox: {

  },
  itemDetailButtonBox: {
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    marginBottom: SIZE.APP_BODY_PADDING,
  },

  videoSkelton: {
    height: VIDEO_SKELTON_HEIGHT
  },

});

export default mStyles;