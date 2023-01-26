import { isPadTablet } from "../../../utils/Misc";
import mAuthStyles from './mAuthStyles';
import tAuthStyles from './tAuthStyles';

const styles = (isPadTablet() ? tAuthStyles : mAuthStyles);

export default styles;