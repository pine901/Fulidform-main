import React, {useEffect, useRef, useState} from 'react';
import {ImageBackground, Image, StatusBar, Keyboard} from 'react-native';
import {
  Text,
  View,
  Box,
  Center,
  Button,
  VStack,
  HStack,
  KeyboardAvoidingView,
  FormControl,
  Input,
  WarningOutlineIcon,
  ScrollView,
  Heading,
  Pressable,
  useToast,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {SimpleAnimation} from 'react-native-simple-animations';
import {Indicator} from '../../../components/Indicator';

import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';
import BaseStyle from '../../../styles/BaseStyle';
import AuthHeaderSection from '../inc/AuthHeaderSection';
import AuthStyles from '../inc/AuthStyles';
import {
  console_log,
  isEmpty,
  showNotification,
  validateEmail,
} from '../../../utils/Misc';
import {useFocusEffect} from '@react-navigation/native';
import {
  ROUTE_RESET_PASSWORD,
  ROUTE_UPDATE_PASSWORD,
} from '../../../routes/RouteNames';
import {setAppAuthStatusBarStyle} from '../../../utils/Utils';
import {apiForgotPassword} from '../../../utils/API';
import {navNavigate} from '../../../utils/Nav';
import CustomStyle from '../../../styles/CustomStyle';

const ForgotScreen = props => {
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

  const defaultFormData = {
    email: '',
  };
  const requiredFieldList = ['email'];
  const [formData, setFormData] = useState(defaultFormData);
  const [errorField, setErrorField] = useState([]);

  const onChangeFormFIeld = (field_name, field_value) => {
    console_log('field_name, field_value', field_name, field_value);
    const updatedData = {...formData};
    updatedData[field_name] = field_value;
    console_log('updatedData:::', updatedData);
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
    }
    return true;
  };
  const handleSubmit = async () => {
    console_log('submitLogin formData:::', formData);
    const errorList = validateFields();
    if (errorList.length > 0) {
      notifyErrorField(errorList);
      return false;
    } else {
      //Keyboard.dismiss();
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
        email: formData['email'],
      };
      const response = await apiForgotPassword(payload);
      console_log('api response:::', response);
      const {success, message, data, statusCode, code} = response;
      if (data.status !== 200) {
        toast.show({
          description: message,
        });
        setLoading(false);
        return false;
      } else {
        toast.show({
          description: message,
        });
        setLoading(false);
        //navNavigate([ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_USER_TAB_NAVIGATOR, ROUTE_DASHBOARD_TAB, ROUTE_SUBSCRIPTIONS], {}, navigation)
        navigation.push(ROUTE_RESET_PASSWORD, {email: formData['email']});
      }
    }
  };

  return (
    <ScrollView flex={1}>
      <View style={AuthStyles.authScreen}>
        <AuthHeaderSection />
        <View
          style={[
            AuthStyles.authScreenPadding,
            AuthStyles.authScreenContentWrapper,
          ]}>
          <View style={[AuthStyles.authScreenContent]}>
            <Text fontSize="xl" mb="4" fontFamily="body" fontWeight="400">
              FORGOT PASSWORD
            </Text>
            <Text fontSize="sm" mb="4" fontFamily="body" fontWeight="300">
              Please enter your email address. You will receive a code via
              email.
            </Text>
            <Box>
              <FormControl
                style={BaseStyle.formGroup}
                isRequired={requiredFieldList.includes('email') ? true : false}
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
                  returnKeyType="go"
                  keyboardType="email-address"
                  autoCorrect={false}
                  onSubmitEditing={() => handleSubmit()}
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
              <View mt="5" style={BaseStyle.formGroup}>
                <Button
                  size="md"
                  colorScheme="gray"
                  bg="black"
                  onPress={e => handleSubmit()}>
                  RESET PASSWORD
                </Button>
              </View>
            </Box>
          </View>
        </View>
      </View>
      {loading && <Indicator />}
    </ScrollView>
  );
};

export default ForgotScreen;
