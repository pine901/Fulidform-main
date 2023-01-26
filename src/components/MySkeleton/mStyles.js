import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
import { COLOR, IMAGE_RATIO_16X9, SIZE } from '../../utils/Constants';


const mStyles = StyleSheet.create({
    responsiveImage: {
        height: width * 0.4
    },
    itemListSkelton: {
        flex: 1,
        marginTop: SIZE.APP_BODY_PADDING / 3,
    },
    itemListSkelton3:{
        flex: 1,
        marginTop: 0,
    },
    itemListTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width / 5
    },
    itemList: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    itemSkeltonWrapper: {
        width: '100%',
        paddingVertical: SIZE.APP_BODY_PADDING / 2,
    },
    itemSkeltonWrapper3:{
        width: '100%',
        paddingVertical: SIZE.APP_BODY_PADDING/2,
    },
    itemThumb: {
        height: (width - 2 * SIZE.APP_BODY_PADDING) / 2,
    },

});

export default mStyles;