import { StyleSheet, Dimensions } from "react-native";
import { COLOR } from "@utils/Constants";
import { SIZE } from "../utils/Constants";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  drawerHeaderLeft: {
    marginLeft: SIZE.APP_PADDING,
  },
  drawerHeaderRight: {
    marginRight: SIZE.APP_PADDING,
  },
  drawerHeaderLogo: {
    width: 150, 
    height: 30
  },
  drawerHeaderToggleIcon: {
    width: 24, 
    height: 24
  },
  drawerHeaderRight: {
    marginRight: SIZE.APP_PADDING,
  }
});

export default styles;