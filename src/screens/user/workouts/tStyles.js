import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../../utils/Constants';


const tStyles = StyleSheet.create({
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
  itemDetailDescBox: {
    marginTop: SIZE.APP_BODY_PADDING / 2
  },
  itemFlatBoxList: {
    
  },
  itemSidebarBoxContent:{
    paddingHorizontal: 0,
    paddingVertical: 0,
  },


});

export default tStyles;