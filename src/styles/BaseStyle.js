import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { isIos } from "../utils/validations";
const { width, height } = Dimensions.get("window");

const BaseStyle = StyleSheet.create({
  flex: {
    flex: 1
  },
  h100p: {
    minHeight: height
  },
  col0: {
    width: 0
  },
  col1: {
    width: '8.3333%'
  },
  col2: {
    width: '16.6666%'
  },
  col3: {
    width: '25%'
  },
  col4: {
    width: '33.3333%'
  },
  col5: {
    width: '41.6666%'
  },
  col6: {
    width: '50%'
  },
  col7: {
    width: '58.3333%'
  },
  col8: {
    width: '66.6666%'
  },
  col9: {
    width: '75%'
  },
  col10: {
    width: '83.3333%'
  },
  col11: {
    width: '91.6666%'
  },
  col12: {
    width: '100%'
  },
  imgResponsive: {
    width: '100%'
  },
  vcenter:{
    justifyContent: "center"
  },
  screenContainer: {
    flex: 1,
  },
  formGroup:{
    marginBottom: 15
  },
  hidden: {
    display:'none'
  },

});

export default BaseStyle;