import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../utils/Constants';


const tStyles = StyleSheet.create({
  flatItemList: {
    flex: 1
  }, 
  flatHeader:{
    marginVertical: SIZE.APP_BODY_PADDING
  },
});

export default tStyles;