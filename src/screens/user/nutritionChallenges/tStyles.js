import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, SIZE } from '../../../utils/Constants';


const tStyles = StyleSheet.create({
  // item detail style
  itemDetailThumbBox: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  itemDetailHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
  
  },
  itemDetailDescBox: {
    marginTop: SIZE.APP_BODY_PADDING / 2
  },
  favoriteIcon: {
    width: SIZE.APP_ICON_SIZE,
    height: SIZE.APP_ICON_SIZE,
  },
  linearGradientBox:{
    position: 'absolute',
    left: 0,
    right: 0,   
    bottom: 0,
    top: 0,
  },
  linearGradient: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: SIZE.APP_BODY_PADDING/2,
  },
  btnDownload:{
    minWidth: 220
  },
  challengeCalendarBox:{
    paddingVertical: SIZE.APP_BODY_PADDING*0.3,
    backgroundColor: COLOR.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLOR.LIGHT_GRAY
  },
  challengeCalendarBody:{
    // marginTop: -20,
    marginTop: (-1) * (SIZE.APP_BODY_PADDING/4 + 11),
    paddingBottom: SIZE.APP_BODY_PADDING,
  },
  challengeCalendarWeekRow:{
    marginBottom: SIZE.APP_BODY_PADDING/2,
  },
  calendarHeader:{
    display:'flex',
    flexDirection: 'row',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
  },
  calendarTitleBox:{
    paddingVertical: SIZE.APP_BODY_PADDING/4,
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    backgroundColor: COLOR.BG_GRAY
  },
  calendarBody:{
    display:'flex',
    flexDirection: 'row',
  },
  calendarBodyFixedColumn:{
    paddingLeft: SIZE.APP_BODY_PADDING/2,
    flex: 1,
    paddingVertical: SIZE.APP_BODY_PADDING/4,
  },
  calendarBodyScrollColumn:{
    flex: 4,
    display:'flex',
    flexDirection: 'row',
    paddingVertical: SIZE.APP_BODY_PADDING/4,
  },
  calendarColumn:{
    maxWidth: width * 0.45
  },
  calendarCell:{
    paddingVertical: SIZE.APP_BODY_PADDING/4,
    paddingHorizontal: SIZE.APP_BODY_PADDING/2,
    fontWeight: "bold",
    textTransform: 'uppercase',
    color: COLOR.FONT_GRAY,
    fontSize: 14
  },
  calendarDataCell:{
    paddingVertical: (SIZE.APP_BODY_PADDING/4),
    paddingHorizontal: SIZE.APP_BODY_PADDING/2,
    color: COLOR.FONT_GRAY,
    fontSize: 12
  },
  itemMainBox:{
    backgroundColor: COLOR.WHITE,
  },
  itemSidebarBoxContent:{
    paddingHorizontal: 0,
  },
  downloadBox:{
    backgroundColor: COLOR.WHITE,
  },


});

export default tStyles;