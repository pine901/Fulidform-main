import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');
import {COLOR, SIZE} from '../../utils/Constants';

const styles = ({IMAGE_RATIO_16X9}) => {
  return StyleSheet.create({
    itemThumbnailBox: {
      marginBottom: SIZE.APP_BODY_PADDING / 4,
    },
    itemThumbnailOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.02)',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingRight: SIZE.APP_BODY_PADDING / 2,
      paddingBottom: SIZE.APP_BODY_PADDING / 2,
    },
    itemThumbnailBtn: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderColor: COLOR.WHITE,
      borderWidth: 1,
    },
    tabletPosition: {
      position: 'absolute',
      right: 5,
      bottom: 5,
    },
  });
};

export default styles;
