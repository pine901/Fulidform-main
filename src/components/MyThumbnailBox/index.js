import React from 'react';

import {Button, View} from 'native-base';
import useStyle from './styles';
import MyResponsiveImage from '../MyResponsiveImage';
import {IMAGE_RATIO_16X9} from '../../utils/Constants';
import {isPadTablet} from '../../utils/Misc';

const MyThumbnailBox = props => {
  const {item, itemType, onClickItem} = props;
  const styles = useStyle({IMAGE_RATIO_16X9});
  const iPadTablet = isPadTablet();

  const BUTTON_TEXT_LIST = {
    workout: 'VIEW WORKOUT',
    challenge: 'VIEW CHALLENGE',
    recipe: 'VIEW RECIPE',
    nutrition_challenge: 'VIEW MEAL PLAN',
  };

  const getThumbnailImage = () => {
    if (itemType === 'recipe') {
      return item['feature_image'];
    } else if (itemType === 'nutrition_challenge') {
      return item['feature_image'];
    } else {
      return item['thumbnail'];
    }
  };

  return (
    <View style={styles.itemThumbnailBox}>
      <MyResponsiveImage
        source={{uri: getThumbnailImage()}}
        ratio={IMAGE_RATIO_16X9}
        resizeMode="cover"
      />
      <View
        style={
          iPadTablet ? styles.tabletPosition : styles.itemThumbnailOverlay
        }>
        <Button
          size="xs"
          colorScheme="gray"
          style={[styles.itemThumbnailBtn]}
          onPress={e => onClickItem()}>
          {BUTTON_TEXT_LIST[itemType]}
        </Button>
      </View>
    </View>
  );
};

export default MyThumbnailBox;
