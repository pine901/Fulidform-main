import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE, VIDEO_SKELTON_HEIGHT } from '../../utils/Constants';

const mStyles = StyleSheet.create({
  videoSkelton: {
    height: VIDEO_SKELTON_HEIGHT
  },
  dayWorkoutItem:{
    marginBottom: SIZE.APP_BODY_PADDING
  },
});

export default mStyles;