import React, { useEffect } from 'react';
import { View, ScrollView, Text, useToast } from 'native-base';


import styles from './styles';

import { CommonStyles } from '../../../utils/CommonStyles';
import { useDispatch } from 'react-redux';
import { empty, get_data_value } from '../../../utils/Misc';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { COLOR } from '../../../utils/Constants';
import { TouchableOpacity } from 'react-native-gesture-handler';


const WeekDayList = {
  "1": "MONDAY",
  "2": "TUESDAY",
  "3": "WEDNESDAY",
  "4": "THURSDAY",
  "5": "FRIDAY",
  "6": "SATURDAY",
  "7": "SUNDAY",
}

export default MealCalendar = (props) => {
  const { calendarData, OnPressRecipeItem } = props;
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {

  }, []);

  return (
    <View style={[styles.challengeCalendarBox]}>
      <View style={[CommonStyles.appBox]}>
        <Text fontSize="lg" mb={5}>
          <Ionicon name="calendar-outline" color={COLOR.BLACK} size={18} /> MEAL CALENDAR
        </Text>
      </View>

      <View style={CommonStyles.hr}></View>

      <View style={styles.challengeCalendarBody}>
        {
          (calendarData && calendarData.length > 0) ? (
            calendarData.map((calendarRowData, index) => {
              return (
                <View key={index} style={styles.challengeCalendarWeekRow}>
                  <View style={styles.calendarHeader}>
                    <View style={styles.calendarTitleBox}>
                      <Text fontSize="sm">WEEK{index + 1}</Text>
                    </View>
                  </View>
                  <View style={styles.calendarBody}>
                    <View style={styles.calendarBodyFixedColumn}>
                      <Text fontSize="sm" fontWeight="bold" color={COLOR.FONT_GRAY} style={styles.calendarCell}>&nbsp;</Text>
                      <Text fontSize="sm" fontWeight="bold" color={COLOR.FONT_GRAY} style={styles.calendarCell}>BREAKFAST</Text>
                      <Text fontSize="sm" fontWeight="bold" color={COLOR.FONT_GRAY} style={styles.calendarCell}>LUNCH</Text>
                      <Text fontSize="sm" fontWeight="bold" color={COLOR.FONT_GRAY} style={styles.calendarCell}>DINNER</Text>
                      <Text fontSize="sm" fontWeight="bold" color={COLOR.FONT_GRAY} style={styles.calendarCell}>SNACK</Text>
                    </View>
                    <View style={styles.calendarBodyScrollColumn}>
                      <ScrollView horizontal={true}>
                        {
                          (calendarRowData && !empty(calendarRowData)) ? (
                            Object.keys(calendarRowData).map((weekDayNumber, i) => {
                              return (
                                <View key={`week-row-${i}`} style={styles.calendarColumn}>
                                  <Text textAlign="center" style={styles.calendarCell}>{WeekDayList[weekDayNumber]}</Text>
                                  <TouchableOpacity onPress={(e) => OnPressRecipeItem(get_data_value(calendarRowData[weekDayNumber]['breakfast'], "id"))}>
                                    <Text textAlign="center" ellipsizeMode="tail" numberOfLines={1} style={styles.calendarDataCell}>{get_data_value(calendarRowData[weekDayNumber]['breakfast'], "title")}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={(e) => OnPressRecipeItem(get_data_value(calendarRowData[weekDayNumber]['lunch'], "id"))}>
                                    <Text textAlign="center" ellipsizeMode="tail" numberOfLines={1} style={styles.calendarDataCell}>{get_data_value(calendarRowData[weekDayNumber]['lunch'], "title")}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={(e) => OnPressRecipeItem(get_data_value(calendarRowData[weekDayNumber]['dinner'], "id"))}>
                                    <Text textAlign="center" ellipsizeMode="tail" numberOfLines={1} style={styles.calendarDataCell}>{get_data_value(calendarRowData[weekDayNumber]['dinner'], "title")}</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity onPress={(e) => OnPressRecipeItem(get_data_value(calendarRowData[weekDayNumber]['snack'], "id"))}>
                                    <Text textAlign="center" ellipsizeMode="tail" numberOfLines={1} style={styles.calendarDataCell}>{get_data_value(calendarRowData[weekDayNumber]['snack'], "title")}</Text>
                                  </TouchableOpacity>
                                </View>
                              )
                            })
                          ) : (
                            <></>
                          )
                        }

                      </ScrollView>
                    </View>
                  </View>
                </View>
              )
            })
          ) : (
            <></>
          )
        }
      </View>
    </View>
  )
}