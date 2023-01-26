import { StyleSheet } from 'react-native';
import { COLOR } from '../../utils/Constants';
import { isRoundedDevice } from '../../utils/Utils';

const tStyles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: COLOR.LIGHT_GRAY,
    borderTopWidth: 1,
    backgroundColor: COLOR.APP
  },
  tabItem: {
    width: '25%',
    maxWidth: 120,
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: isRoundedDevice() ? 30 : 14,
  },
  selected: {
    backgroundColor: 'rgba(255,255,255,0)',
  },
  tabItemOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  tabItemText: {
    marginTop: 2,
    fontSize: 11,
    color: COLOR.DARK,
    letterSpacing: -0.4
  },
  tabIconImage: {
    width: 24,
    height: 24
  },
});

export default tStyles;