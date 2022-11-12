/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';

async function isPermission() {
  return await Geolocation.requestAuthorization('whenInUse');
}

// interface GPS {
//   latitude: number;
//   longitude: number;
// }

const App = () => {
  // const [location, setLocation] = useState<GPS>({ latitude: -1, longitude: -1 });
  const webView = useRef<WebView>(null);

  useEffect(() => {
    isPermission().then((res) => {
      if (res === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            // setLocation({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            // });
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log(location);
            // webView.current?.injectJavaScript(`
            // alert("${location.latitude}, ${location.longitude}");
            // true;
            // `);
            webView.current?.postMessage(JSON.stringify(location));
            SplashScreen.hide();
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
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView ref={webView} source={{ uri: 'http://localhost:3000/login' }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
