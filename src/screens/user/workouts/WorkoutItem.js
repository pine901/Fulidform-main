import React from 'react';
import {View, Text} from 'native-base';

import styles from './styles';

import {joinMultiAssocArrayValue} from '../../../utils/Misc';
import MyThumbnailBox from '../../../components/MyThumbnailBox';
import CustomStyle from '../../../styles/CustomStyle';

const arePropsEqual = (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; //It could be something else not has to be id.
};

const WorkoutItem = props => {
  const {item, vewItemDetail} = props;
  return (
    <>
      {item['empty_object'] ? (
        <View style={CustomStyle.itemBox}></View>
      ) : (
        <View style={CustomStyle.itemBox}>
          <MyThumbnailBox
            item={item}
            itemType="workout"
            onClickItem={() => vewItemDetail(item['id'])}
          />
          <View style={CustomStyle.itemTextBox}>
            <View style={CustomStyle.itemTitleDateBox}>
              <View style={CustomStyle.itemTitleBox}>
                <Text fontSize="sm" style={CustomStyle.itemTitle}>
                  {item['title']}
                </Text>
              </View>
              <View style={CustomStyle.itemDateBox}>
                <Text fontSize="xs" style={CustomStyle.itemDate}>
                  {item['duration_display']}
                </Text>
              </View>
            </View>
            {item['equipment'] && item['equipment'].length > 0 && (
              <View style={CustomStyle.itemDescBox}>
                <Text fontSize="xs" style={CustomStyle.itemDesc}>
                  {joinMultiAssocArrayValue(item['equipment'])}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export default React.memo(WorkoutItem, arePropsEqual); //Export with memo of course :)
