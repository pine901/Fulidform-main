import { StyleSheet } from 'react-native';
import { COLOR, SIZE } from '../../../utils/Constants';

const mStyles = StyleSheet.create({
  subscriptionBoxWrapper: {
    alignItems: 'center'
  },
  subscriptionBox: {
    width: '100%',
    maxWidth: 580,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLOR.BG_GRAY,
    borderRadius: 4,
    paddingHorizontal: SIZE.APP_PADDING,
    paddingVertical: SIZE.APP_PADDING,
  },
  subscriptionIcon: {
    width: 54,
    height: 54
  },
  subscriptionBody: {
    paddingHorizontal: SIZE.APP_PADDING
  },
  dashboardButton:{
    width: '100%',
    maxWidth: 124
  },
  subscriptionHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: SIZE.APP_BODY_PADDING,
    paddingTop: SIZE.APP_BODY_PADDING,
    paddingBottom: SIZE.APP_BODY_PADDING,
  },
  subscriptionTitle:{
    textAlign: 'left'
  },
  
  featuredChallengeItem: {
    display:'flex',
    flexDirection: 'row',
    marginBottom: SIZE.APP_BODY_PADDING * 0.5
  },
  featuredChallengeThumbBox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // marginRight: SIZE.APP_BODY_PADDING/2,
    paddingTop: 6,
  },
  itemThumbnailBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: COLOR.WHITE,
    borderWidth: 1,
    position: 'absolute',
    zIndex: 9,
    bottom: 50,
    right: 10
  },
});

export default mStyles;