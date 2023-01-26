import React, { useEffect } from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import { View, Text, HStack, VStack, Pressable } from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { CommonStyles } from '../../utils/CommonStyles';
import { SIZE } from '../../utils/Constants';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { setDigitalCalendar } from '../../redux/config/actions';
import { joinMultiAssocArrayValue } from '../../utils/Misc';

export default MyDrawerDigitalCalendar = () => {
  const workoutGroup = useSelector(state => state.config.digitalCalendar.workoutGroup);
  const currentDayIndex = useSelector(state => state.config.digitalCalendar.currentDayIndex);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {

  }, []);

  const onUpdateCurrentDayIndex = (index) => {
    navigation.dispatch(DrawerActions.closeDrawer())

    if(index === currentDayIndex) {
      return false;
    }
    dispatch(setDigitalCalendar({
      currentDayIndex: index
    }));
  }

  const getWorkoutGroupItemDesc = (workoutGroupItem) => { 
    let desc = ""
    if (workoutGroupItem && workoutGroupItem['workouts'] && workoutGroupItem['workouts'].length > 0) {
      desc = joinMultiAssocArrayValue(workoutGroupItem['workouts'], "title", "\n");       
    }else{
      desc = workoutGroupItem['message']
    }    
    return desc
  }
 

  return (
    <View style={styles.dititalCalendarBox}>
      <VStack>
        {
          (workoutGroup && workoutGroup.length > 0) ? (
            workoutGroup.map((workoutGroupItem, index) => {
              return (
                <Pressable key={index} onPress={(e) => onUpdateCurrentDayIndex(index)} style={[styles.dititalCalendarRow, (index === currentDayIndex ? styles.dititalCalendarRowActive : "")]}>
                  {
                    (
                      <View>
                        <Text style={[styles.dititalCalendarDayTitle, (index === currentDayIndex ? styles.dititalCalendarDayTitleActive : "")]}>
                          {workoutGroupItem['title']}
                        </Text>
                        <Text style={[styles.dititalCalendarDayDesc, (index === currentDayIndex ? styles.dititalCalendarDayDescActive : "")]}>
                          {getWorkoutGroupItemDesc(workoutGroupItem)}
                        </Text>
                      </View>
                    )
                  }
                </Pressable>
              )
            })
          ) : (
            <></>
          )
        }
      </VStack>
    </View>
  )
}