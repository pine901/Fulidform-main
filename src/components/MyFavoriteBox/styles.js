import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { COLOR, SIZE } from "../../utils/Constants";
const { width, height } = Dimensions.get("window");
 
const styles = StyleSheet.create({
  favoriteIcon: {
    width: SIZE.APP_ICON_SIZE,
    height: SIZE.APP_ICON_SIZE,
  },

});

export default styles;

 