import React, { useState } from 'react';

import { CheckIcon, ChevronDownIcon, Select, View } from 'native-base';
import { console_log, empty } from '../../utils/Misc';
import styles from './styles';


const MySelectBox = (props) => {

  const { fontSize, selectedValue, placeholder, items, onValueChange, labelValueKey } = props;
  const [focused, setFocused] = useState(false)
  const onFocus = () => {
    console_log("onFocus")
    setFocused(true)
  }
  const onBlur = () => {
    console_log("onBlur")
    setFocused(false)
  }
  const onChange = (itemValue) => {
    onBlur()
    if(typeof onValueChange === "function") {
      onValueChange(itemValue)
    }
  }

  const itemKeyNames = {
    label: "name",
    value: "id"
  }
 
  if(labelValueKey === "label-value") {
    itemKeyNames['label'] = "label"
    itemKeyNames['value'] = "value"
  }else{
    itemKeyNames['label'] = "name"
    itemKeyNames['value'] = "id"
  }

  return (
    <Select borderColor={focused ? "primary.500" : null} fontSize={fontSize} selectedValue={selectedValue} accessibilityLabel={placeholder} placeholder={placeholder}
      _selectedItem={{
        bg: "gray.300", endIcon: <CheckIcon size="5" />
      }}
      dropdownIcon={<View style={{marginRight: 5}}><ChevronDownIcon size="4" /></View>}
      onOpen={() => onFocus()} onClose={() => onBlur()}
      onValueChange={itemValue => onChange(itemValue)} >
      {
        (items) && (items.length > 0) && (
          items.map((item, index) => {
            return (
              <Select.Item key={index} label={item[itemKeyNames['label']]} value={item[itemKeyNames['value']]} />
            )
          })
        )
      }
    </Select>
  )
}

export default MySelectBox;