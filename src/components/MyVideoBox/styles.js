import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { COLOR, SIZE } from "../../utils/Constants";
const { width, height } = Dimensions.get("window");
 
const styles = StyleSheet.create({
  videoBox: {
    // flex: 1,
    width: '100%',
    paddingTop: '56.25%',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  
  videoThumbnail: {
    width: '100%',
    paddingTop: '56.25%',
  },
  videoThumbnailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor:'rgba(0,0,0,0.2)',
    
  },


});

export default styles;

 