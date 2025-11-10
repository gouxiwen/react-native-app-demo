import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import WebView from '../specs/WebViewNativeComponent';

function NativeComponentDemo(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <WebView
        sourceURL="https://www.baidu.com/"
        style={styles.webview}
        onScriptLoaded={() => {
          Alert.alert('Page Loaded');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});

export default NativeComponentDemo;
