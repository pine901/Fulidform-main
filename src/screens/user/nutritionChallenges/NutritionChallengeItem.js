import React, { } from 'react';
import { View, Text } from 'native-base';

import styles from './styles';

import MyThumbnailBox from '../../../components/MyThumbnailBox';
import CustomStyle from '../../../styles/CustomStyle';

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; //It could be something else not has to be id.
}

const NutritionChallengeItem = (props) => {
  const { item, vewItemDetail } = props;
  return (
    <>
      {
        (item['empty_object']) ? (
          <View style={CustomStyle.itemBox}></View>
        ) : (
          <View style={CustomStyle.itemBox}>
            <MyThumbnailBox item={item} itemType="nutrition_challenge" onClickItem={() => {
               vewItemDetail(item['id'])
            }} />
            <View style={CustomStyle.itemTextBox}>
              <View style={CustomStyle.itemTitleDateBox}>
                <View style={CustomStyle.itemTitleBox}>
                  <Text fontSize="sm" style={CustomStyle.itemTitle}>{item['title']}</Text>
                </View>
              </View>
            </View>
          </View>
        )
      }
    </>
  )
}

export default React.memo(NutritionChallengeItem, arePropsEqual); //Export with memo of course :) 

