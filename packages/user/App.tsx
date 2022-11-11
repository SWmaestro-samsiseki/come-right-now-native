/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import { WebView } from 'react-native-webview';

async function isPermission() {
  return await Geolocation.requestAuthorization('whenInUse');
}

const App = () => {
  useEffect(() => {
    isPermission().then((res) => {
      if (res === 'granted') {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
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
      <WebView source={{ uri: 'http://localhost:3000/login' }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
