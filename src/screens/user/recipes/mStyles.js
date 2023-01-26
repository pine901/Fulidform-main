import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../../utils/Constants';


const mStyles = StyleSheet.create({
  // item detail style
  itemDetailHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingVertical: SIZE.APP_BODY_PADDING,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.LIGHT_GRAY
  },
  itemDetailBodyBox: {
    marginTop: SIZE.APP_BODY_PADDING,
  },
  itemDetailIngredientBox: {
    marginTop: SIZE.APP_BODY_PADDING,
  },
  itemDetailMethodBox: {
    marginTop: SIZE.APP_BODY_PADDING,
  },
  itemDetailDescBox: {
    marginTop: SIZE.APP_BODY_PADDING / 2
  },

  itemParamsBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemParam: {
    width: 'auto',
    paddingRight: SIZE.APP_BODY_PADDING / 2
  },


});

export default mStyles;