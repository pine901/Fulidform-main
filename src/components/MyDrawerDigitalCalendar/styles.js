import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import { COLOR, SIZE } from "../../utils/Constants";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  dititalCalendarBox: {
    width: '100%'
  },
  dititalCalendarRow: {
    width: '100%', 
    paddingHorizontal: 32,
    paddingVertical: SIZE.APP_BODY_PADDING * 0.5,
    backgroundColor: COLOR.BLACK
  },
  dititalCalendarRowActive: {
    backgroundColor: COLOR.WHITE
  },
  dititalCalendarDayTitle: {
    color: COLOR.WHITE,
    textAlign:'right',
    fontWeight: 'bold',
    fontSize: 14,   
  },
  dititalCalendarDayTitleActive: {
    color: COLOR.FONT_DARK
  },
  dititalCalendarDayDesc: {
    color: "rgba(255,255,255,0.75)",
    textAlign:'right',
    fontSize: 12,   
  },
  dititalCalendarDayDescActive: {
    color: "rgba(0,0,0,0.75)"
  },


});

export default styles;

