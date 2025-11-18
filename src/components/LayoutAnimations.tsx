import React, { useState } from 'react';
import {
  //   NativeModules,
  UIManager,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

//   LayoutAnimation 允许你全局配置 create 和 update 动画，这些动画将用于下一个渲染/布局周期中的所有视图
export default function LayoutAnimations() {
  const [state, setState] = useState({
    w: 100,
    h: 100,
  });

  const onPress = () => {
    // Animate the update
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring); // 布局发生变化时触发弹簧动画效果
    setState({ w: state.w + 15, h: state.h + 15 });
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={[styles.box, { width: state.w, height: state.h }]} />
      <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Press me!</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
