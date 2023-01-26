import { Dimensions, PixelRatio, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        justifyContent: 'center', //center
        alignItems: 'center',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 9999
    }
});

export default styles;