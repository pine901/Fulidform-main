import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { COLOR, SIZE } from "../../utils/Constants";
const { width, height } = Dimensions.get("window");
 
const styles = StyleSheet.create({
  dititalCalendarBox: {
    marginBottom: SIZE.APP_BODY_PADDING
  },

});

export default styles;

 