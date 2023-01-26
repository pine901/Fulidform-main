import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  useToast,
  VStack,
  HStack,
  Skeleton,
  Pressable,
} from 'native-base';

import styles from './styles';

import {CommonStyles} from '../../../utils/CommonStyles';
import {useDispatch, useSelector} from 'react-redux';
import {is_null} from '../../../utils/Misc';
import {COLOR, IMAGE_RATIO_16X9} from '../../../utils/Constants';
import {
  apiGetPlanDetail,
  apiLoginRequired,
  apiResponseIsSuccess,
} from '../../../utils/API';
import {signOut} from '../../../redux/auth/actions';
import MyResponsiveImage from '../../../components/MyResponsiveImage';
import {navReset} from '../../../utils/Nav';
import {
  ROUTE_AUTH_STACK_NAVIGATOR,
  ROUTE_SIGNIN,
  ROUTE_CHALLENGE_DETAIL,
} from '../../../routes/RouteNames';
import CustomStyle from '../../../styles/CustomStyle';

export default RecommendedChallengeBox = props => {
  const {
    navigation,
    checkApiIsLoading,
    startApiLoading,
    endApiLoading,
    planId,
    navReset,
    boxStyle,
  } = props;
  const dispatch = useDispatch();
  const appOrientation = useSelector(state => state.orientation.appOrientation);

  const toast = useToast();

  const [recommendedChallenges, setRecommendedChallenges] = useState(null);

  useEffect(() => {
    if (planId) {
      loadPageData();
    }
    return () => {};
  }, [planId]);

  const loadPageData = async () => {
    setRecommendedChallenges(null);
    const itemId = planId;
    const apiKey = 'apiGetPlanDetail-' + itemId;
    if (checkApiIsLoading(apiKey)) {
      return false;
    }
    startApiLoading(apiKey);

    const response = await apiGetPlanDetail(itemId);
    endApiLoading(apiKey);

    //console_log("plan detail response::: ", JSON.stringify(response.data.recommended_challenges))

    if (apiResponseIsSuccess(response)) {
      setRecommendedChallenges(response.data.recommended_challenges);
    } else {
      if (apiLoginRequired(response)) {
        dispatch(signOut());
        navReset([ROUTE_AUTH_STACK_NAVIGATOR, ROUTE_SIGNIN], {}, navigation);
      } else {
        toast.show({
          description: response.message,
        });
      }
      return false;
    }
  };

  const viewChallengeDetail = itemId => {
    if (navReset) {
      navReset();
      setTimeout(() => {
        navigation.navigate(ROUTE_CHALLENGE_DETAIL, {itemId: itemId});
      }, 200);
    } else {
      navigation.navigate(ROUTE_CHALLENGE_DETAIL, {itemId: itemId});
    }
  };

  return (
    <>
      {!is_null(recommendedChallenges) ? (
        <View
          style={[
            styles.recommendedChallengeBox,
            CommonStyles.appBox,
            boxStyle,
          ]}>
          <View style={[CustomStyle.mb3]}>
            <Text fontSize="lg">RECOMMENDED CHALLENGES</Text>
          </View>
          <View>
            <Text
              fontSize="xs"
              style={[
                CommonStyles.textGray,
                styles.recommendedChallengeBoxDesc,
              ]}>
              To compliment your 21-Day Personalised Program, the below
              challenges have been hand selected based on your individual needs,
              Work through these Challenges to build strength, create tone and
              achieve your individual goals.
            </Text>
          </View>
          <View style={styles.recommendedChallengeItemList}>
            {recommendedChallenges && recommendedChallenges.length > 0 ? (
              recommendedChallenges.map((item, index) => {
                //console_log("workouts item", item)
                return (
                  <React.Fragment key={index}>
                    {item ? (
                      <Pressable
                        style={styles.recommendedChallengeItem}
                        onPress={e => viewChallengeDetail(item['id'])}>
                        <View style={styles.recommendedChallengeThumbBox}>
                          <MyResponsiveImage
                            style={{width: '100%'}}
                            source={{uri: item['thumbnail']}}
                            ratio={IMAGE_RATIO_16X9}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.recommendedChallengeTextBox}>
                          <Text
                            mb="1"
                            fontSize="sm"
                            textAlign="left"
                            numberOfLines={1}
                            ellipsizeMode={`tail`}>
                            {item['title']}
                          </Text>
                          <Text
                            fontSize="xs"
                            textAlign="left"
                            numberOfLines={4}
                            ellipsizeMode={`tail`}
                            style={CommonStyles.textGray}>
                            {item['description']}
                          </Text>
                        </View>
                      </Pressable>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <View style={CommonStyles.appBox}>
                <Text
                  fontSize="md"
                  textAlign="center"
                  style={CommonStyles.textGray}>
                  No challenge
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={[styles.recommendedChallengeBox, CommonStyles.appBox]}>
          <Skeleton h="8" />
          <Skeleton.Text mt={5} mb={5} />
          <HStack space={5} style={CustomStyle.mb6}>
            <Skeleton flex="1" h="120" rounded="md" />
            <VStack flex="1" space="4">
              <Skeleton h="6" />
              <Skeleton.Text />
            </VStack>
          </HStack>
          <HStack space={5} style={CustomStyle.mb6}>
            <Skeleton flex="1" h="120" rounded="md" />
            <VStack flex="1" space="4">
              <Skeleton h="6" />
              <Skeleton.Text />
            </VStack>
          </HStack>
          <HStack space={5} style={CustomStyle.mb6}>
            <Skeleton flex="1" h="120" rounded="md" />
            <VStack flex="1" space="4">
              <Skeleton h="6" />
              <Skeleton.Text />
            </VStack>
          </HStack>
        </View>
      )}
    </>
  );
};
