import React, { useEffect } from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import { View, Text, HStack, Skeleton } from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { CommonStyles } from '../../utils/CommonStyles';
import { SIZE } from '../../utils/Constants';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setDigitalCalendar } from '../../redux/config/actions';

export default MyDigitalCalendar = (props) => {
  const workoutGroup = useSelector(state => state.config.digitalCalendar.workoutGroup);
  const currentDayIndex = useSelector(state => state.config.digitalCalendar.currentDayIndex);
  const dispatch = useDispatch();
  useEffect(() => {
    onUpdateCurrentDayIndex(0)
  }, []);

  const onUpdateCurrentDayIndex = (index) => {
    dispatch(setDigitalCalendar({
      currentDayIndex: index
    }));
  }

  const getCalendarDate = (state = "current") => { //current, previous, next
    let selectedItem = {}
    let selectedIndex = 0
    if (state === "current") {
      selectedIndex = currentDayIndex
      if (workoutGroup[selectedIndex]) {
        selectedItem = workoutGroup[selectedIndex]
      }
    }
    else if (state === "previous") {
      selectedIndex = currentDayIndex - 1
      if (selectedIndex >= 0 && workoutGroup[selectedIndex]) {
        selectedItem = workoutGroup[selectedIndex]
      }
    }
    else if (state === "next") {
      selectedIndex = currentDayIndex + 1
      if (selectedIndex < workoutGroup.length && workoutGroup[selectedIndex]) {
        selectedItem = workoutGroup[selectedIndex]
      }
    }
    return selectedItem['title']
  }

  const setCalenadrDate = (state = "") => {
    let selectedIndex = 0
    if (state === "previous") {
      selectedIndex = currentDayIndex - 1
      if (selectedIndex < 0) {
        return false
      }
    }
    else if (state === "next") {
      selectedIndex = currentDayIndex + 1
      if (selectedIndex >= workoutGroup.length) {
        return false
      }
    }
    onUpdateCurrentDayIndex(selectedIndex)
  }

  return (
    <View style={styles.dititalCalendarBox}>
      {
        (workoutGroup && workoutGroup.length > 0) ? (
          <HStack>
            <View flex={1}>
              {
                (getCalendarDate('previous')) && (
                  <TouchableOpacity onPress={(e) => setCalenadrDate('previous')}>
                    <Text fontSize="sm" textAlign="left" style={CommonStyles.textLightGray}><Ionicon name="chevron-back-outline" /> {getCalendarDate('previous')}</Text>
                  </TouchableOpacity>
                )
              }
            </View>
            <View flex={1}>
              <Text fontSize="lg" textAlign="center">{getCalendarDate('current')}</Text>
            </View>
            <View flex={1}>
              {
                (getCalendarDate('next')) && (
                  <TouchableOpacity onPress={(e) => setCalenadrDate('next')}>
                    <Text fontSize="sm" textAlign="right" style={CommonStyles.textLightGray}>{getCalendarDate('next')} <Ionicon name="chevron-forward-outline" /></Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </HStack>
        ) : (
          <HStack>
            <View flex={1} justifyContent="center" alignItems="flex-start">
              <Skeleton h="4" w="12" rounded="full" />
            </View>
            <View flex={1} justifyContent="center" alignItems="center">
              <Skeleton h="4" w="12" rounded="full" />
            </View>
            <View flex={1} justifyContent="center" alignItems="flex-end">
              <Skeleton h="4" w="12" rounded="full" />
            </View>
          </HStack>
        )
      }

    </View>
  )
}