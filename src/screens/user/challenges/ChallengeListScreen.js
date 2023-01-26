import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {View, Text, useToast} from 'native-base';

import styles from './styles';

import {Indicator} from '../../../components/Indicator';
import {CommonStyles} from '../../../utils/CommonStyles';
import {useDispatch} from 'react-redux';
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
  ROUTE_CHALLENGE_DETAIL,
} from '../../../routes/RouteNames';
import {
  apiGetChallengeList,
  apiLoginRequired,
  apiResponseIsSuccess,
  API_PAGE_SIZE,
} from '../../../utils/API';
import {signOut} from '../../../redux/auth/actions';
import {navReset} from '../../../utils/Nav';
import ChallengeSearchBox from './ChallengeSearchBox';
import {useRef} from 'react';
import ChallengeItem from './ChallengeItem';
import MyFlatList from '../../../components/MyFlatList';
import BaseStyle from '../../../styles/BaseStyle';
import CustomStyle from '../../../styles/CustomStyle';

import {isPadTablet} from '../../../utils/Misc';
import ItemListSkeleton from '../../../components/MySkeleton/ItemListSkeleton';

const iPadTablet = isPadTablet();

export default ChallengeListScreen = props => {
  /////////////////////////////////////////// start common header for screen  ////////////////////////////////////////////
  const {navigation, route} = props;
  const dispatch = useDispatch();
  useEffect(() => {
    loadPageData();
  }, []);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

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

  const [pageInitialized, setPageInitialized] = useState(false);
  const loadPageData = async () => {
    setPageInitialized(false);
    await reloadItemList();
    setPageInitialized(true);
  };
  /////////////////////////////////////////// end common header for screen  ////////////////////////////////////////////

  const [itemList, setItemList] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [reloadTimestamp, setReloadTimestamp] = useState(0);

  const reloadItemList = async (
    search_payload = STATIC_VALUES.current['searchPayload'],
  ) => {
    const pageNumer = 1;
    STATIC_VALUES.current['page'] = pageNumer;
    STATIC_VALUES.current['fullLoaded'] = false;
    await loadItemList(pageNumer, search_payload, true);
  };
  const loadItemList = async (
    pageNumer = 1,
    search_payload = STATIC_VALUES.current['searchPayload'],
    force_reload = false,
  ) => {
    console_log('pageNumer:::', pageNumer);
    const apiKey = 'apiGetChallengeList';
    if (!force_reload) {
      if (itemsLoading) {
        return false;
      }
      if (STATIC_VALUES.current['fullLoaded']) {
        console_log('fullLoaded:::', STATIC_VALUES.current['fullLoaded']);
        return false;
      }
      setItemsLoading(true);
    } else {
      //force reload
      if (checkApiIsLoading(apiKey)) {
        return false;
      }
      startApiLoading(apiKey);
    }

    const payload = {
      ...search_payload,
      limit: API_PAGE_SIZE,
      page: pageNumer,
    };
    console_log('api payload:::', payload);
    const response = await apiGetChallengeList(payload);
    //console_log("api response:::", response)

    if (apiResponseIsSuccess(response)) {
      console_log('response.data length:::', response.data.length);
      if (!empty(search_payload['search'])) {
        STATIC_VALUES.current['fullLoaded'] = true;
      }
      if (empty(response.data) || response.data.length === 0) {
        STATIC_VALUES.current['fullLoaded'] = true;
      }
      if (force_reload) {
        setItemList([...response.data]);
        setReloadTimestamp(get_utc_timestamp_ms());
      } else {
        setItemList([...itemList, ...response.data]);
      }
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation);
      } else {
        toast.show({
          description: response.message,
        });
      }
    }

    console_log('itemList count:::', itemList.length);
    if (!force_reload) {
      setItemsLoading(false);
    } else {
      //force reload
      endApiLoading(apiKey);
    }
    STATIC_VALUES.current['page'] = pageNumer;
  };
  const scrollEndCallback = () => {
    console_log('scrollEndCallback:::');
    loadItemList(STATIC_VALUES.current['page'] + 1);
  };
  const renderItem = ({item, index, separators}) => {
    return <ChallengeItem item={item} vewItemDetail={vewItemDetail} />;
  };

  const vewItemDetail = itemId => {
    navigation.navigate(ROUTE_CHALLENGE_DETAIL, {itemId: itemId});
  };
  const onChangeSearchData = searchData => {
    console_log('searchData:::', searchData);
    if (!equalTwoOjects(searchData, STATIC_VALUES.current['searchPayload'])) {
      STATIC_VALUES.current['searchPayload'] = searchData;
      reloadItemList(searchData);
    }
  };

  const [isCollapsed, setIsCollapsed] = useState(true);

  const onScroll = () => {
    if (iPadTablet) {
      return false;
    }
    // if(!isCollapsed) {
    //   setIsCollapsed(true)
    // }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={[CustomStyle.flexibleSplitter, CustomStyle.itemListPageWrapper]}>
        <View style={[CustomStyle.searchBoxWrapper]}>
          <View style={CommonStyles.body}>
            <Text fontSize="lg">FIND A CHALLENGE</Text>
          </View>
          <ChallengeSearchBox
            {...props}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            checkApiIsLoading={checkApiIsLoading}
            startApiLoading={startApiLoading}
            endApiLoading={endApiLoading}
            onChangeSearchData={searchData => onChangeSearchData(searchData)}
          />
        </View>

        <View style={[CustomStyle.itemListBoxWrapper]}>
          <View style={CustomStyle.itemListBox}>
            {pageInitialized ? (
              <MyFlatList
                title="ALL CHALLENGES"
                itemList={itemList}
                renderItem={renderItem}
                scrollEndCallback={scrollEndCallback}
                itemsLoading={itemsLoading}
                reloadTimestamp={reloadTimestamp}
                numColumns={iPadTablet ? 2 : 1}
                onScroll={() => onScroll()}
              />
            ) : (
              <>
                <ItemListSkeleton />
              </>
            )}
          </View>
        </View>
      </View>

      {loading && <Indicator />}
    </SafeAreaView>
  );
};
