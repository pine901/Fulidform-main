import {isPadTablet} from '../../../utils/Misc';
import mStyles from './mStyles';
import tStyles from './tStyles';

// const styles = isPadTablet() ? tStyles : mStyles;
const styles = isPadTablet() ? tStyles : mStyles;

export default styles;
