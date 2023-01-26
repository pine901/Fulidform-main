import { View, Text, useToast } from 'native-base';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dimensions, SafeAreaView } from "react-native";
import { TouchableOpacity } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window");

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLOR, ITEM_TYPE, SIZE } from '../../../utils/Constants';
import { console_log, empty } from '../../../utils/Misc';
import styles from './styles';
import MyConfirmModal from '../../../components/MyConfirmModal';
import { setSavedVideoList } from '../../../redux/settings/actions';
import * as RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import SavedVideoList from './SavedVideoList';
import BaseStyle from '../../../styles/BaseStyle';

export default SavedVideosScreen = (props) => {
  const dispatch = useDispatch();
  const savedVideoList = useSelector(state => state.settings.savedVideoList);

  useFocusEffect(
    React.useCallback(() => {
      adjustSavedVideoList()
    }, [savedVideoList])
  )

  const toast = useToast();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: ITEM_TYPE.WORKOUT, title: 'WORKOUTS' },
    { key: ITEM_TYPE.CHALLENGE, title: 'CHALLENGES       ' }, // space is for padding right
  ]);

  const renderTabBar = (t_props) => {
    return (
      <TabBar
        {...t_props}
        scrollEnabled
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
        tabStyle={styles.tab}
        labelStyle={styles.label}
        pressColor={'transparent'}
        activeColor={COLOR.FONT_DARK}
        inactiveColor={COLOR.FONT_WARNING}
      />
    )
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => {
    setIsOpen(false);
  }

  const onClickDeleteAll = () => {
    const saved_video_list = getSavedVideoList()
    if (empty(saved_video_list) || saved_video_list.length === 0) {
      return false
    }
    setIsOpen(true)
  }

  const getSavedVideoList = () => {
    const newSavedVideoList = []
    for (let k in savedVideoList) {
      let row = savedVideoList[k]
      newSavedVideoList.push(row)
    }
    return newSavedVideoList
  }

  const deleteAll = () => {
    const newSavedVideoList = []
    for (let k in savedVideoList) {
      let row = savedVideoList[k]
      deleteFile(row['filePath'])
    }

    dispatch(setSavedVideoList(newSavedVideoList));
    toast.show({
      description: "VIDEO DELETED"
    });
    setIsOpen(false)
  }

  const deleteFile = (filepath) => {
    RNFS.exists(filepath)
      .then((result) => {
        console_log("file exists: ", result);
        if (result) {
          return RNFS.unlink(filepath)
            .then(() => {
              console_log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
              console_log(err.message);
            });
        }
      })
      .catch((err) => {
        console_log(err.message);
      });
  }

  const adjustSavedVideoList = async () => {
    const newSavedVideoList = []
    let file_not_exists = false
    for (let k in savedVideoList) {
      let row = savedVideoList[k]
      let file_exist = await checkFileExist(row['filePath'])
      console_log("file_exist:::", row['filePath'], file_exist)
      if (file_exist) {
        newSavedVideoList.push(row)
      } else {
        file_not_exists = true
      }
    }
    if (file_not_exists) {
      dispatch(setSavedVideoList(newSavedVideoList));
    }
  }

  const checkFileExist = async (filepath) => {
    let fileExist = new Promise((resolve, reject) => {
      RNFS.exists(filepath)
        .then((result) => {
          console_log("file exists: ", result);
          resolve(result)
        })
        .catch((err) => {
          console_log(err.message);
          reject(false)
        });
    })
    return await fileExist
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text fontSize="lg">SAVED VIDEOS</Text>
          </View>
          <TouchableOpacity onPress={(e) => onClickDeleteAll()}  >
            <Icon name="delete-sweep-outline" color={COLOR.DARK} size={SIZE.APP_ICON_SIZE} />
          </TouchableOpacity>
        </View>

        <View style={[BaseStyle.flex]}>
          <SavedVideoList />
        </View>

      </View>
      <MyConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="ARE YOU SURE YOU WANT TO REMOVE ALL VIDEOS?"
        desc="Please click to confirm"
        okBtnText="Delete"
        cancelBtnText="Cancel"
        okBtnCallback={deleteAll}
        cancelBtnCallback={onClose}
      />

    </SafeAreaView>
  )
}