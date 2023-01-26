import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../utils/Constants';


const styles = StyleSheet.create({
  modalHeader:{
    borderBottomWidth: 0, 
    borderTopWidth: 0, 
    paddingTop: SIZE.APP_BODY_PADDING/2
  },
  modalFooterBox:{
    width: "100%", 
    display:"flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 
    paddingVertical: SIZE.APP_BODY_PADDING/3,
    marginBottom: SIZE.APP_BODY_PADDING/2,
  },
  modalFooterButton:{
    width: 'auto',
    maxWidth: '100%'
  },

});

export default styles;