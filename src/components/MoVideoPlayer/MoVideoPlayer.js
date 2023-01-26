import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Platform,
  ViewPropTypes,
  AppState,
  Dimensions,
  StatusBar,
  BackHandler,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import {useToast, View} from 'native-base';
import Video from 'react-native-video';
import Slider from 'react-native-sliders';
import Orientation from 'react-native-orientation-locker';
import {
  addDownloadingVideoList,
  removeDownloadingVideoList,
  setDownloadingVideoList,
  setFullScreenMode,
  setRecentActivity,
} from '../../redux/config/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  console_log,
  empty,
  generateFileNameFromUrl,
  get_utc_timestamp,
} from '../../utils/Misc';
import {useFocusEffect} from '@react-navigation/native';

import RNFetchBlob from 'rn-fetch-blob';
import {
  addSavedVideoList,
  setSavedVideoList,
} from '../../redux/settings/actions';
import {DOWNLOAD_STATUS, ITEM_TYPE} from '../../utils/Constants';
import {ROUTE_VIDEO_SCREEN} from '../../routes/RouteNames';
import {isPadTablet} from '../../utils/Misc';
import {
  apiChallengeVideoComplete,
  apiProgramVideoComplete,
  apiWorkoutVideoComplete,
} from '../../utils/API';

import GoogleCast, {
  CastButton,
  useRemoteMediaClient,
} from 'react-native-google-cast';
import MyDownloadIcon from './MyDownloadIcon';
import analytics from '@react-native-firebase/analytics';

const iPadTablet = isPadTablet();

const videoZIndex = 100000;
const VIDEO_TRACK_MS = 30000; //30000

const MoVideoPlayer = props => {
  const {
    style = {},
    source,
    poster,
    title = '',
    itemType = '',
    itemDetail = {},
    playList = [],
    autoPlay = false,
    playInBackground = false,
    showSeeking10SecondsButton = true,
    showHeader = true,
    showCoverButton = true,
    showFullScreenButton = true,
    showSettingButton = true,
    showMuteButton = true,
    videoDownloadStatus = DOWNLOAD_STATUS.NONE,
    showBackButton,
    navigation,
    videoSourceType = 'remote',
    placeholderMode,
  } = props;
  const toast = useToast();

  const dispatch = useDispatch();
  const fullScreenMode = useSelector(state => state.config.fullScreenMode);
  const downloadingVideoList = useSelector(
    state => state.config.downloadingVideoList,
  );
  const savedVideoList = useSelector(state => state.settings.savedVideoList);

  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoSeeked, setIsVideoSeeked] = useState(false);
  const [isVideoFocused, setIsVideoFocused] = useState(true);
  const [isShowVideoCurrentDuration, setIsShowVideoCurrentDuration] =
    useState(false);
  const [isShowSettingsBottomSheet, setIsShowSettingsBottomSheet] =
    useState(false);
  const [isShowVideoRateSettings, setIsShowVideoRateSettings] = useState(false);
  const [isShowVideoQualitiesSettings, setIsShowVideoQualitiesSettings] =
    useState(false);
  const [isShowVideoSoundSettings, setIsShowVideoSoundSettings] =
    useState(false);
  const [isShowVideoPlaylist, setIsShowVideoPlaylist] = useState(false);
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(fullScreenMode);
  const [isErrorInLoadVideo, setIsVErrorInLoadVideo] = useState(false);
  const [isVideoEnd, setIsVideoEnd] = useState(false);
  const [isVideoCovered, setIsVideoCovered] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoQuality, setVideoQuality] = useState(480);
  const [videoSound, setVideoSound] = useState(1.0);
  const [currentVideoDuration, setCurrentVideoDuration] = useState(0);
  const [videoRate, setVideoRate] = useState(1);
  const [playlistSelectedVideo, setPlaylistSelectedVideo] = useState(null);
  const [dimension, setDimension] = useState(Dimensions.get('window'));

  const [downloadStatus, setDownloadStatus] = useState(videoDownloadStatus); //0: not downloaded, 1: downloading, 2: downloaded
  const [isVideoTouched, setIsVideoTouched] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showPosterView, setShowPosterView] = useState(false);

  const [deviceDetected, setHasDevices] = React.useState(null);
  const client = useRemoteMediaClient();
  const discoveryManager = GoogleCast.getDiscoveryManager();
  discoveryManager.startDiscovery();
  const appOrientation = useSelector(state => state.orientation.appOrientation);

  // THIS STATE WILL DETERMINE IF USER USE FULLSCREEN IN A PORTRAIL OR LANDSCAPE MODE
  // SO THAT THE BACK BUTTON KNOWS WHAT ORIENTATION TO PRESENT
  const [originalOrientation, setOriginalOrientation] = useState(
    appOrientation.orientation,
  );

  if (client && source && source.uri) {
    // Send the media to your Cast device as soon as we connect to a device
    // (though you'll probably want to call this later once user clicks on a video or something)
    client.loadMedia({
      playbackRate: 3.0,
      preloadTime: 8.0,
      mediaInfo: {
        contentUrl: source.uri,
        contentType: 'video/mp4',
        streamType: 'buffered',
      },
    });
  }

  const portraitStyle = {
    alignSelf: 'center',
    height: 200,
    width: 330,
    ...style,
  };
  const landScapeStyle = {
    alignSelf: 'center',
    height: iPadTablet
      ? appOrientation.height * 0.5
      : appOrientation.height * 0.75,
    width: iPadTablet
      ? appOrientation.width * 0.75
      : appOrientation.width * 0.75,
  };

  const fullscreenStyle = {
    alignSelf: 'center',
    height: appOrientation.height,
    width: appOrientation.width,
  };

  const tabletStyle = {
    alignSelf: 'center',
    height: appOrientation.height,
    width: appOrientation.width,
  };

  const videoStyle = isVideoFullScreen
    ? fullscreenStyle
    : appOrientation.orientation === 'LANDSCAPE'
    ? landScapeStyle
    : portraitStyle;

  React.useEffect(() => {
    discoveryManager.getDevices().then(deviceList => {
      if (deviceList.length > 0) {
        setHasDevices(true);
      } else {
        setHasDevices(false);
      }
    });
  }, []);

  useEffect(() => {
    const dimensionSubscriber = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimension(window);
        // setIsVideoFullScreen(window.width > window.height ? true : false);
      },
    );

    const backHandlerSubscriber = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isVideoFullScreen) {
          Orientation.lockToPortrait();
          StatusBar.setHidden(false);
          return true;
        } else {
          return false;
        }
      },
    );

    if (isVideoFullScreen) {
      //fullscreen
      StatusBar.setHidden(true);
    } else {
      //not fullscreen
      StatusBar.setHidden(false);
    }

    dispatch(setFullScreenMode(isVideoFullScreen));

    return () => {
      dimensionSubscriber.remove();
      backHandlerSubscriber.remove();
      dispatch(setFullScreenMode(false));
    };
  }, [isVideoFullScreen]);

  useEffect(() => {
    const appStateSubscriber = AppState.addEventListener('change', state => {
      if (playInBackground && isPaused == false) {
        setIsPaused(false);
      } else {
        setIsPaused(true);
      }
    });

    return () => {
      appStateSubscriber.remove();
    };
  }, [isPaused]);

  useEffect(() => {
    if (autoPlay) {
      releaseVideoFocus();
    }
    trimDownloadingVideoList();
  }, []);

  useEffect(() => {
    //console_log("useEffect:::", savedVideoList, downloadingVideoList)
    if (videoSourceType === 'remote') {
      const downloadFileName = getDownloadFileName();
      const isSaved = inSavedVideoList(
        downloadFileName,
        itemType,
        savedVideoList,
      );
      const isDownloading = inDownloadingVideoList(downloadFileName, itemType);
      //console_log("isSaved:::", downloadFileName, isSaved)
      if (isSaved) {
        setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADED);
      } else {
        if (isDownloading) {
          setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADING);
        } else {
          setDownloadStatus(DOWNLOAD_STATUS.NONE);
        }
      }
    } else {
      setDownloadStatus(DOWNLOAD_STATUS.DOWNLOADED);
    }
  }, [savedVideoList, downloadingVideoList]);

  useFocusEffect(
    React.useCallback(() => {
      if (!autoPlay) {
        setShowPosterView(true);
        setIsPaused(true);
        setIsVideoFocused(true);
      }
    }, []),
  );

  ///////////////////////////////// start video track ///////////////////////////////////////////////
  let trackerTimer = null;
  var videoIsFocused = true;
  // useFocusEffect(
  //   React.useCallback(() => {
  //     videoIsFocused = true
  //     return () => {
  //       videoIsFocused = false
  //     }
  //   }, [])
  // );
  useEffect(() => {
    console_log('start video tracking..........');
    runTrackVideoComplete(); // Execute the setInterval function without delay the first time
    trackerTimer = setInterval(() => {
      runTrackVideoComplete();
    }, VIDEO_TRACK_MS);

    return () => clearInterval(trackerTimer); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [isPaused]);

  const runTrackVideoComplete = () => {
    //console_log('Logs every 30 seconds::: videoIsFocused:::', itemType, itemDetail['id'], videoIsFocused, isPaused);
    if (videoIsFocused && !isPaused) {
      trackVideoComplete();
    }
  };

  const trackVideoComplete = async () => {
    let recent_activity = {};
    let trackSuccess = false;
    if (itemType === ITEM_TYPE.WORKOUT) {
      const payload = {
        id: itemDetail['id'],
      };
      const response = await apiWorkoutVideoComplete(payload);
      console_log('trackVideoComplete payload:::', payload, videoIsFocused);
      //console_log("trackVideoComplete response:::", response)
      if (response['data']) {
        trackSuccess = true;
        recent_activity = {...response['data']};
      }
    } else if (itemType === ITEM_TYPE.CHALLENGE) {
      const payload = {
        challenge_id: itemDetail['id'],
        session_index: itemDetail['session_index'],
        video_index: itemDetail['video_index'],
      };
      const response = await apiChallengeVideoComplete(payload);
      console_log('trackVideoComplete payload:::', payload, videoIsFocused);
      //console_log("trackVideoComplete response:::", response)
      if (response['data']) {
        trackSuccess = true;
        recent_activity = {...response['data']};
      }
    } else if (itemType === ITEM_TYPE.PROGRAM) {
      const payload = {
        program_id: itemDetail['id'],
        session_index: itemDetail['session_index'],
        video_index: itemDetail['video_index'],
      };
      const response = await apiProgramVideoComplete(payload);
      console_log('trackVideoComplete payload:::', payload, videoIsFocused);
      //console_log("trackVideoComplete response:::", response)
      if (response['data']) {
        trackSuccess = true;
        recent_activity = {...response['data']};
      }
    }
    if (trackSuccess) {
      dispatch(setRecentActivity(recent_activity));
    }
    return true;
  };
  ///////////////////////////////// end video track ///////////////////////////////////////////////

  const onClickVideoPlayPause = () => {
    console_log('itemType, itemDetail', itemType, itemDetail);

    //console_log("savedVideoList:::", savedVideoList)
    //console_log("downloadingVideoList:::", downloadingVideoList)

    if (placeholderMode) {
      goVideoScreen();
      return false;
    }

    if (!isVideoReady) {
      return false;
    }
    if (isVideoEnd) {
      videoRef.current.seek(0);
      setIsVideoEnd(false);
      setCurrentVideoDuration(0);
      setIsPaused(false);
    } else {
      if (isPaused) {
        setIsVideoTouched(false);
        releaseVideoFocus();
      }
      setIsPaused(!isPaused);
    }
    setShowPosterView(false);
  };

  const goVideoScreen = (auto_play = true) => {
    const playSetting = {
      autoPlay: auto_play,
      videoSourceType: videoSourceType,
    };
    const item = {
      source: source,
      poster: poster,
      title: title,
      itemType: itemType,
      itemDetail: itemDetail,
    };
    navigation.navigate(ROUTE_VIDEO_SCREEN, {
      item: item,
      playSetting: playSetting,
    });
  };

  const releaseVideoFocus = () => {
    setTimeout(function () {
      if (!isVideoTouched) {
        setIsVideoFocused(false);
        setIsVideoTouched(false);
      }
    }, 3000);
  };

  const applyVideoFocus = () => {
    setIsVideoFocused(true);
    setIsVideoTouched(true);
  };

  const onPressVideoFullScreen = or => {
    if (placeholderMode) {
      goVideoScreen(false);
      return false;
    }

    if (iPadTablet) {
      //if tablet full screen button should not work
      return false;
    }

    if (isVideoFullScreen) {
      // not fullscreen
      StatusBar.setHidden(false);

      // IF FULLSCREEN IS OFF, RELEASE THE ORIENTATION TO GO BACK TO ORIGINAL ORIENTATI0N
      Orientation.unlockAllOrientations();
    }
    if (!isVideoFullScreen) {
      // fullscreen
      StatusBar.setHidden(true);

      if (or === 'PORTRAIT') {
        // LOCK THE ORIENTATION TO LANDSCAPE WHEN FULLSCREEN EVEN IF IT WAS PORTRAIT
        Orientation.lockToLandscape();
        //...do more specific to portrait
      }
      if (or === 'LANDSCAPE') {
        // LOCK THE ORIENTATION TO LANDSCAPE WHEN FULLSCREEN
        Orientation.lockToLandscape();
        //...do more specific to landscape
      }
    }
  };

  ///////////////////////////// start download functions //////////////////////////////
  const onClickDownload = () => {
    const downloadUrl = source['uri'];
    if (empty(downloadUrl)) {
      return false;
    }
    const downloadFileName = getDownloadFileName();
    if (empty(downloadFileName)) {
      return false;
    }

    if (downloadStatus !== DOWNLOAD_STATUS.NONE) {
      return false;
    }

    let dirs = RNFetchBlob.fs.dirs;

    const row = {
      itemType: itemType,
      itemDetail: itemDetail,
      title: title,
      fileName: downloadFileName,
      filePath: '',
      poster: poster,
    };
    updateDownloadingVideoList({...row});
    const downloadDir =
      Platform.OS == 'android' ? dirs.SDCardApplicationDir : dirs.DocumentDir;

    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.
      path: downloadDir + '/videos/' + downloadFileName,
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch(
        'GET',
        downloadUrl, //https://2050today.org/wp-content/uploads/2020/07/Video-Placeholder.mp4
        {
          //some headers ..
        },
      )
      .then(res => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console_log('The file saved to ', res.path());

        toast.show({
          description: 'VIDEO DOWNLOADED',
        });

        const filePath = res.path();
        row['filePath'] = filePath;

        //console_log('saved item:: ', row)
        updateSavedVideoList({...row});
        removeItemFromDownloadingVideoList({...row});
      })
      .catch(err => {
        console_log('file download err:::', err);
        removeItemFromDownloadingVideoList({...row});
      });
  };

  const getDownloadFileName = () => {
    const downloadUrl = source['uri'];
    if (empty(downloadUrl)) {
      return false;
    }
    const downloadFileName = generateFileNameFromUrl(downloadUrl);
    return itemType + '_' + downloadFileName;
  };

  const updateSavedVideoList = row => {
    dispatch(addSavedVideoList(row));
  };

  const inSavedVideoList = (fileName, itemType, saved_video_list) => {
    for (let k in saved_video_list) {
      let row = saved_video_list[k];
      if (fileName === row['fileName'] && itemType === row['itemType']) {
        return k;
      }
    }
    return false;
  };

  const updateDownloadingVideoList = row => {
    const cur_timestamp = get_utc_timestamp();
    row['timestamp'] = cur_timestamp;
    dispatch(addDownloadingVideoList(row));
  };

  const removeItemFromDownloadingVideoList = row => {
    dispatch(removeDownloadingVideoList(row));
  };
  const trimDownloadingVideoList = () => {
    const cur_timestamp = get_utc_timestamp();
    const diff_seconds = 3600 * 2;
    let newDownloadingVideoList = [];
    for (let k in downloadingVideoList) {
      let row = downloadingVideoList[k];
      if (cur_timestamp < row['timestamp'] + diff_seconds) {
        newDownloadingVideoList.push(row);
      }
    }
    dispatch(setDownloadingVideoList(newDownloadingVideoList));
  };

  const inDownloadingVideoList = (fileName, itemType) => {
    for (let k in downloadingVideoList) {
      let row = downloadingVideoList[k];
      if (fileName === row['fileName'] && itemType === row['itemType']) {
        return k;
      }
    }
    return false;
  };
  ///////////////////////////// end download functions //////////////////////////////

  const onPressGoBack = () => {
    //StatusBar.setHidden(false);
    //Orientation.lockToPortrait();
    navigation.goBack();
  };

  const videoHeaders = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        return true;
      }}>
      <View
        style={{
          paddingHorizontal: 10,
          width: videoStyle.width,
          height: 35,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: placeholderMode
            ? 'rgba(0, 0, 0, 0)'
            : 'rgba(0, 0, 0, 0.5)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: videoZIndex,
        }}>
        {!placeholderMode && (
          <>
            <View>
              {showBackButton && (
                <TouchableOpacity
                  onPress={() => {
                    setIsVideoFullScreen(false);
                    if (originalOrientation === 'LANDSCAPE') {
                      onPressGoBack();
                    } else {
                      if (!Platform.isPad) {
                        Orientation.lockToPortrait();
                        setTimeout(() => {
                          onPressGoBack();
                          setTimeout(() => {
                            // REMOVE THE LOCK SO IT CAN CHANGE ORIENTATION AGAIN
                            Orientation.unlockAllOrientations();
                          }, 500);
                        }, 500);
                      } else {
                        onPressGoBack();
                      }
                    }
                  }}>
                  <Image
                    source={require('./images/back.png')}
                    style={{width: 18, height: 18}}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {showFullScreenButton && (
                <TouchableOpacity
                  onPress={() => {
                    setIsVideoFullScreen(prev => !prev);
                    setOriginalOrientation(appOrientation.orientation);
                    setTimeout(() => {
                      onPressVideoFullScreen(appOrientation.orientation);
                    }, 200);
                  }}>
                  <Image
                    source={
                      isVideoFullScreen
                        ? require('./images/exitFullScreen.png')
                        : require('./images/fullScreen.png')
                    }
                    style={{width: 18, height: 18}}
                  />
                </TouchableOpacity>
              )}

              {/**
               *  I HAD TO CONDITION IT BECAUSE THE FIX I IMPLEMENTED
               *  IN ANDROID DOES NOT WORK IN IOS . . iOS WORKS NORMALLY USING
               *  NORMAL IMPLEMENTATION WHILE GOOGLE HAS WEIRD ISSUE WITH CASTBUTTON
               */}
              {Platform.OS === 'android' ? (
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await GoogleCast.showCastDialog();
                    } catch (error) {
                      // do something here
                    }
                  }}>
                  <View style={{marginRight: 10, padding: 5}}>
                    <CastButton
                      style={{width: 24, height: 24, tintColor: 'white'}}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={{marginRight: 10, padding: 5}}>
                  <CastButton
                    style={{width: 24, height: 24, tintColor: 'white'}}
                  />
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const videoFooter = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        return true;
      }}>
      <View
        style={{
          paddingHorizontal: 10,
          width: videoStyle.width,
          height: 35,
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: placeholderMode
            ? 'rgba(0, 0, 0, 0)'
            : 'rgba(0, 0, 0, 0.5)',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: videoZIndex,
        }}>
        {!placeholderMode ? (
          <>
            <Text style={{color: 'white', fontSize: 12}}>
              {new Date(currentVideoDuration * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
            <Slider
              disabled={placeholderMode || !isVideoReady}
              maximumValue={videoDuration}
              minimumValue={0}
              minimumTrackTintColor="white"
              maximumTrackTintColor="gray"
              thumbTintColor="white"
              thumbStyle={{height: 12, width: 12}}
              trackStyle={{height: 1.8, width: videoStyle.width - 140}}
              useNativeDriver
              value={currentVideoDuration}
              onSlidingComplete={sliderData => {
                setCurrentVideoDuration(sliderData[0]);
                videoRef.current.seek(sliderData[0]);
              }}
            />
            <Text style={{color: 'white', fontSize: 12}}>
              <Text style={{color: 'white'}}>
                {' '}
                {new Date(videoDuration * 1000).toISOString().substr(14, 5)}
              </Text>
            </Text>
          </>
        ) : (
          <View></View>
        )}

        <TouchableOpacity
          onPress={() => {
            onClickDownload();
          }}>
          <MyDownloadIcon downloadStatus={downloadStatus} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoSeekingIncreaseButton = () => (
    <TouchableOpacity
      style={{
        height: videoStyle.height - 70,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        borderColor: 'red',
        position: 'absolute',
        right: 30,
        top: 35,
        bottom: 0,
        zIndex: videoZIndex,
      }}
      onPress={() => videoRef.current.seek(currentVideoDuration + 10)}>
      <Image
        source={require('./images/increase10Seconds.png')}
        resizeMode="contain"
        style={{width: 30, height: 30}}
      />
    </TouchableOpacity>
  );

  const videoSeekingDecreaseButton = () => (
    <TouchableOpacity
      style={{
        height: videoStyle.height - 70,
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        borderColor: 'red',
        position: 'absolute',
        left: 30,
        top: 35,
        bottom: 0,
        zIndex: videoZIndex,
      }}
      onPress={() => videoRef.current.seek(currentVideoDuration - 10)}>
      <Image
        source={require('./images/decrease10Seconds.png')}
        resizeMode="contain"
        style={{width: 30, height: 30}}
      />
    </TouchableOpacity>
  );

  const videoPlayLgButton = () => (
    <View
      style={{
        height: videoStyle.height - 70,
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        borderColor: 'red',
        position: 'absolute',
        left: 70,
        right: 70,
        top: 35,
        bottom: 0,
        zIndex: videoZIndex,
      }}>
      <TouchableOpacity
        style={{width: 70, height: 70}}
        onPress={() => {
          onClickVideoPlayPause();
        }}>
        <Image
          source={
            isPaused
              ? require('./images/play-lg.png')
              : require('./images/pause-lg.png')
          }
          resizeMode="contain"
          style={{width: 70, height: 70}}
        />
      </TouchableOpacity>
    </View>
  );

  const videoSettingsView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: videoZIndex,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowSettingsBottomSheet(false);
            setIsVideoFocused(true);
          }}>
          <Image
            source={require('./images/close.png')}
            style={{width: 20, height: 22}}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 170,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoQualitiesSettings(true);
            }}>
            <Image
              source={require('./images/quality.png')}
              style={{width: 26, height: 27}}
            />
            <Text style={{color: 'white', fontSize: 13}}>Quality</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoRateSettings(true);
            }}>
            <Image
              source={require('./images/speed.png')}
              style={{width: 20, height: 25}}
            />
            <Text style={{color: 'white', fontSize: 13}}>Speed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setIsShowSettingsBottomSheet(false);
              setIsShowVideoSoundSettings(true);
            }}>
            <Image
              source={require('./images/soundMixer.png')}
              style={{width: 20, height: 22}}
            />
            <Text style={{color: 'white', fontSize: 13}}>Sound</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoRateSettingView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: videoZIndex,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoRateSettings(false);
            setIsVideoFocused(true);
          }}>
          <Image
            source={require('./images/close.png')}
            style={{width: 20, height: 22}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoRateSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <Image
            source={require('./images/back.png')}
            style={{width: 23, height: 18}}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 230,
            height: 50,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(0.5);
            }}>
            {videoRate == 0.5 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 0.5 ? 3 : 0,
              }}>
              Slow
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(1);
            }}>
            {videoRate == 1 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 1 ? 3 : 0,
              }}>
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 70,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoRate(4);
            }}>
            {videoRate == 4 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoRate == 4 ? 3 : 0,
              }}>
              Fast
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoQualitiesSettingView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: videoZIndex,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoQualitiesSettings(false);
            setIsVideoFocused(true);
          }}>
          <Image
            source={require('./images/close.png')}
            style={{width: 20, height: 22}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoQualitiesSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <Image
            source={require('./images/back.png')}
            style={{width: 23, height: 18}}
          />
        </TouchableOpacity>

        <View
          style={{
            width: 260,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(144);
            }}>
            {videoQuality == 144 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 144 ? 3 : 0,
              }}>
              144p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(240);
            }}>
            {videoQuality == 240 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 240 ? 3 : 0,
              }}>
              240p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(360);
            }}>
            {videoQuality == 360 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 360 ? 3 : 0,
              }}>
              360p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(480);
            }}>
            {videoQuality == 480 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 480 ? 3 : 0,
              }}>
              480p
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: 260,
            marginTop: 15,
            borderWidth: 0,
            borderColor: 'red',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(720);
            }}>
            {videoQuality == 720 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 720 ? 3 : 0,
              }}>
              720p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(1080);
            }}>
            {videoQuality == 1080 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 1080 ? 3 : 0,
              }}>
              1080p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(1440);
            }}>
            {videoQuality == 1440 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 1440 ? 3 : 0,
              }}>
              1440p
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 60,
              height: 25,
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 4,
            }}
            onPress={() => {
              setVideoQuality(2160);
            }}>
            {videoQuality == 2160 && (
              <Image
                source={require('./images/dot.png')}
                style={{width: 10, height: 10}}
              />
            )}
            <Text
              style={{
                color: 'white',
                fontSize: 13,
                marginLeft: videoQuality == 2160 ? 3 : 0,
              }}>
              2160p
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoSoundView = () => (
    <TouchableWithoutFeedback>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0 ,0, 0,0.9)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: videoZIndex,
          ...videoStyle,
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoSoundSettings(false);
            setIsVideoFocused(true);
          }}>
          <Image
            source={require('./images/close.png')}
            style={{width: 20, height: 22}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: 10,
            top: 10,
          }}
          onPress={() => {
            setIsShowVideoSoundSettings(false);
            setIsShowSettingsBottomSheet(true);
          }}>
          <Image
            source={require('./images/back.png')}
            style={{width: 23, height: 18}}
          />
        </TouchableOpacity>

        <Slider
          //disabled={isRecordBeforePlay}
          maximumValue={1}
          minimumValue={0}
          step={0.1}
          minimumTrackTintColor="white"
          maximumTrackTintColor="gray"
          thumbTintColor="white"
          thumbStyle={{height: 12, width: 12}}
          trackStyle={{height: 1.8, width: videoStyle.width - 130}}
          useNativeDriver
          value={videoSound}
          onSlidingComplete={sliderData => {
            setVideoSound(Number(sliderData[0].toFixed(1)));
            if (sliderData[0] == 0) {
              setIsMuted(true);
            } else {
              setIsMuted(false);
            }
          }}
        />

        <Text style={{color: 'white'}}>{videoSound}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const videoSeekedLoader = () => (
    <View
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0 ,0, 0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color="white" size="large" />
    </View>
  );

  const videoErrorView = () => (
    <View
      style={{
        height: videoStyle.height,
        width: videoStyle.width,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0 ,0, 0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('./images/error.png')}
        style={{width: 30, height: 30}}
      />
      <Text style={{color: 'white', fontSize: 12, marginTop: 0}}>
        Error when load video
      </Text>
    </View>
  );

  const videoPosterView = () => (
    <>
      <Image
        source={{
          uri: playlistSelectedVideo
            ? playlistSelectedVideo.poster
              ? playlistSelectedVideo.poster
              : ''
            : poster,
        }}
        resizeMode="cover"
        style={{
          height: videoStyle.height,
          width: videoStyle.width,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <View
        style={{
          height: videoStyle.height,
          width: videoStyle.width,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: placeholderMode
            ? 'rgba(0, 0, 0, 0.15)'
            : 'rgba(0, 0, 0, 0)',
        }}
      />
    </>
  );

  const videoPlaylistView = () => {
    // console.log(
    //   'INDEX OF LIST  ',
    //   playlistSelectedVideo && playlistSelectedVideo.index > 0
    //     ? playlistSelectedVideo.index - 1
    //     : 0,
    // );
    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0 ,0, 0,0.9)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: videoZIndex,
            ...videoStyle,
          }}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: 10,
              top: 10,
            }}
            onPress={() => {
              setIsShowVideoPlaylist(false);
              setIsVideoFocused(true);
            }}>
            <Image
              source={require('./images/close.png')}
              style={{width: 20, height: 22}}
            />
          </TouchableOpacity>

          <View
            style={{
              marginVertical: 5,
              height: playlistSelectedVideo ? 140 : 120,
              marginHorizontal: 20,
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
              initialScrollIndex={
                playlistSelectedVideo && playlistSelectedVideo.index > 0
                  ? playlistSelectedVideo.index - 1
                  : 0
              }
              keyExtractor={(item, index) => index}
              data={playList}
              renderItem={({item, index}) => {
                const isSelected = playlistSelectedVideo
                  ? playlistSelectedVideo.url == item.url
                    ? true
                    : false
                  : false;
                return (
                  <TouchableOpacity
                    style={{
                      marginRight: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: isSelected ? 150 : 130,
                      height: isSelected ? 140 : 120,
                    }}
                    onPress={() => {
                      if (isSelected) {
                        setIsPaused(!isPaused);
                        setIsShowVideoPlaylist(false);
                      } else {
                        videoRef.current.seek(0);
                        setPlaylistSelectedVideo({...item, index: index});
                        setIsPaused(false);
                        setIsShowVideoPlaylist(false);
                        setIsVideoFocused(true);
                      }
                    }}>
                    <Image
                      source={{uri: item.poster}}
                      resizeMode="stretch"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: isSelected ? 150 : 130,
                        height: isSelected ? 140 : 120,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: 'white',
                      }}
                    />
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: '#900C3F',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: videoZIndex,
                      }}>
                      <Image
                        source={
                          isSelected
                            ? isPaused
                              ? require('./images/play.png')
                              : require('./images/pause.png')
                            : require('./images/play.png')
                        }
                        style={{width: 17, height: 17}}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const videoCoverView = () => (
    <TouchableWithoutFeedback>
      <ImageBackground
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: videoZIndex,
          ...videoStyle,
        }}
        source={require('./images/blur.png')}>
        <Image
          source={require('./images/eye.png')}
          style={{height: 70, width: 100}}
        />

        <TouchableOpacity
          style={{
            width: 80,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0 ,0, 0,0.5)',
            marginTop: 20,
            borderRadius: 5,
          }}
          onPress={() => {
            setIsVideoFocused(true);
            setIsVideoCovered(false);
          }}>
          <Text style={{color: 'white'}}>Uncover</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        // console.log('TOUCH');
        setIsVideoFocused(!isVideoFocused);
        setIsVideoTouched(true);
      }}>
      <View style={videoStyle}>
        <Video
          style={{flex: 1}}
          posterResizeMode="cover"
          resizeMode="cover"
          bufferConfig={{
            minBufferMs: 1000 * 60,
            bufferForPlaybackMs: 1000 * 60,
            bufferForPlaybackAfterRebufferMs: 1000 * 60,
          }}
          ref={videoRef}
          source={
            playlistSelectedVideo ? {uri: playlistSelectedVideo.url} : source
          }
          paused={isPaused}
          muted={isMuted}
          rate={videoRate}
          selectedVideoTrack={{
            type: 'resolution',
            value: videoQuality,
          }}
          volume={videoSound}
          playInBackground={playInBackground}
          onLoad={videoData => {
            setIsVideoReady(true);
            setVideoDuration(videoData.duration);
            setIsVErrorInLoadVideo(false);
          }}
          onProgress={async videoData => {
            // LOG EVENT OF PLAYTIME EXCEEDS 30sec
            if (videoData.currentTime >= 30 && videoData.currentTime < 31) {
              await analytics().logEvent(`Watch Video | ${title}`, props);
            }
            setCurrentVideoDuration(videoData.currentTime);
          }}
          /*onSeek={()=>{
            if(Platform.OS=='android'){
              setIsVideoSeeked(true)
            }
          }}
          onReadyForDisplay={()=>{
            console.log("onReadyForDisplay")
            setIsVideoSeeked(false)
            setIsVErrorInLoadVideo(false)
          }}*/
          onError={videoData => {
            console_log('videoDataError:::', videoData);
            setIsVErrorInLoadVideo(true);
          }}
          onEnd={() => {
            // console.log('on end');
            setIsVideoEnd(true);
            setIsPaused(true);
            setCurrentVideoDuration(videoDuration);
            applyVideoFocus();
            setShowPosterView(true);
            // if (playList.length > 0) {videoDuration
            //   setIsShowVideoPlaylist(true)
            // }
          }}
        />
        {(currentVideoDuration == 0 || showPosterView) &&
          poster &&
          videoPosterView()}
        {isVideoFocused && showHeader && videoHeaders()}
        {isVideoFocused &&
          showSeeking10SecondsButton &&
          !isErrorInLoadVideo &&
          !placeholderMode &&
          videoSeekingIncreaseButton()}
        {isVideoFocused &&
          showSeeking10SecondsButton &&
          !isErrorInLoadVideo &&
          !placeholderMode &&
          videoSeekingDecreaseButton()}
        {isVideoFocused && videoPlayLgButton()}
        {isVideoFocused && videoFooter()}
        {isShowSettingsBottomSheet && videoSettingsView()}
        {isShowVideoRateSettings && videoRateSettingView()}
        {isShowVideoSoundSettings && videoSoundView()}
        {isShowVideoQualitiesSettings && videoQualitiesSettingView()}
        {isVideoSeeked && videoSeekedLoader()}
        {isErrorInLoadVideo && videoErrorView()}
        {/* {(playList.length > 0 && isShowVideoPlaylist) && videoPlaylistView()} */}
        {isVideoCovered && videoCoverView()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MoVideoPlayer;
