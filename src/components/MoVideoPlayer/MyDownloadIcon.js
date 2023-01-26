import React, { useEffect, useRef, useState } from 'react';

import { console_log } from '../../utils/Misc';
import { ImageBackground, Image, Animated } from 'react-native';
import { DOWNLOAD_STATUS } from '../../utils/Constants';
import { Easing } from 'react-native';
import MyDownloadingAnimationIcon from './MyDownloadingAnimationIcon';

const MyDownloadIcon = (props) => {
  const { downloadStatus } = props;
  return (
    <>
      {
        (downloadStatus === DOWNLOAD_STATUS.NONE) ? (
          <>
            <Image
              source={require('./images/download.png')}
              style={{ width: 17, height: 17 }}
            />
          </>
        ) : (downloadStatus === DOWNLOAD_STATUS.DOWNLOADING ?
          (
            <>
              <MyDownloadingAnimationIcon
              />
            </>
          ) : (
            <>
              <Image
                source={require('./images/downloaded.png')}
                style={{ width: 17, height: 17 }}
              />
            </>
          ))
      }
    </>
  )
}

export default MyDownloadIcon;
