import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');
import {COLOR, SIZE} from '../../../utils/Constants';

const tStyles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING / 2,
  },
  headerTitle: {
    marginRight: 15,
  },
  tabbar: {
    backgroundColor: '#ffffff',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0, // Just in case.
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {height: 0, width: 0},
    shadowColor: 'transparent',
  },
  tab: {
    width: 'auto',
    backgroundColor: COLOR.WHITE,
    textAlign: 'left',
    paddingVertical: SIZE.APP_BODY_PADDING / 2,
    paddingLeft: SIZE.APP_BODY_PADDING,
    paddingRight: 0,
  },
  label: {
    fontWeight: 'bold',
    color: COLOR.FONT_WARNING,
  },

  itemListBox: {
    flex: 1,
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING / 2,
  },

  itemBoxContainer: {
    marginBottom: SIZE.APP_BODY_PADDING,
    flex: 1,
    marginHorizontal: SIZE.APP_BODY_PADDING / 2,
  },
  itemBox: {
    position: 'relative',
    marginBottom: SIZE.APP_BODY_PADDING / 2,
  },
  itemOverlayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tappable_overlay: {
    flex: 1,
    width: width * 0.8,
  },
  itemPlayIcon: {
    width: 70,
    height: 70,
  },
  itemDeleteBox: {
    position: 'absolute',
    right: SIZE.APP_BODY_PADDING / 2,
    top: SIZE.APP_BODY_PADDING / 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTrashIcon: {
    width: SIZE.APP_ICON_SIZE,
    height: SIZE.APP_ICON_SIZE,
  },
  itemDescBox: {},
  indicator: {
    backgroundColor: '#ffffff',
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    borderBottomWidth: 0, // Just in case.
    shadowOffset: {height: 0, width: 0},
    shadowColor: 'transparent',
  },
});

export default tStyles;
