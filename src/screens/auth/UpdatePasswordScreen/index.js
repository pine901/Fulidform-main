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
import { setAppAuthStatusBarStyle } from '../../../utils/Utils';
import { apiUpdatePassword } from '../../../utils/API';
import { ROUTE_SIGNIN } from '../../../routes/RouteNames';
import CustomStyle from '../../../styles/CustomStyle';

const UpdatePasswordScreen = (props) => {
  const { navigation, route } = props;
  const { email, code } = route.params;

  console_log("email, code:::", email, code)

  const dispatch = useDispatch();
 
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  useFocusEffect(
    React.useCallback(() => {    
      setAppAuthStatusBarStyle(StatusBar)
      setLoading(false);
      setPasswordUpdated(false)
    }, [])
  );

  ///////////////////////////////////////////////////////////////////////
  const passwordInput = useRef(null);
  const passwordCInput = useRef(null);

  const defaultFormData = {
    password: "",
    passwordC: "",
  }
  const requiredFieldList = ["password", "passwordC"]
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
    if (errorList.includes("password")) {
      passwordInput.current.focus()
    } else if (errorList.includes("passwordC")) {
      passwordCInput.current.focus()
    }
    return true;
  }
  const handleSubmit = async () => {
    console_log("submitLogin formData:::", formData)
    const errorList = validateFields()
    if (errorList.length > 0) {
      notifyErrorField(errorList)
      return false;
    } else {
      Keyboard.dismiss();
      if (formData['password'] !== formData['passwordC']) {
        toast.show({
          description: "Password does not match"
        })
        return false;
      }

      setLoading(true)

      const payload = {
        email: email,
        code: code,
        password: formData['password'],
      };
      const response = await apiUpdatePassword(payload);
      console_log("api response:::", response)
      const { success, message, data, statusCode } = response;
      if (data.status !== 200) {
        toast.show({
          description: message
        });
        setLoading(false)
        return false;
      } else {
        toast.show({
          description: message
        });
        setLoading(false)
        setPasswordUpdated(true)
        gotoLoginPage()
      }
    }
  }

  const gotoLoginPage = ()=>{
    setTimeout(function(){
      navigation.push(ROUTE_SIGNIN)
    }, 700)
  }

  return (
    <ScrollView flex={1}>
     <View style={AuthStyles.authScreen}>
        <AuthHeaderSection />
        <View style={[AuthStyles.authScreenPadding, AuthStyles.authScreenContentWrapper]}>
          {
            (!passwordUpdated) && (
              <View style={[AuthStyles.authScreenContent]}>
                <Text bold fontSize="xl" mb="4">UPDATE PASSWORD</Text>
                <Text fontSize="sm" mb="4">Please enter your new password.</Text>
                <Box>
                  <FormControl style={BaseStyle.formGroup} isRequired={requiredFieldList.includes("password") ? true : false} isInvalid={errorField.includes("password") ? true : false}>
                    <FormControl.Label>New password</FormControl.Label>
                    <Input type="password"
                      placeholder=""
                      ref={passwordInput}
                      value={formData['password']}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordCInput.current.focus()}
                      onChangeText={text => onChangeFormFIeld("password", text)}
                      style={[CustomStyle.inputBgWhite, CustomStyle.inputMd]}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Password is required
                    </FormControl.ErrorMessage>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl style={BaseStyle.formGroup} isRequired={requiredFieldList.includes("passwordC") ? true : false} isInvalid={errorField.includes("passwordC") ? true : false}>
                    <FormControl.Label>Re-enter password</FormControl.Label>
                    <Input type="password"
                      placeholder=""
                      ref={passwordCInput}
                      value={formData['passwordC']}
                      returnKeyType="go"
                      onSubmitEditing={() => handleSubmit()}
                      onChangeText={text => onChangeFormFIeld("passwordC", text)}
                      style={[CustomStyle.inputBgWhite, CustomStyle.inputMd]}
                    />
                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                      Password is required
                    </FormControl.ErrorMessage>
                  </FormControl>
                </Box>
                <Box>
                  <View mt="5" style={BaseStyle.formGroup}>
                    <Button size="md" colorScheme="gray" bg="black" onPress={(e) => handleSubmit()}>RESET PASSWORD</Button>
                  </View>
                </Box>
              </View>
            )
          }
          {
            (passwordUpdated) && (
              <View style={[AuthStyles.authScreenContent]}>
                <Text bold fontSize="xl" mb="4">You have successfully updated your password</Text>
                <Text fontSize="sm" mb="4">Redirecting you to login page...</Text>                 
              </View>
            )
          }
        </View>
      </View>
      {loading && <Indicator />}
    </ScrollView>
  )
}

export default UpdatePasswordScreen;

