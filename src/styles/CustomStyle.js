import { isPadTablet } from "../utils/Misc";
import MCustomStyle from './MCustomStyle';
import TCustomStyle from './TCustomStyle';

const CustomStyle = (isPadTablet() ? TCustomStyle : MCustomStyle);

export default CustomStyle;
