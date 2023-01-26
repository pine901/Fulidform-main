import React, { useEffect, useState } from 'react';
import { View, useToast, Input, FormControl, HStack, VStack } from 'native-base';

import styles from './styles';
import CustomStyle from '../../../styles/CustomStyle';

import { useDispatch } from 'react-redux';
import MySelectBox from '../../../components/MySelectBox';
import { ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN } from '../../../routes/RouteNames';
import { apiGetRecipeTaxonomies, apiLoginRequired, apiResponseIsSuccess, } from '../../../utils/API';
import { signOut } from '../../../redux/auth/actions';
import { navReset } from '../../../utils/Nav';
import { isPadTablet } from '../../../utils/Misc';
import DynamicCollapsible from '../../../components/DynamicCollapsible';
import BaseStyle from '../../../styles/BaseStyle';
import DynamicView from '../../../components/DynamicView';

const iPadTablet = isPadTablet();

export default RecipeSearchBox = (props) => {
  const { navigation, checkApiIsLoading, startApiLoading, endApiLoading, onChangeSearchData } = props;
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    loadPageData()

  }, []);

  const defaultFilterOptionList = {
    meal_type: [],
    diet: [],
  }
  const [filterOptionList, setFilterOptionList] = useState(defaultFilterOptionList)

  const loadPageData = async () => {
    await loadFilterBoxData();
  }
  const loadFilterBoxData = async () => {
    const apiKey = "apiGetRecipeTaxonomies"
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const response = await apiGetRecipeTaxonomies()
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

  const defaultFormData = {
    search: "",
    meal_type: 0,
    diet: 0,
  }
  const [formData, setFormData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);

  const onChangeFormField = (field_name, field_value) => {
    const updatedData = { ...formData }
    updatedData[field_name] = field_value
    setFormData(updatedData)
    onChangeSearchData(updatedData)
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
                placeholder="Search e.g. Salad"
                returnKeyType="search"
                value={formData['search']}
                onChangeText={text => onChangeText("search", text)}
                onEndEditing={e => onEndEditingText("search", e)}
              />
            </FormControl>
          </>
        )
      }

      <DynamicView style={[ BaseStyle.col12]} tscroll={true}>
        <View style={CustomStyle.searchItemListWrapper}>
          {
            (iPadTablet) && (
              <View style={CustomStyle.searchItemWrapper}>
                <FormControl>
                  <Input type="text"
                    placeholder="Search e.g. Salad"
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
            <MySelectBox fontSize="xs" selectedValue={formData['meal_type']} placeholder="All Meal Types"
              items={[{ id: 0, name: "All Meal Types" }, ...filterOptionList['meal_type']]}
              onValueChange={itemValue => onChangeFormField("meal_type", itemValue)}
            />
          </View>
          <View style={CustomStyle.searchItemWrapper}>
            <MySelectBox fontSize="xs" selectedValue={formData['diet']} placeholder="All Diets"
              items={[{ id: 0, name: "All Diets" }, ...filterOptionList['diet']]}
              onValueChange={itemValue => onChangeFormField("diet", itemValue)}
            />
          </View>
        </View>
      </DynamicView>
    </View>
  )
}