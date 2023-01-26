import React from 'react';
import {View, Text, useToast} from 'native-base';

import styles from './styles';

import {console_log, joinMultiAssocArrayValue} from '../../../utils/Misc';
import MyThumbnailBox from '../../../components/MyThumbnailBox';
import MyResponsiveImage from '../../../components/MyResponsiveImage';
import {IMAGE_RATIO_16X9} from '../../../utils/Constants';
import {Image, TouchableOpacity} from 'react-native';
import {navNavigate} from '../../../utils/Nav';
import {
  ROUTE_VIDEO_SCREEN,
  ROUTE_CHALLENGE_DETAIL,
  ROUTE_CHALLENGES_TAB,
  ROUTE_WORKOUT_DETAIL,
  ROUTE_WORKOUTS_TAB,
} from '../../../routes/RouteNames';
import * as RNFS from 'react-native-fs';

const VideoItem = props => {
  const {item, navigation, deleteVideo} = props;
  const toast = useToast();

  const onClickPlayVideo = async itemType => {
    const file_exists = await checkFileExist(item['filePath']);
    if (file_exists) {
      //let routeArr = [ROUTE_VIDEO_SCREEN]
      //navNavigate(routeArr, {}, navigation)
      const playSetting = {
        autoPlay: true,
      };
      // navigation.navigate(ROUTE_VIDEO_SCREEN, {
      //   item: item,
      //   playSetting: playSetting,
      // });

      let mainRoute = ROUTE_CHALLENGES_TAB;
      let subRoute = ROUTE_CHALLENGE_DETAIL;

      if (itemType === 'workouts') {
        mainRoute = ROUTE_WORKOUTS_TAB;
        subRoute = ROUTE_WORKOUT_DETAIL;
      }

      // MAIN ROUTE
      navigation.navigate(mainRoute);
      // SUBROUTE
      setTimeout(() => {
        navigation.navigate(subRoute, {
          itemId: item['itemDetail'].id,
        });
      }, 200);
    } else {
      toast.show({
        description: 'VIDEO DOES NOT EXIST',
      });
    }
  };
  const onClickDeleteVideo = () => {
    deleteVideo(item);
  };

  const checkFileExist = async filepath => {
    let fileExist = new Promise((resolve, reject) => {
      RNFS.exists(filepath)
        .then(result => {
          console_log('file exists: ', result);
          resolve(result);
        })
        .catch(err => {
          console_log(err.message);
          reject(false);
        });
    });
    return await fileExist;
  };

  return (
    <>
      {item['empty_object'] ? (
        <View style={styles.itemBoxContainer}></View>
      ) : (
        <View style={styles.itemBoxContainer}>
          <View style={styles.itemBox}>
            <MyResponsiveImage
              source={{uri: item['poster']}}
              ratio={IMAGE_RATIO_16X9}
              resizeMode="cover"
            />
            <View style={styles.itemOverlayer}>
              <TouchableOpacity
                style={styles.tappable_overlay}
                onPress={() => {
                  onClickPlayVideo(item.itemType);
                }}>
                {/* <Image source={require('../../../components/MoVideoPlayer/images/play-lg.png')} resizeMode="contain" style={styles.itemPlayIcon} /> */}
              </TouchableOpacity>
            </View>
            <View style={styles.itemDeleteBox}>
              <TouchableOpacity
                onPress={() => {
                  onClickDeleteVideo();
                }}>
                <Image
                  source={require('../../../assets/images/icon_trash.png')}
                  resizeMode="contain"
                  style={styles.itemTrashIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.itemDescBox}>
            <Text
              mb="1"
              fontSize="sm"
              textAlign="left"
              numberOfLines={1}
              ellipsizeMode={`tail`}>
              {item['title']}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default VideoItem;
