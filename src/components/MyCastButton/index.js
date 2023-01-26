import React, { useEffect } from 'react';

import GoogleCast, { useDevices, useCastDevice, CastButton, useRemoteMediaClient } from 'react-native-google-cast'
import { console_log } from '../../utils/Misc';

const MyCastButton = (props) => {
  const { item, buttonStyle } = props
  const client = useRemoteMediaClient()

  //console_log("MyCastButton:::")

  useEffect(() => {
     //GoogleCast.showCastDialog()
     GoogleCast.showIntroductoryOverlay({once: true})
  }, []);

  useEffect(() => {
    loadRemoteClientMedia()
  }, [item]);

  const loadRemoteClientMedia = () => {
    // This will automatically rerender when client is connected to a device
    // (after pressing the button that's rendered below)
    console_log("client::::", client)

    if (client) {
      // Send the media to your Cast device as soon as we connect to a device
      // (though you'll probably want to call this later once user clicks on a video or something)
      client.loadMedia({
        mediaInfo: {
          contentUrl: item.uri ? item.uri : item.uri,
          contentType: 'video/mp4',
        },
      })
    }
  }

  // This will render native Cast button.
  // When a user presses it, a Cast dialog will prompt them to select a Cast device to connect to.
  return <CastButton style={{ width: 24, height: 24, tintColor: 'white', ...buttonStyle }} />
}

export default MyCastButton;