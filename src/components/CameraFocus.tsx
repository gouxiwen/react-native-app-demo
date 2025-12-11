import { Camera, Point, useCameraDevice } from 'react-native-vision-camera';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { StyleSheet, Text } from 'react-native';
import { useCallback, useRef } from 'react';

export default function CameraFocus() {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  const focus = useCallback((point: Point) => {
    const c = camera.current;
    if (c == null) return;
    c.focus(point);
  }, []);

  const gesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  if (device == null) return <Text>没有找到相机</Text>;
  return (
    <GestureDetector gesture={gesture}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </GestureDetector>
  );
}
