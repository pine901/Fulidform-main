import React, { useState } from 'react';
import { Image, } from 'react-native';
import { Pressable } from 'native-base';
import styles from './styles';
import { apiFavoriteObject, apiLoginRequired, apiResponseIsSuccess } from '../../utils/API';
import { signOut } from '../../redux/auth/actions';
import { useDispatch } from 'react-redux';
import { navReset } from '../../utils/Nav';
import { ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN } from '../../routes/RouteNames';
import { useNavigation } from '@react-navigation/native';
import { console_log } from '../../utils/Misc';
import { setFavorites } from '../../redux/config/actions';

const MyFavoriteBox = (props) => {
  const { item, itemType, checkApiIsLoading, startApiLoading, endApiLoading, itemFavorites=[] } = props; //itemType: string (workouts|bundles|recipes|nutrition_challenges),

  const favorite_icon = require("../../assets/images/workout/favorite_icon.png")
  const favorited_icon = require("../../assets/images/workout/favorited_icon.png")

  const navigation = useNavigation()
  const dispatch = useDispatch()
  ////////////////////////////////////////////////////////////////////////////////
  const [favorited, setFavorited] = useState(itemFavorites.indexOf(item['id']) > -1)
  const toggleFavorited = () => {
    console_log("favorited:::", favorited)
    doFavoriteObject()
  }
  const doFavoriteObject = async () => {
    const apiKey = "apiFavoriteObject-" + item['id']
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);
    const payload = {
      object_type: itemType,
      object_id: item['id']
    }
    console_log("farorite api payload:::", payload)
    const response = await apiFavoriteObject(payload)
    console_log("farorite api response:::", response)
    dispatch(setFavorites(response.data['favourites'])); 

    endApiLoading(apiKey)
    if (apiResponseIsSuccess(response)) {
      setFavorited(!favorited)
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
  ////////////////////////////////////////////////////////////////////////////////

  return (
    <Pressable onPress={(e) => toggleFavorited()} p="1">
      <Image resizeMode="contain" source={favorited ? favorited_icon : favorite_icon} style={styles.favoriteIcon} alt="icon" />
    </Pressable>
  )
}

export default MyFavoriteBox;