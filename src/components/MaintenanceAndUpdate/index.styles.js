import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const useStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    logo: {
      width: width * 0.8,
    },
    message: {
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'AlrightSans-Light',
    },
    link: {
      fontSize: 16,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    update_btn: {
      backgroundColor: '#000',
      marginTop: 10,
      padding: 10,
      borderRadius: 5,
    },
    update_btn_label: {
      color: '#fff',
      fontFamily: 'AlrightSans-Light',
    },
  });
};

export default useStyles;
