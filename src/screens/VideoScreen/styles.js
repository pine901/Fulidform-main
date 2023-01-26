import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLOR, SIZE} from '../../utils/Constants';

const styles = StyleSheet.create({
  videoScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  videoBG: {
    backgroundColor: COLOR.BLACK,
    flex: 1,
    position: 'relative',
  },
});

export default styles;
