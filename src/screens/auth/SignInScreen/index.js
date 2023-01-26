import React, {useRef, useState} from 'react';
import {StatusBar, Keyboard} from 'react-native';
import {
  Text,
  View,
  Box,
  Button,
  FormControl,
  Input,
  WarningOutlineIcon,
  ScrollView,
  Pressable,
  useToast,
} from 'native-base';
import {Indicator} from '../../../components/Indicator';

import {useDispatch} from 'react-redux';
import {signIn} from '../../../redux/auth/actions';

import {CommonStyles} from '../../../utils/CommonStyles';
import BaseStyle from '../../../styles/BaseStyle';
import AuthHeaderSection from '../inc/AuthHeaderSection';
import AuthStyles from '../inc/AuthStyles';
import {console_log, isEmpty, validateEmail} from '../../../utils/Misc';
import {useFocusEffect} from '@react-navigation/native';
import {
  ROUTE_DASHBOARD_TAB,
  ROUTE_DRAWER_STACK_NAVIGATOR,
  ROUTE_FORGOT_PASSWORD,
  ROUTE_DASHBOARD,
  ROUTE_USER_TAB_NAVIGATOR,
  ROUTE_SUBSCRIPTIONS,
} from '../../../routes/RouteNames';
import {logIn} from '../../../utils/API';
import {navReset} from '../../../utils/Nav';
import {setFirstLogin} from '../../../redux/config/actions';
import {setAppAuthStatusBarStyle} from '../../../utils/Utils';
import CustomStyle from '../../../styles/CustomStyle';
import {TextInput} from 'react-native';

const SignInScreen = props => {
  const {navigation} = props;

  const dispatch = useDispatch();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setAppAuthStatusBarStyle(StatusBar);
      setLoading(false);
    }, []),
  );

  ///////////////////////////////////////////////////////////////////////
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const defaultFormData = {
    email: '',
    password: '',
  };
  const requiredFieldList = ['email', 'password'];
  const [formData, setFormData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);

  const onChangeFormFIeld = (field_name, field_value) => {
    //console_log("field_name, field_value", field_name, field_value)
    const updatedData = {...formData};
    updatedData[field_name] = field_value;
    //console_log("updatedData:::", updatedData)
    validateFields(updatedData, field_name);
    setFormData(updatedData);
  };
  const validateFields = (updatedData = null, field_name = null) => {
    if (updatedData === null) {
      updatedData = {...formData};
    }
    var errorList = [...errorField];
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
    return errorList;
  };
  const notifyErrorField = errorList => {
    if (errorList.includes('email')) {
      emailInput.current.focus();
    } else if (errorList.includes('password')) {
      passwordInput.current.focus();
    }
    return true;
  };
  const handleSubmit = async () => {
    const errorList = validateFields();
    if (errorList.length > 0) {
      notifyErrorField(errorList);
      return false;
    } else {
      if (!validateEmail(formData['email'])) {
        toast.show({
          description: 'Invalid email format!',
        });
        emailInput.current.focus();
        return false;
      }

      Keyboard.dismiss();
      setLoading(true);

      const payload = {
        username: formData['email'],
        password: formData['password'],
      };
      const response = await logIn(payload);
      //console_log("api response:::", response)
      const {success, message, data, statusCode, code} = response;
      if (!success) {
        toast.show({
          description: message,
        });
        setLoading(false);
        return false;
      } else {
        //console_log("auth data:::", data);
        dispatch(signIn(data));

        setLoading(false);

        dispatch(setFirstLogin(true));
        navigation.replace(ROUTE_DRAWER_STACK_NAVIGATOR);
      }
    }
  };

  return (
    <View style={AuthStyles.bg_color}>
      <ScrollView flex={1}>
        <View style={AuthStyles.authScreen}>
          <AuthHeaderSection />
          <View
            style={[
              AuthStyles.authScreenPadding,
              AuthStyles.authScreenContentWrapper,
            ]}>
            <View style={[AuthStyles.authScreenContent]}>
              <Text
                bold
                fontSize="xl"
                mb="4"
                fontFamily="body"
                fontWeight="300">
                LOGIN
              </Text>
              <Box>
                <FormControl
                  style={BaseStyle.formGroup}
                  isRequired={
                    requiredFieldList.includes('email') ? true : false
                  }
                  isInvalid={errorField.includes('email') ? true : false}>
                  {/* <FormControl.Label>Email Address</FormControl.Label> */}
                  <Text fontSize="sm" fontFamily="body" fontWeight="400">
                    Email Address
                  </Text>
                  <Input
                    type="text"
                    placeholder=""
                    ref={emailInput}
                    value={formData['email']}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    onSubmitEditing={() => passwordInput.current.focus()}
                    onChangeText={text => onChangeFormFIeld('email', text)}
                    style={[CustomStyle.inputBgWhite, CustomStyle.inputMd]}
                  />

                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Email is required
                  </FormControl.ErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <FormControl
                  style={BaseStyle.formGroup}
                  isRequired={
                    requiredFieldList.includes('password') ? true : false
                  }
                  isInvalid={errorField.includes('password') ? true : false}>
                  {/* <FormControl.Label>Password</FormControl.Label> */}
                  <Text fontSize="sm" fontFamily="body" fontWeight="400">
                    Password
                  </Text>
                  <Input
                    type="password"
                    placeholder=""
                    ref={passwordInput}
                    value={formData['password']}
                    returnKeyType="go"
                    onSubmitEditing={() => handleSubmit()}
                    onChangeText={text => onChangeFormFIeld('password', text)}
                    style={[CustomStyle.inputBgWhite, CustomStyle.inputMd]}
                  />
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}>
                    Password is required
                  </FormControl.ErrorMessage>
                </FormControl>
              </Box>
              <Box>
                <View mt="5" style={BaseStyle.formGroup}>
                  <Button
                    size="md"
                    colorScheme="gray"
                    bg="black"
                    fontFamily="body"
                    fontWeight="300"
                    onPress={e => handleSubmit()}>
                    LOGIN
                  </Button>
                </View>
              </Box>
              <Box>
                <View style={BaseStyle.formGroup}>
                  <Pressable
                    onPress={() => navigation.push(ROUTE_FORGOT_PASSWORD)}>
                    <Text
                      textAlign="center"
                      style={CommonStyles.textWarning}
                      fontFamily="body"
                      fontWeight="300">
                      Forgot your password?
                    </Text>
                  </Pressable>
                </View>
              </Box>
            </View>
          </View>
        </View>
        {loading && <Indicator />}
      </ScrollView>
    </View>
  );
};

export default SignInScreen;
