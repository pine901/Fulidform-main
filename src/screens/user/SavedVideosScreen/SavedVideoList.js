import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {FlatList, SafeAreaView} from 'react-native';
import {View, Text, useToast, Center} from 'native-base';

import styles from './styles';

import {Indicator} from '../../../components/Indicator';
import {CommonStyles} from '../../../utils/CommonStyles';
import {
  addItemToArray,
  console_log,
  empty,
  equalTwoOjects,
  get_utc_timestamp_ms,
  removeItemFromArray,
} from '../../../utils/Misc';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_WORKOUT_DETAIL,
} from '../../../routes/RouteNames';
import {
  apiGetWorkoutList,
  apiLoginRequired,
  apiResponseIsSuccess,
  API_PAGE_SIZE,
} from '../../../utils/API';
import {signOut} from '../../../redux/auth/actions';
import {navReset} from '../../../utils/Nav';
import {useRef} from 'react';
import MyFlatList from '../../../components/MyFlatList';
import VideoItem from './VideoItem';
import {useNavigation} from '@react-navigation/native';
import {setSavedVideoList} from '../../../redux/settings/actions';
import * as RNFS from 'react-native-fs';
import {ITEM_TYPE} from '../../../utils/Constants';
import {isPadTablet} from '../../../utils/Misc';
import ItemListSkeleton3 from '../../../components/MySkeleton/ItemListSkeleton3';

const iPadTablet = isPadTablet();

export default SavedVideoList = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {itemType} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const savedVideoList = useSelector(state => state.settings.savedVideoList);
  const [loading, setLoading] = useState(true);
  const [itemList, setItemList] = useState(null);
  const item_count_per_row = 3;

  console.log('itemList', itemList);

  useEffect(() => {
    getSavedVideoList();
  }, [savedVideoList]);

  const getSavedVideoList = async () => {
    const newSavedVideoList = [];
    for (let k in savedVideoList) {
      let row = savedVideoList[k];
      let file_exist = await checkFileExist(row['filePath']);
      console_log('file_exist:::', row['filePath'], file_exist);
      if (file_exist) {
        newSavedVideoList.push(row);
      }
    }
    if (iPadTablet) {
      let mod_val = newSavedVideoList.length % item_count_per_row;
      console_log('mod_val:::::', mod_val);
      if (mod_val > 0) {
        let empty_item_count = item_count_per_row - mod_val;
        for (let i = 0; i < empty_item_count; i++) {
          newSavedVideoList.push({
            filePath: 'empty-item-saved-video-' + i,
            empty_object: 1,
          });
        }
      }
    }

    setItemList(newSavedVideoList);
    setLoading(false);
    return newSavedVideoList;
  };

  const toast = useToast();

  const STATIC_VALUES = useRef({
    apiLoadingList: [],
    page: 1,
    fullLoaded: false,
    searchPayload: {},
  });
  const checkLoading = (loadingList = null) => {
    let curLoadingList = [...STATIC_VALUES.current['apiLoadingList']];
    if (loadingList !== null) {
      curLoadingList = loadingList;
    }
    const isLoading = !empty(curLoadingList) && curLoadingList.length > 0;
    setLoading(isLoading);
    return isLoading;
  };
  const startApiLoading = apiKey => {
    const newApiLoadingList = addItemToArray(
      [...STATIC_VALUES.current['apiLoadingList']],
      apiKey,
    );
    STATIC_VALUES.current['apiLoadingList'] = newApiLoadingList;
    checkLoading(newApiLoadingList);
  };
  const endApiLoading = apiKey => {
    const newApiLoadingList = removeItemFromArray(
      [...STATIC_VALUES.current['apiLoadingList']],
      apiKey,
    );
    STATIC_VALUES.current['apiLoadingList'] = newApiLoadingList;
    checkLoading(newApiLoadingList);
  };
  const checkApiIsLoading = apiKey => {
    if (!STATIC_VALUES.current['apiLoadingList'].includes(apiKey)) {
      return false;
    } else {
      return true;
    }
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setAppMainStatusBarStyle(StatusBar)
  //   }, [])
  // );

  /////////////////////////////////////////// end common header for screen  ////////////////////////////////////////////
  const deleteVideo = item => {
    console_log('item:::', item);
    removeItemFromSavedVideoList(item);
  };
  const removeItemFromSavedVideoList = item => {
    const newSavedVideoList = [];
    for (let k in savedVideoList) {
      let row = savedVideoList[k];
      if (
        item['filePath'] === row['filePath'] &&
        item['fileName'] === row['fileName']
      ) {
      } else {
        newSavedVideoList.push(row);
      }
    }

    dispatch(setSavedVideoList(newSavedVideoList));
    toast.show({
      description: 'VIDEO DELETED',
    });

    deleteFile(item['filePath']);
  };
  const deleteFile = filepath => {
    RNFS.exists(filepath)
      .then(result => {
        console.log('file exists: ', result);
        if (result) {
          return (
            RNFS.unlink(filepath)
              .then(() => {
                console.log('FILE DELETED');
              })
              // `unlink` will throw an error, if the item to unlink does not exist
              .catch(err => {
                console.log(err.message);
              })
          );
        }
      })
      .catch(err => {
        console.log(err.message);
      });
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

  const renderItem = ({item, index, separators}) => {
    return (
      <VideoItem
        item={item}
        navigation={navigation}
        deleteVideo={deleteVideo}
      />
    );
  };

  const ListEmptyComponent = () => {
    return (
      <Center flex={1}>
        <Text fontSize="md" textAlign="center">
          No saved videos found
        </Text>
      </Center>
    );
  };

  return (
    <View style={styles.itemListBox}>
      {itemList !== null ? (
        itemList.length === 0 ? (
          <ListEmptyComponent />
        ) : (
          <FlatList
            style={styles.flatItemList}
            data={itemList}
            renderItem={renderItem}
            keyExtractor={item => item.filePath}
            ListEmptyComponent={ListEmptyComponent}
            numColumns={iPadTablet ? item_count_per_row : 1}
          />
        )
      ) : (
        <>
          <ItemListSkeleton3 />
        </>
      )}
      {loading && <Indicator />}
    </View>
  );
};
