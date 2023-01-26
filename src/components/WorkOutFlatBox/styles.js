import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../utils/Constants';


const styles = StyleSheet.create({
  workOutFlatBox: {
    marginBottom: SIZE.APP_BODY_PADDING 
  },
  workOutFlatBoxTitle: {
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    marginBottom: SIZE.APP_BODY_PADDING / 4
  },

  workOutItemFlatBox: {
    width: 300,
    marginVertical: SIZE.APP_BODY_PADDING / 4,
    marginHorizontal: SIZE.APP_BODY_PADDING / 4,
  },
  workOutItemFlatBoxFirst: {
    marginLeft: SIZE.APP_BODY_PADDING,
  },
  workOutItemFlatBoxLast: {
    marginRight: SIZE.APP_BODY_PADDING,
  },
  workOutItemFlatThumbnailBox: {
    marginBottom: SIZE.APP_BODY_PADDING / 8,
  },
  workOutItemFlatThumbnail: {
    width: '100%',
    paddingTop: '56.25%',
  },
  workOutItemFlatThumbnailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.01)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: SIZE.APP_BODY_PADDING / 2,
    paddingBottom: SIZE.APP_BODY_PADDING / 2,
  },
  workOutItemFlatThumbnailBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: COLOR.WHITE,
    borderWidth: 1,
  },
  workOutItemFlatTextBox: {
    paddingTop: SIZE.APP_BODY_PADDING / 4,
  },
  workOutItemFlatTitleBox: {
    flex: 1,
  },
  workOutItemFlatDateBox: {

  },
  workOutItemFlatTitle: {
    color: COLOR.DARK,
    textAlign: 'left'
  },
  workOutItemFlatDate: {
    color: COLOR.FONT_LIGHT_GRAY,
    textAlign: 'left'
  },
  workOutItemFlatDescBox: {
    width: '100%',
  },
  workOutItemFlatDesc: {
    color: COLOR.FONT_LIGHT_GRAY,
    textAlign: 'left'
  },
});

export default styles;