import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, Image, StatusBar, Keyboard } from 'react-native';
import { Text, View, Box, Center, Button, VStack, HStack, KeyboardAvoidingView, FormControl, Input, WarningOutlineIcon, ScrollView, Heading, Pressable, useToast } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { SimpleAnimation } from 'react-native-simple-animations';
import { Indicator } from '../../../components/Indicator';

import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import BaseStyle from '../../../styles/BaseStyle';
import AuthHeaderSection from '../inc/AuthHeaderSection';
import AuthStyles from '../inc/AuthStyles';
import { console_log, isEmpty, showNotification } from '../../../utils/Misc';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTE_UPDATE_PASSWORD } from '../../../routes/RouteNames';
import { setAppAuthStatusBarStyle } from '../../../utils/Utils';
import CustomStyle from '../../../styles/CustomStyle';

const ResetPasswordScreen = (props) => {
  const { navigation, route } = props;
  const { email } = route.params;

  console_log("email::::", email)

  const dispatch = useDispatch();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setAppAuthStatusBarStyle(StatusBar)
      setLoading(false);
    }, [])
  );

  ///////////////////////////////////////////////////////////////////////
  const codeInput = useRef(null);

  const defaultFormData = {
    code: ""
  }
  const requiredFieldList = ["code"]
  const [formData, setFormData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);

  const onChangeFormFIeld = (field_name, field_value) => {
    console_log("field_name, field_value", field_name, field_value)
    const updatedData = { ...formData }
    updatedData[field_name] = field_value
    console_log("updatedData:::", updatedData)
    validateFields(updatedData, field_name)
    setFormData(updatedData)
  }
  const validateFields = (updatedData = null, field_name = null) => {
    if (updatedData === null) {
      updatedData = { ...formData }
    }
    var errorList = [...errorField]
    if (field_name !== null) {
      if (requiredFieldList.includes(field_name)) {
        errorList = isEmpty(updatedData, field_name, errorList);
      }
    } else {
      for (let i = 0; i < requiredFieldList.length; i++) {
        errorList = isEmpty(updatedData, requiredFieldList[i], errorList);
      }
    }
    setErrorField([...errorList]);
    return errorList
  }
  const notifyErrorField = (errorList) => {
    if (errorList.includes("code")) {
      codeInput.current.focus()
    }
    return true;
  }
  const handleSubmit = () => {
    console_log("submitLogin formData:::", formData)
    const errorList = validateFields()
    if (errorList.length > 0) {
      notifyErrorField(errorList)
      return false;
    } else {
      Keyboard.dismiss();
      navigation.push(ROUTE_UPDATE_PASSWORD, { email: email, code: formData['code'] })     
    }
  }

  return (
    <ScrollView flex={1}>
      <View style={AuthStyles.authScreen}>
        <AuthHeaderSection />
        <View style={[AuthStyles.authScreenPadding, AuthStyles.authScreenContentWrapper]}>
          <View style={[AuthStyles.authScreenContent]}>
            <Text bold fontSize="xl" mb="4">FORGOT PASSWORD</Text>
            <Text fontSize="sm" mb="4">We've sent the code to your email. Please enter the code below.</Text>
            <Box>
              <FormControl style={BaseStyle.formGroup} isRequired={requiredFieldList.includes("code") ? true : false} isInvalid={errorField.includes("code") ? true : false}>
                <FormControl.Label>Code</FormControl.Label>
                <Input type="text"
                  placeholder=""
                  ref={codeInput}
                  value={formData['code']}
                  returnKeyType="go"
                  onSubmitEditing={() => handleSubmit()}
                  onChangeText={text => onChangeFormFIeld("code", text)}
                  style={[CustomStyle.inputBgWhite, CustomStyle.inputMd]}
                />
                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                  Code is required
                </FormControl.ErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <View mt="5" style={BaseStyle.formGroup}>
                <Button size="md" colorScheme="gray" bg="black" onPress={(e) => handleSubmit()}>RESET PASSWORD</Button>
              </View>
            </Box>
          </View>
        </View>
      </View>
      {loading && <Indicator />}
    </ScrollView>
  )
}

export default ResetPasswordScreen;

