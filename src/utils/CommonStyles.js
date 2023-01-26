import { StyleSheet } from "react-native";
import { COLOR, SIZE } from "./Constants";

export const CommonStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  justifyBetween: {
    justifyContent: 'space-between'
  },
  alignCenter: {
    alignItems: 'center'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  colEnd: {
    alignItems: 'flex-end'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING/2,
  },
  headerTitle: {
    fontSize: 18,
    color: COLOR.FONT_DARK,
    fontWeight: '600',
    fontFamily: 'Proxima'
  },
  body: {
    paddingLeft: SIZE.APP_BODY_PADDING,
    paddingRight: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLOR.APP,
    paddingTop: 44
  },
  navTitle: {
    marginLeft: 16,
    fontSize: 18,
    color: 'white',
  },
  textLightDark: {
    color: COLOR.FONT_LIGHT_DARK
  },
  textLightGray: {
    color: COLOR.FONT_LIGHT_GRAY
  },
  textGray: {
    color: COLOR.FONT_GRAY
  },
  textWarning: {
    color: COLOR.FONT_WARNING
  },
  textWhite: {
    color: COLOR.WHITE
  },
  appDefaultButton: {
    backgroundColor: COLOR.BLACK
  },
  appWhiteButton: {
    backgroundColor: COLOR.WHITE
  },
  appAutoWidthButton: {
    width: 'auto',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
  },
  appBox: {
    paddingVertical: SIZE.APP_BODY_PADDING,
    paddingHorizontal: SIZE.APP_BODY_PADDING,
  },
  appBox1: {
    paddingVertical: SIZE.APP_BODY_PADDING * 0.7,
    paddingHorizontal: SIZE.APP_BODY_PADDING,
  },
  bgWhite: {
    backgroundColor: COLOR.WHITE
  },
  bgLightGray: {
    backgroundColor: COLOR.BG_GRAY,
  },
  hr:{
    width: '100%',
    height: 1,
    backgroundColor: COLOR.LIGHT_GRAY,
  },

});