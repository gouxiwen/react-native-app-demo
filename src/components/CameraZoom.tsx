import { Camera, CameraProps } from 'react-native-vision-camera';
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { StyleSheet, Text } from 'react-native';
import { forwardRef } from 'react';

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export default forwardRef(function ZoomCamra(props: CameraProps, ref) {
  const device = props.device;
  const zoom = useSharedValue(device?.neutralZoom);
  const zoomOffset = useSharedValue(0);
  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value as number;
    })
    .onUpdate(event => {
      if (device == null) return;
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device.minZoom, device.maxZoom],
        Extrapolation.CLAMP,
      );
    });

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom],
  );

  if (device == null) return <Text>没有找到相机</Text>;
  return (
    <GestureDetector gesture={gesture}>
      <ReanimatedCamera
        {...props}
        ref={ref as any}
        style={StyleSheet.absoluteFill}
        device={device}
        animatedProps={animatedProps}
      />
    </GestureDetector>
  );
});
