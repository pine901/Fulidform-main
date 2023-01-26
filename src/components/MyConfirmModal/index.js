import { View, Text, AlertDialog, Button } from 'native-base';
import * as React from 'react';

import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import { CommonStyles } from '../../utils/CommonStyles';
import { empty } from '../../utils/Misc';

import styles from './styles';



const MyConfirmModal = (props) => {
  const { isOpen, setIsOpen, title, desc, okBtnText, cancelBtnText, okBtnCallback, cancelBtnCallback } = props;

  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);

  return (
    <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header style={styles.modalHeader}></AlertDialog.Header>
        <AlertDialog.Body>
          <Text fontSize="sm" textAlign="center">
            {title}
          </Text>
          {
            (!empty(desc)) && (
              <Text mt="3" textAlign="center" fontSize="xs" style={CommonStyles.textLightGray}>
                {desc}
              </Text>
            )
          }
        </AlertDialog.Body>
        <View style={styles.modalFooterBox}>
          <Button style={[styles.modalFooterButton, CommonStyles.appDefaultButton]} size="sm" px="6" colorScheme="gray" bg="black" onPress={okBtnCallback}>
            {okBtnText}
          </Button>
          {
            (!empty(cancelBtnText)) && (!empty(cancelBtnCallback)) && (
              <Button style={styles.modalFooterButton} mt="2" size="sm" px="6" variant="unstyled" colorScheme="coolGray" onPress={cancelBtnCallback} ref={cancelRef}>
                {cancelBtnText}
              </Button>
            )
          }
        </View>
      </AlertDialog.Content>
    </AlertDialog>
  )
}

export default MyConfirmModal;