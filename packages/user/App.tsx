import React, { useState, useEffect, useRef, RefObject } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// 위치에 대한 인터페이스
interface Location {
  latitude: number;
  longitude: number;
}

// 위치권한을 얻어오는 함수
async function getPermission() {
  return await Geolocation.requestAuthorization('whenInUse');
}

// 위치를 얻어와서 지정하는 함수
const setPosition = (setter: React.Dispatch<React.SetStateAction<Location | undefined>>) => {
  Geolocation.getCurrentPosition(
    (response) => {
      setter({
        latitude: response.coords.latitude,
        longitude: response.coords.longitude,
      });
    },
    (err) => {
      console.log(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    },
  );
};

// 웹뷰로 메세지를 보내는 함수
const postMessage = (target: RefObject<WebView<{}>>, value: any) => {
  if (target.current !== null) {
    target.current.postMessage(
      JSON.stringify({
        type: 'native',
        value: {
          type: 1,
          value: value,
        },
      }),
    );
  } else {
    console.log('아직 웹뷰가 활성화되지 않았습니다.');
  }
};

const App = () => {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const webView = useRef<WebView>(null);

  // 웹뷰에서 보낸 메세지를 console에 출력하는 함수
  const onMessage = (e: WebViewMessageEvent) => {
    if (Number(e.nativeEvent.data) === 1) {
      postMessage(webView, location);
    } else {
      // 그 외의 메세지 처리
    }
  };

  useEffect(() => {
    getPermission().then((res) => {
      if (res === 'granted') {
        setPosition(setLocation);
        SplashScreen.hide();
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView ref={webView} source={{ uri: 'http://user.jigeumgo.com/' }} onMessage={onMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
