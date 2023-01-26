import React from 'react';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {ROUTE_DRAWER_STACK_NAVIGATOR} from '../../routes/RouteNames';

const GoBackHandler = () => {
  const navigation = useNavigation();
  const navState = useNavigationState(state => state);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity
        style={{paddingRight: 10, paddingTop: 5, paddingBottom: 5}}
        activeOpacity={1}
        onPress={() => {
          // PERFORM BACK HANDLING IF THERE IS A SCREEN TO GO BACK
          // ELSE ROUTE THE USER TO DASHBOARD
          if (navState.routes.length < 2) {
            navigation.reset(ROUTE_DRAWER_STACK_NAVIGATOR);
          } else {
            navigation.pop();
          }
        }}>
        <Icon name="arrow-circle-left" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default GoBackHandler;
