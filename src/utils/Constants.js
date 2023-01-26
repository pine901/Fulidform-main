import moment from 'moment';
import {Dimensions} from 'react-native';
import {isPadTablet} from './Misc';

const {width, height} = Dimensions.get('window');

const iPadTablet = isPadTablet();

export const Config = {
  SERVER_API_URL: 'https://www.fluidformpilates.com/wp-json',
  SERVER_SOCKET_URL: 'http://localhost:8088',
  TERMS_AND_CONDITION_URL: 'https://www.fluidformpilates.com/terms/',
  PRIVACY_POLICY_URL: 'https://www.fluidformpilates.com/terms/',
};

export const COLOR = {
  APP: '#ffffff',
  WHITE: '#ffffff',
  BLACK: '#000000',
  DARK: '#000000',
  FONT_DARK: '#000000',
  FONT_LIGHT_DARK: 'rgba(0, 0, 0, 0.5)',
  FONT_GRAY: 'rgba(64, 64, 64, 1)', // "#404040",
  FONT_LIGHT_GRAY: 'rgba(64, 64, 64, 0.5)', // "#404040" 50% opacity,
  FONT_WARNING: '#E8BFA7',
  LIGHT_BLUE: '#00adf5',
  LIGHT_GRAY: 'rgba(0,0,0,0.2)',
  BG_GRAY: '#f1f1f1',
  APP_DARK: '#232438',
  TRANSPARENT: 'transparent',
};

export const SIZE = {
  APP_PADDING: iPadTablet ? 30 : 15,
  APP_BODY_PADDING: iPadTablet ? 50 : 25,
  APP_ICON_SIZE: iPadTablet ? 30 : 22,
};

export const VIDEO_SKELTON_HEIGHT = iPadTablet
  ? width * (3 / 5) * 0.5
  : width * 0.5;

export const IMAGE_RATIO_16X9 = 0.5625; //FOR 16:9

export const ITEM_TYPE = {
  WORKOUT: 'workouts',
  CHALLENGE: 'challenges',
  RECIPE: 'recipes',
  NUTRITION_CHALLENGE: 'nutrition_challenges',
  PROGRAM: 'programs',
};
export const DOWNLOAD_STATUS = {
  NONE: 0,
  DOWNLOADING: 1,
  DOWNLOADED: 2,
};
