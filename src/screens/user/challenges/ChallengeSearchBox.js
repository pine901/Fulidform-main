import React, { useEffect, useState } from 'react';
import { View, Button, useToast, Input, FormControl, HStack, VStack } from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import CustomStyle from '../../../styles/CustomStyle';

import { CommonStyles } from '../../../utils/CommonStyles';
import { useDispatch } from 'react-redux';
import { COLOR } from '../../../utils/Constants';
import MySelectBox from '../../../components/MySelectBox';
import { ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN } from '../../../routes/RouteNames';
import { apiGetChallengeTaxonomies, apiLoginRequired, apiResponseIsSuccess, } from '../../../utils/API';
import { signOut } from '../../../redux/auth/actions';
import { navReset } from '../../../utils/Nav';
import { isPadTablet } from '../../../utils/Misc';
import DynamicCollapsible from '../../../components/DynamicCollapsible';
import BaseStyle from '../../../styles/BaseStyle';
import DynamicView from '../../../components/DynamicView';

const iPadTablet = isPadTablet();


export default ChallengeSearchBox = (props) => {
  const { navigation, checkApiIsLoading, startApiLoading, endApiLoading, onChangeSearchData, isCollapsed, setIsCollapsed } = props;
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    loadPageData()

  }, []);

  const defaultFilterOptionList = {
    workout_type: [],
    body_part: [],
    equipment: [],
    activity: [],
    span: [],
    experience: [],
  }
  const [filterOptionList, setFilterOptionList] = useState(defaultFilterOptionList)

  const loadPageData = async () => {
    await loadFilterBoxData();
  }
  const loadFilterBoxData = async () => {
    const apiKey = "apiGetChallengeTaxonomies"
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const response = await apiGetChallengeTaxonomies()
    //console_log("filter api response:::", response)
    endApiLoading(apiKey)
    if (apiResponseIsSuccess(response)) {
      initFilterBox(response.data)
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation)
      } else {
        toast.show({
          description: response.message
        });
      }
    }
  }
  const initFilterBox = (taxonomyData) => {
    setFilterOptionList(taxonomyData)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }
  const defaultFormData = {
    search: "",
    workout_type: 0,
    body_part: 0,
    equipment: 0,
    activity: 0,
    span: 0,
    experience: 0,
  }
  const [formData, setFormData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);

  const onChangeFormField = (field_name, field_value) => {
    const updatedData = { ...formData }
    updatedData[field_name] = field_value
    setFormData(updatedData)
    onChangeSearchData(updatedData)
    setIsCollapsed(true) //
  }

  const onChangeText = (field_name, field_value) => {
    const updatedData = { ...formData }
    updatedData[field_name] = field_value
    setFormData(updatedData)
  }
  const onEndEditingText = (field_name, e) => {
    const field_value = e.nativeEvent.text
    const updatedData = { ...formData }
    updatedData[field_name] = field_value
    setFormData(updatedData)
    onChangeSearchData(updatedData)
  }

  return (
    <View style={CustomStyle.searchBox}>
      {
        (!iPadTablet) && (
          <>
            <FormControl>
              <Input type="text"
                placeholder="Search e.g. Mini Arms"
                returnKeyType="search"
                value={formData['search']}
                onChangeText={text => onChangeText("search", text)}
                onEndEditing={e => onEndEditingText("search", e)}
              />
            </FormControl>
            <View style={CustomStyle.filterBtnBox}>
              <Button size="xs" colorScheme="gray" bg="black" endIcon={<Ionicon name="chevron-down-outline" color={COLOR.WHITE} />} style={CommonStyles.appDefaultButton} onPress={(e) => toggleCollapse()}>
                {isCollapsed ? "SHOW FILTERS" : "HIDE FILTERS"}
              </Button>
            </View>
          </>
        )
      }

      <DynamicCollapsible collapsed={isCollapsed} align="center" mcollapse={true} style={[BaseStyle.flex, BaseStyle.col12]} >
        <DynamicView style={[BaseStyle.flex, BaseStyle.col12]} tscroll={true}>
          <View style={CustomStyle.searchItemListWrapper}>
            {
              (iPadTablet) && (
                <View style={CustomStyle.searchItemWrapper}>
                  <FormControl>
                    <Input type="text"
                      placeholder="Search e.g. Mini Arms"
                      returnKeyType="search"
                      value={formData['search']}
                      onChangeText={text => onChangeText("search", text)}
                      onEndEditing={e => onEndEditingText("search", e)}
                    />
                  </FormControl>
                </View>
              )
            }

            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['workout_type']} placeholder="All Workout Types"
                items={[{ id: 0, name: "All Workout Types" }, ...filterOptionList['workout_type']]}
                onValueChange={itemValue => onChangeFormField("workout_type", itemValue)}
              />
            </View>
            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['body_part']} placeholder="All Body Parts"
                items={[{ id: 0, name: "All Body Parts" }, ...filterOptionList['body_part']]}
                onValueChange={itemValue => onChangeFormField("body_part", itemValue)}
              />
            </View>
            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['equipment']} placeholder="All Equipments"
                items={[{ id: 0, name: "All Equipments" }, ...filterOptionList['equipment']]}
                onValueChange={itemValue => onChangeFormField("equipment", itemValue)}
              />
            </View>
            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['activity']} placeholder="All Activities"
                items={[{ id: 0, name: "All Activities" }, ...filterOptionList['activity']]}
                onValueChange={itemValue => onChangeFormField("activity", itemValue)}
              />
            </View>
            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['span']} placeholder="All Durations"
                items={[{ id: 0, name: "All Durations" }, ...filterOptionList['span']]}
                onValueChange={itemValue => onChangeFormField("span", itemValue)}
              />
            </View>
            <View style={CustomStyle.searchItemWrapper}>
              <MySelectBox fontSize="xs" selectedValue={formData['experience']} placeholder="All Levels"
                items={[{ id: 0, name: "All Levels" }, ...filterOptionList['experience']]}
                onValueChange={itemValue => onChangeFormField("experience", itemValue)}
              />
            </View>
          </View>
        </DynamicView>
      </DynamicCollapsible>
    </View>
  )
}