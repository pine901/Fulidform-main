// import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
// import {COLOR, SIZE} from '../../../utils/Constants';

// // const {width, height} = Dimensions.get('window');

// /**
//  * MAKE THE STYLE FUNCTIONAL SO IT WILL ACCEPT DYNAMIC SIZE
//  * AS SCREEN SWITCH ORIENTATION, THIS ALLOWS COMPONENT SIZE
//  * CHANGE BASED ON THE ACTUAL SCREEN HEIGHT AND WIDTH
//  */
// const tStyles = ({width, height}) => {
//   return StyleSheet.create({
//     // LANDSCAPE AND PORTRAIT VERSION
//     screenWrapper_portrait: {
//       position: 'relative',
//       display: 'flex',
//       flexDirection: 'row',
//       flex: 1,
//     },
//     screenWrapper_landscape: {
//       position: 'relative',
//       display: 'flex',
//       flexDirection: 'row',
//       flex: 1,
//       alignItems: 'center',
//     },

//     mainContentWrapper: {
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       flex: 3,
//     },
//     headerBox: {
//       display: 'flex',
//       justifyContent: 'center',
//       flex: 1,
//     },
//     videoBox: {
//       width: '100%',
//       height: 200,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     recommendedChallengeWrapper: {
//       flex: 2,
//     },

//     // LANDSCAPE AND PORTRAIT VERSION
//     dashboard_section_wrapper_portrait: {
//       flex: 2,
//       paddingHorizontal: 25,
//       paddingVertical: 20,
//     },
//     dashboard_section_wrapper_landscape: {
//       flex: 2,
//       paddingHorizontal: 0,
//       paddingVertical: 20,
//       width: width * 0.75,
//     },

//     /// recommended challenge box
//     recommendedChallengeBox: {
//       backgroundColor: COLOR.WHITE,
//     },
//     recommendedChallengeBoxDesc: {
//       marginBottom: SIZE.APP_BODY_PADDING,
//     },
//     recommendedChallengeItemList: {},
//     recommendedChallengeItem: {
//       display: 'flex',
//       flexDirection: 'row',
//       marginBottom: SIZE.APP_BODY_PADDING * 0.5,
//     },
//     recommendedChallengeThumbBox: {
//       flex: 1,
//       alignItems: 'flex-start',
//       justifyContent: 'flex-start',
//       marginRight: SIZE.APP_BODY_PADDING / 2,
//       paddingTop: 6,
//     },
//     recommendedChallengeTextBox: {
//       flex: 1,
//     },

//     user_greeting_label: {fontWeight: '500', fontSize: 23, paddingVertical: 5},
//     dashboard_intro_msg: {fontSize: 18, marginTop: 5},

//     dashboard_weekly_workout_wrapper_landscape: {
//       flex: 2,
//       paddingHorizontal: 25,
//       flexDirection: 'row',
//       marginBottom: 20,
//       width: width * 0.75,
//     },
//     dashboard_weekly_workout_wrapper_portrait: {
//       flex: 2,
//       paddingHorizontal: 25,
//       flexDirection: 'row',
//       marginBottom: 20,
//       width,
//     },
//     dashboard_weekly_workout_count_wrapper: {
//       width: width * 0.2,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRightWidth: 2,
//       paddingRight: 20,
//     },
//     dashboard_weekly_workout_count_label: val => {
//       const DEFAULT_SIZE = 40;
//       const STRING_SIZE = val.length;

//       return {
//         fontSize:
//           STRING_SIZE < 3 ? DEFAULT_SIZE : ((width * 0.2) / STRING_SIZE) * 1.2,
//       };
//     },
//     dashboard_weekly_workout_below_countlabel: {
//       textAlign: 'center',
//       fontSize: 10,
//       width: width * 0.2,
//     },
//     weekly_message_wrapper: {
//       width: width * 0.675,
//       paddingLeft: 10,
//     },
//     dashboard_weekly_workout_message_portrait: {
//       fontSize: 16,
//       width: width * 0.675,
//     },
//     dashboard_weekly_workout_message_landscape: {
//       fontSize: 16,
//       width: width * 0.5,
//     },

//     // LANDSCAPE AND PORTRAIT VERSION
//     dashboard_photo_intro_portrait: {
//       width,
//       height: width * 0.695,
//       marginBottom: 20,
//     },
//     dashboard_photo_intro_landscape: {
//       width,
//       height: width * 0.5,
//       marginBottom: 20,
//     },

//     whats_new_wrapper: {
//       paddingHorizontal: 25,
//     },

//     purchase_challenge_wrapper_portrait: {
//       paddingHorizontal: 25,
//     },
//     purchase_challenge_wrapper_landscape: {
//       width: width * 0.75,
//     },

//     whatsNewItem: {
//       display: 'flex',
//       marginBottom: SIZE.APP_BODY_PADDING * 0.5,
//     },
//     whatsNewThumbBox: {
//       flex: 1,
//       alignItems: 'flex-start',
//       justifyContent: 'flex-start',
//       paddingTop: 6,
//     },
//     itemThumbnailBtn: {
//       backgroundColor: 'rgba(0,0,0,0.3)',
//       borderColor: COLOR.WHITE,
//       borderWidth: 1,
//       position: 'absolute',
//       zIndex: 9,
//       bottom: 5,
//       right: 5,
//     },
//     subscriptionBoxWrapper: {
//       alignItems: 'center',
//     },
//     subscriptionBody: {
//       paddingHorizontal: SIZE.APP_PADDING,
//     },
//     signature_wrapper: {
//       width: width * 0.75,
//     },

//     responsive_image_portrait: {
//       width: width * 0.8725,
//     },
//     responsive_image_landscape: {
//       width: width * 0.75,
//     },
//   });
// };

// export default tStyles;

import {Dimensions, PixelRatio, StyleSheet} from 'react-native';
import {COLOR, SIZE} from '../../../utils/Constants';

// const {width, height} = Dimensions.get('window');

/**
 * MAKE THE STYLE FUNCTIONAL SO IT WILL ACCEPT DYNAMIC SIZE
 * AS SCREEN SWITCH ORIENTATION, THIS ALLOWS COMPONENT SIZE
 * CHANGE BASED ON THE ACTUAL SCREEN HEIGHT AND WIDTH
 */
const mStyles = ({width, orientation}) => {
  return StyleSheet.create({
    // LANDSCAPE AND PORTRAIT VERSION
    screenWrapper_portrait: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    screenWrapper_landscape: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
    },

    mainContentWrapper: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      // width: width * 0.75,
      height: width * 0.75,
    },
    section_wrapper: {
      width,
      minHeight: width * 0.75,
      alignItems: 'center',
    },

    headerBox: {
      display: 'flex',
      width: '100%',
    },
    videoBox: {
      width: '100%',
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recommendedChallengeWrapper: {
      flex: 2,
    },

    // LANDSCAPE AND PORTRAIT VERSION
    dashboard_section_wrapper_portrait: {
      // flex: 2,
      paddingHorizontal: 25,
      paddingVertical: 20,
    },
    dashboard_section_wrapper_landscape: {
      // flex: 2,
      paddingHorizontal: 0,
      paddingVertical: 20,
      width: width * 0.75,
    },

    /// recommended challenge box
    recommendedChallengeBox: {
      backgroundColor: COLOR.WHITE,
    },
    recommendedChallengeBoxDesc: {
      marginBottom: SIZE.APP_BODY_PADDING,
    },
    recommendedChallengeItemList: {},
    recommendedChallengeItem: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: SIZE.APP_BODY_PADDING * 0.5,
    },
    recommendedChallengeThumbBox: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginRight: SIZE.APP_BODY_PADDING / 2,
      paddingTop: 6,
    },
    recommendedChallengeTextBox: {
      // flex: 1,
    },

    user_greeting_label: {
      fontWeight: '500',
      fontSize: 23,
      paddingVertical: 5,
      fontFamily: 'AlrightSans-Medium',
    },
    dashboard_intro_msg: {
      fontSize: 18,
      marginTop: 5,
      fontFamily: 'AlrightSans-Light',
    },

    dashboard_weekly_workout_wrapper_landscape: {
      // flex: 2,
      flexDirection: 'row',
      marginBottom: 20,
      width: width * 0.75,
    },
    dashboard_weekly_workout_wrapper_portrait: {
      // flex: 2,
      paddingHorizontal: 25,
      flexDirection: 'row',
      marginBottom: 20,
      width,
    },
    dashboard_weekly_workout_count_wrapper: {
      width: width * 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      borderRightWidth: 2,
      paddingRight: width * 0.2 * 0.25,
    },
    dashboard_weekly_workout_count_label: val => {
      const STRING_SIZE = val.length;

      return {
        fontSize: (width * 0.175) / STRING_SIZE,
        fontFamily: 'AlrightSans-Regular',
        color: '#000',
      };
    },
    dashboard_weekly_workout_below_countlabel: {
      textAlign: 'center',
      fontSize: 16,
      width: width * 0.2,
    },
    weekly_message_wrapper: {
      width: width * 0.675,
      paddingLeft: 10,
    },
    dashboard_weekly_workout_message_portrait: {
      fontSize: 24,
      width: width * 0.675,
    },
    dashboard_weekly_workout_message_landscape: {
      fontSize: 24,
      width: width * 0.5,
    },

    // LANDSCAPE AND PORTRAIT VERSION
    dashboard_photo_intro_portrait: {
      width,
      height: width * 0.695,
      marginBottom: 20,
    },
    dashboard_photo_intro_landscape: {
      width: width * 0.75,
      height: width * 0.75 * 0.7,
      marginBottom: 20,
    },

    whats_new_wrapper: {
      // paddingHorizontal:
      //   orientation === 'LANDSCAPE' ? width * 0.115 : width * 0.075,
      // flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      // marginBottom: 10,
      // width: width * 0.75,

      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      marginBottom: 10,
      width,
      minHeight: width * 0.75,
    },

    purchase_challenge_wrapper_portrait: {
      paddingHorizontal: 25,
    },
    purchase_challenge_wrapper_landscape: {
      width: width * 0.75,
    },

    whatsNewItem: {
      width: orientation === 'LANDSCAPE' ? width * 0.75 : width * 0.925,
      marginBottom: 15,
    },
    whatsNewThumbBox: {
      // flex: 1,
      // alignItems: 'flex-start',
      // justifyContent: 'flex-start',
      // paddingTop: 6,
    },
    itemThumbnailBtn: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderColor: COLOR.WHITE,
      borderWidth: 1,
      position: 'absolute',
      zIndex: 9,
      bottom: 5,
      right: 5,
    },
    subscriptionBoxWrapper: {
      alignItems: 'center',
    },
    subscriptionBody: {
      paddingHorizontal: SIZE.APP_PADDING,
    },
    signature_wrapper: {
      width: orientation === 'PORTRAIT' ? width * 0.925 : width * 0.75,
    },

    responsive_image_portrait: {
      width: width * 0.925,
    },
    responsive_image_landscape: {
      width: width * 0.75,
    },
    section_title_wrapper: {
      width: orientation === 'PORTRAIT' ? width * 0.925 : width * 0.75,
      paddingVertical: 10,
    },
    section_content_container: {
      width,
      alignItems: 'center',
      marginBottom: 10,
    },
  });
};

export default mStyles;
