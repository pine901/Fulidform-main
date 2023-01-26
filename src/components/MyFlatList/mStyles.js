import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../utils/Constants';


const mStyles = StyleSheet.create({
  flatItemList: {
    flex: 1
  }, 
  flatHeader:{
    paddingTop: SIZE.APP_BODY_PADDING/2,
  },
});

export default mStyles;