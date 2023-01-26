import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { View, ScrollView, Button, useToast, Text, Pressable } from 'native-base';

import styles from './styles';

import { Indicator } from '../../../components/Indicator';
import { CommonStyles } from '../../../utils/CommonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { setFirstLogin } from '../../../redux/config/actions';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTE_DASHBOARD, ROUTE_DASHBOARD_TAB, ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_USER_TAB_NAVIGATOR, ROUTE_PERSONAL_PROGRAM, ROUTE_CHALLENGE_DETAIL } from '../../../routes/RouteNames';
import { setAppMainStatusBarStyle } from '../../../utils/Utils';
import { navReset } from '../../../utils/Nav';
import { apiGetDashboardDetail, apiGetPlanDetail, apiGetProgramDetail } from '../../../utils/API';
import DaySessionBox from '../../../components/DaySessionBox';
import { ITEM_TYPE } from '../../../utils/Constants';
import { addItemToArray, empty, removeItemFromArray } from '../../../utils/Misc';
import MyResponsiveImage from '../../../components/MyResponsiveImage';
import { IMAGE_RATIO_16X9, COLOR } from '../../../utils/Constants';

export default SubscriptionsScreen = (props) => {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const firstLogin = useSelector(state => state.config.firstLogin);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const currentDayIndex = useSelector(state => state.config.digitalCalendar.currentDayIndex);
  const STATIC_VALUES = useRef(
    {
      apiLoadingList: [],
    }
  )

  const checkLoading = (loadingList = null) => {
    let curLoadingList = [...STATIC_VALUES.current['apiLoadingList']]
    if (loadingList !== null) {
      curLoadingList = loadingList
    }
    const isLoading = (!empty(curLoadingList) && curLoadingList.length > 0)
    setLoading(isLoading)
    return isLoading
  }
  const startApiLoading = (apiKey) => {
    const newApiLoadingList = addItemToArray([...STATIC_VALUES.current['apiLoadingList']], apiKey)
    STATIC_VALUES.current['apiLoadingList'] = (newApiLoadingList)
    checkLoading(newApiLoadingList)
  }
  const endApiLoading = (apiKey) => {
    const newApiLoadingList = removeItemFromArray([...STATIC_VALUES.current['apiLoadingList']], apiKey)
    STATIC_VALUES.current['apiLoadingList'] = (newApiLoadingList)
    checkLoading(newApiLoadingList)
  }
  const checkApiIsLoading = (apiKey) => {
    if (!STATIC_VALUES.current['apiLoadingList'].includes(apiKey)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * DASHBOARD SUBSCRIPTION LOGIC
   */
   const showSubscriptionMessageHandler = async (payload) => {
    const {
      weekly_activity,
      featured_challenges,
      program: {program_id, plan_id},
      subscription: {status, message}, 
      purchased_challenges: {challenges}
    } = payload;

    // THIS IS TO REMOVE THE <P></P> TAG
    const newMsg = message ? message.replace( /(<([^>]+)>)/ig, '') : null;

    if(status === 'inactive' && challenges.length < 1) {
      // SHOW $details->subscription->message
      setSubscriptionInfo((prevState) => {
        return {...prevState, message: newMsg, program_id, plan_id}
      })
    } else {
      //SHOW Subscription Section as follows:
      if(status !== 'inactive') {
        if(status === 'on-hold') {
          // SHOW $details->subscription->message
          setSubscriptionInfo((prevState) => {
            return {...prevState, message: newMsg, program_id, plan_id}
          })
        }
        if(status === 'active') {
          if(program_id === 'none') {
            // SHOW $details->subscription->message
            setSubscriptionInfo((prevState) => {
              return {...prevState, message: newMsg, program_id, plan_id}
            })
          } else if(program_id === 'in-review') {
            // SHOW $details->subscription->message
            setSubscriptionInfo((prevState) => {
              return {...prevState, message: newMsg, program_id, plan_id}
            })
          } else {
            // SHOW $details->subscription->message
            // SHOW $details->weekly_activity
            // SHOW PERSONALISED PROGRAM using $details->program->program_id
            const personalised_program = await apiGetProgramDetail(program_id);
            setSubscriptionInfo((prevState) => {
              return {
                ...prevState, 
                message: newMsg, 
                program_id,
                plan_id,
                weekly_activity,
                personalised_program: personalised_program.data
              }
            })
            if(featured_challenges.length > 0) {
              // SHOW $details->featured_challenges under a section title "What's New"
              setSubscriptionInfo((prevState) => {
                return {...prevState, whats_new: featured_challenges}
              })
            }
            if(plan_id !== 'none') {
              // SHOW RECOMMENDED CHALLENGES using $details->$details->plan_id
              const recommended_challenges_data = await apiGetPlanDetail(plan_id);

              setSubscriptionInfo((prevState) => {
                return {...prevState, recommended_challenges: recommended_challenges_data.data.recommended_challenges}
              })
            }
          }
        }
      }

      //SHOW Purchased Challenges Section as follows:
      if(challenges.length > 0) {
        // SHOW $details->purchased_challenges->title
        // SHOW $details->purchased_challenges->message
        // SHOW PURCHASED CHALLENGES using $details->purchased_challenges->challenges
        setSubscriptionInfo((prevState) => {
          return {
            ...prevState, 
            message: payload.purchased_challenges.message,
            title: payload.purchased_challenges.title,
            purchased_challenges: challenges,
            plan_id,
            program_id
          }
        })
      }
    }
  }

  //console_log("firstLogin (subscription page) :::", firstLogin)
  useEffect(() => {
    if (firstLogin) {
      dispatch(setFirstLogin(false));
    }

    apiGetDashboardDetail().then((response) => {
      showSubscriptionMessageHandler(response.data);
    }).catch((err) => console.log(err))
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setAppMainStatusBarStyle(StatusBar)
      setLoading(false);
    }, [])
  );


  const handleSubmit = (itemId, type) => {
    //navigation.navigate(ROUTE_DASHBOARD)
    navReset([ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_USER_TAB_NAVIGATOR, ROUTE_DASHBOARD_TAB, ROUTE_DASHBOARD], {}, navigation)

    setTimeout(() => {
      if(type === 'personalised_program') navigation.navigate(ROUTE_PERSONAL_PROGRAM, { itemId });
      if(type === 'featured_challenges') navigation.navigate(ROUTE_CHALLENGE_DETAIL, { itemId });
    }, 200)
  }



  if(!subscriptionInfo) return <Indicator color='#000' />

  // return (
  //   <SafeAreaView style={{ flex: 1 }}>
  //     <View style={styles.subscriptionHeader}>
  //       <Text style={styles.subscriptionTitle} fontSize="lg">SUBSCRIPTIONS</Text>
  //     </View>
  //     <ScrollView style={CommonStyles.body} flex={1}>
  //       <View style={styles.subscriptionBoxWrapper}>
  //         <View style={styles.subscriptionBox}>
  //           <Image resizeMode="contain" source={require("../../../assets/images/subscription_icon.png")} style={styles.subscriptionIcon} alt="subscription icon" />
  //           <View style={styles.subscriptionBody} flex={1}>
  //             <Text fontSize="md" style={CommonStyles.textGray}>YOU DON'T HAVE AN ACTIVE PLAN YET.</Text>
  //             <Text fontSize="xs" mt="2" style={CommonStyles.textLightDark}>Please complete your personalised program questionnaire via the online dashboard.</Text>
  //             <View mt="3" mb="3">
  //               <Button size="sm" colorScheme="gray" bg="black" style={[CommonStyles.appDefaultButton, styles.dashboardButton]} onPress={(e) => handleSubmit()}>CLICK HERE</Button>
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     </ScrollView>
  //     {loading && <Indicator />}
  //   </SafeAreaView>
  // )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.subscriptionHeader}>
        <Text style={styles.subscriptionTitle} fontSize="lg">SUBSCRIPTIONS</Text>
      </View>
      <ScrollView style={CommonStyles.body} flex={1}>
        <View style={styles.subscriptionBoxWrapper}>

          {/** GENERAL MESSAGE */}
          <View style={styles.subscriptionBox}>
            <Image resizeMode="contain" source={require("../../../assets/images/subscription_icon.png")} style={styles.subscriptionIcon} alt="subscription icon" />
              <View style={styles.subscriptionBody} flex={1}>
              {/** TITILE */}
              {subscriptionInfo.title ? <Text fontSize="md" style={CommonStyles.textGray}>{subscriptionInfo.title}</Text> : !subscriptionInfo.message || subscriptionInfo.message === '' ? <Text fontSize="md" style={CommonStyles.textGray}>`YOU DON'T HAVE AN ACTIVE PLAN YET.`</Text> : null}

              {/** MESSAGE */}
              <Text fontSize="xs" mt="0" style={CommonStyles.textLightDark}>
                {subscriptionInfo.message && subscriptionInfo.message !== '' ? subscriptionInfo.message : 'Please complete your personalised program questionnaire via the online dashboard.'}
              </Text>
            </View>
          </View>

          {/** WEEKLY MESSAGE */}
          {subscriptionInfo.weekly_activity ? <View style={[styles.subscriptionBox, {marginTop: 10}]}>
            <Image resizeMode="contain" source={require("../../../assets/images/subscription_icon.png")} style={styles.subscriptionIcon} alt="subscription icon" />
              <View style={styles.subscriptionBody} flex={1}>
              {/** TITILE */}
              <Text fontSize="md" style={CommonStyles.textGray}>WEEKLY ACTIVITY ({subscriptionInfo.weekly_activity.weekly_count})</Text> 

              {/** MESSAGE */}
              <Text fontSize="xs" mt="0" style={CommonStyles.textLightDark}>
                {subscriptionInfo.weekly_activity.weekly_message}
              </Text>
            </View>
          </View> : null}

          {/** FEATURED CHALLENGES */}
          {subscriptionInfo.whats_new ? <View style={[styles.subscriptionBox, {marginTop: 10}]}>
            <View style={[styles.subscriptionBody, {paddingHorizontal: 0}]} flex={1}>
              <Text fontSize="md" style={CommonStyles.textGray}>WHAT'S NEW</Text> 

              <View mt='3'>
                {
                  subscriptionInfo.whats_new.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {
                          (item) ? (
                            <Pressable style={styles.featuredChallengeItem} onPress={() => handleSubmit(item.id, 'featured_challenges')}>
                              <View style={styles.featuredChallengeThumbBox}>
                                <MyResponsiveImage style={{ width: '100%' }}
                                  source={{ uri: item['thumbnail'] }}
                                  ratio={IMAGE_RATIO_16X9}
                                  resizeMode="cover"
                                />
                                <View style={styles.recommendedChallengeTextBox}>
                                  <Text mb="1" fontSize="sm" textAlign="left" numberOfLines={1} ellipsizeMode={`tail`}>{item['title']}</Text>
                                  <Text fontSize="xs" textAlign="left" numberOfLines={4} ellipsizeMode={`tail`} style={CommonStyles.textGray}>
                                    {item['description']}
                                  </Text>
                                </View>
                                <Button size="xs" colorScheme="gray" style={[styles.itemThumbnailBtn]} onPress={(e) => handleSubmit(item.id, 'featured_challenges')}>{item.experience_levels.length < 2 ? 'PLAY' : 'RESUME'}</Button>
                              </View>
                              
                            </Pressable>
                          ) : (
                            <></>
                          )
                        }
                      </React.Fragment>
                    )
                  })
                }
              </View>
            </View>
          </View> : null}

          {/** RECOMMENDED CHALLENGES */}
          {subscriptionInfo.recommended_challenges ? <View style={[styles.subscriptionBox, {marginTop: 10, paddingTop: 0}]}>
            <View style={[styles.subscriptionBody, {paddingHorizontal: 0}]} flex={1}>
              <View mt='3'>
                <RecommendedChallengeBox
                  {...props}
                  checkApiIsLoading={checkApiIsLoading}
                  startApiLoading={startApiLoading}
                  endApiLoading={endApiLoading}
                  planId={subscriptionInfo.plan_id}
                  navReset={() => {
                    navReset([ROUTE_DRAWER_STACK_NAVIGATOR, ROUTE_USER_TAB_NAVIGATOR, ROUTE_DASHBOARD_TAB, ROUTE_DASHBOARD], {}, navigation)
                  }}
                  boxStyle={{backgroundColor: COLOR.BG_GRAY, paddingHorizontal: 0}}
                />
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}} mt='3'>
                <Button size="sm" colorScheme="gray" bg="black" style={[CommonStyles.appDefaultButton, styles.dashboardButton]} onPress={() => handleSubmit()}>VIEW MORE</Button>
              </View>
            </View>
          </View> : null}

          {/** PERSONALIZED PROGRAM */}
          {subscriptionInfo.personalised_program ? <View style={[styles.subscriptionBox, {marginTop: 10}]}>
            <View style={[styles.subscriptionBody, {paddingHorizontal: 0}]} flex={1}>
              <Text fontSize="md" style={CommonStyles.textGray}>PERSONALISED PROGRAM</Text> 
              <Text fontSize="md" style={CommonStyles.textGray}>{subscriptionInfo.personalised_program.program.title}</Text>

              {/** PROGRAM LIST */}
              <View mt='3' style={{justifyContent: 'center', alignItems: 'center'}}>
                <DaySessionBox
                  {...props}
                  itemId={subscriptionInfo.program_id}
                  itemDetail={subscriptionInfo.personalised_program['program']}
                  itemType={ITEM_TYPE.PROGRAM}
                  session_index={currentDayIndex}
                  daySession={(!empty(subscriptionInfo.personalised_program['program'].workout_group) && subscriptionInfo.personalised_program['program'].workout_group.length > 0) ? subscriptionInfo.personalised_program['program'].workout_group[currentDayIndex] : null}
                  checkApiIsLoading={checkApiIsLoading}
                  startApiLoading={startApiLoading}
                  endApiLoading={endApiLoading}
                />
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Button size="sm" colorScheme="gray" bg="black" style={[CommonStyles.appDefaultButton, styles.dashboardButton]} onPress={() => handleSubmit(subscriptionInfo.program_id, 'personalised_program')}>VIEW MORE</Button>
              </View>
            </View>
          </View> : null}

          {/** PURCHASED CHALLENGES */}
          {subscriptionInfo.purchased_challenges ? <View style={[styles.subscriptionBox, {marginTop: 10}]}>
          <View style={[styles.subscriptionBody, {paddingHorizontal: 0}]} flex={1}>
            <Text fontSize="md" style={CommonStyles.textGray}>PURCHASED CHALLENGES</Text> 

            <View mt='3'>
                {
                  subscriptionInfo.purchased_challenges.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        {
                          (item) ? (
                            <Pressable style={styles.featuredChallengeItem} onPress={() => handleSubmit(item.id, 'featured_challenges')}>
                              <View style={styles.featuredChallengeThumbBox}>
                                <MyResponsiveImage style={{ width: '100%' }}
                                  source={{ uri: item['thumbnail'] }}
                                  ratio={IMAGE_RATIO_16X9}
                                  resizeMode="cover"
                                />
                                <View style={styles.recommendedChallengeTextBox}>
                                  <Text mb="1" fontSize="sm" textAlign="left" numberOfLines={1} ellipsizeMode={`tail`}>{item['title']}</Text>
                                  <Text fontSize="xs" textAlign="left" numberOfLines={4} ellipsizeMode={`tail`} style={CommonStyles.textGray}>
                                    {item['description']}
                                  </Text>
                                </View>
                                <Button size="xs" colorScheme="gray" style={[styles.itemThumbnailBtn]} onPress={(e) => handleSubmit(item.id, 'featured_challenges')}>VIEW CHALLENGE</Button>
                              </View>
                              
                            </Pressable>
                          ) : (
                            <></>
                          )
                        }
                      </React.Fragment>
                    )
                  })
                }
              </View>
          </View>
          </View> : null}

        </View>
      </ScrollView>
      {loading && <Indicator color='#fff' />}
    </SafeAreaView>
  )
}