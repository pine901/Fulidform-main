import { StyleSheet, Dimensions } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { COLOR } from "@utils/Constants";
const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
  signinScreen:{
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
  }  
});

export default styles;