import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  CameraPermissionRequestResult,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { primaryColor } from '../common/const';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import ZoomCamra from '../components/CameraZoom';

const AnimatedText = Animated.createAnimatedComponent(TextInput);

export default function CameraExamplesScreen() {
  const camera = useRef<Camera>(null);
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionRequestResult>();
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [currentExample, setCurrentExample] = useState('take-photo');
  const [photoPath, setPhotoPath] = useState('');
  const [snapshotPath, setSnapshotPath] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const detectorResult = useSharedValue('扫码结果');

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      console.log('cameraPermissionStatus', cameraPermissionStatus);
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  const cameraDevice = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`, codes);
      detectorResult.value = codes[0]?.value ?? '';
    },
  });

  const animatedTextProps = useAnimatedProps(
    () => ({ text: detectorResult.value }),
    [detectorResult.value],
  );

  const format = useCameraFormat(cameraDevice, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 60 },
  ]);

  if (!cameraDevice) return '没有找到相机';
  const handleTakePhoto = async () => {
    if (!camera.current) return;
    try {
      const photo = await camera.current?.takePhoto({
        flash: 'off',
      });
      setPhotoPath(photo.path);
    } catch (e) {
      console.log(e);
    }
  };

  const renderTakingPhoto = () => {
    return (
      <View>
        <View style={[styles.camera, styles.photoAndVideoCamera]}>
          <ZoomCamra
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={cameraDevice}
            isActive
            photo
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleTakePhoto}>
          <Text style={styles.btnText}>拍照</Text>
        </TouchableOpacity>
        {photoPath && (
          <FastImage
            style={styles.image}
            source={{
              uri: `file://${photoPath}`,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
      </View>
    );
  };

  const handleRecordVideo = async () => {
    if (!camera.current) return;
    try {
      camera.current.startRecording({
        flash: 'off',
        onRecordingFinished: video => setVideoPath(video.path),
        onRecordingError: error => console.error(error),
      });
      setRecording(true);
    } catch (e) {
      console.log(e);
      setRecording(false);
    }
  };

  const handleStopVideo = async () => {
    if (!camera.current) return;
    try {
      await camera.current.stopRecording();
      setRecording(false);
    } catch (e) {
      console.log(e);
    }
  };

  const renderRecordingVideo = () => {
    return (
      <View>
        <View style={[styles.camera, styles.photoAndVideoCamera]}>
          <ZoomCamra
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={cameraDevice}
            isActive
            video
          />
        </View>
        <View style={styles.btnGroup}>
          {!recording ? (
            <TouchableOpacity style={styles.btn} onPress={handleRecordVideo}>
              <Text style={styles.btnText}>开始录像</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ ...styles.btn }}
              onPress={handleStopVideo}
            >
              <Text style={styles.btnText}>停止录像</Text>
            </TouchableOpacity>
          )}
        </View>
        {videoPath && (
          <Video source={{ uri: videoPath }} style={styles.video} />
        )}
      </View>
    );
  };

  const handleTakeSnapshot = async () => {
    if (!camera.current) return;
    try {
      const snapshot = await camera.current.takeSnapshot({
        quality: 85,
      });
      setSnapshotPath(snapshot.path);
    } catch (e) {
      console.log(e);
    }
  };

  const renderTakingSnapshot = () => {
    return (
      <View>
        <View style={[styles.camera, styles.photoAndVideoCamera]}>
          <ZoomCamra
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={cameraDevice}
            isActive
            photo
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleTakeSnapshot}>
          <Text style={styles.btnText}>拍快照</Text>
        </TouchableOpacity>
        {snapshotPath && (
          <FastImage
            style={styles.image}
            source={{
              uri: `file://${snapshotPath}`,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}
      </View>
    );
  };

  const renderCodeScanner = () => {
    return (
      <View>
        <AnimatedText
          style={styles.barcodeText}
          animatedProps={animatedTextProps as any}
          editable={false}
          multiline
        />
        <View style={styles.camera}>
          <ZoomCamra
            style={StyleSheet.absoluteFill}
            device={cameraDevice}
            isActive
            codeScanner={codeScanner}
            format={format}
            fps={5}
          />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (cameraDevice === null) {
      return <ActivityIndicator size="large" color={primaryColor} />;
    }
    if (cameraPermission !== 'granted') {
      return null;
    }
    switch (currentExample) {
      case 'take-photo':
        return renderTakingPhoto();
      case 'record-video':
        return renderRecordingVideo();
      case 'take-snapshot':
        return renderTakingSnapshot();
      case 'code-scanner':
        return renderCodeScanner();
      default:
        return null;
    }
  };

  const handleChangePicketSelect = (value: any) => {
    setPhotoPath('');
    setSnapshotPath('');
    setVideoPath('');
    setCurrentExample(value);
  };

  return (
    <CustomSafeAreaViws>
      <View style={styles.screen}>
        <View style={styles.dropdownPickerWrapper}>
          <DropDownPicker
            open={open}
            value={currentExample}
            items={[
              { label: '拍照', value: 'take-photo' },
              { label: '录像', value: 'record-video' },
              { label: '快照', value: 'take-snapshot' },
              { label: '扫码', value: 'code-scanner' },
            ]}
            setOpen={setOpen}
            setValue={handleChangePicketSelect}
          />
        </View>
        {renderContent()}
      </View>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
    padding: 16,
  },
  camera: {
    height: 550,
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  photoAndVideoCamera: {
    height: 450,
  },
  barcodeText: {
    padding: 16,
    textAlign: 'center',
    color: primaryColor,
    fontSize: 24,
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: 10,
  },
  pickerSelect: {
    paddingVertical: 12,
  },
  image: {
    marginHorizontal: 16,
    paddingTop: 8,
    width: 80,
    height: 80,
  },
  dropdownPickerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 9,
  },
  btnGroup: {
    gap: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: primaryColor,
    margin: 13,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  video: {
    marginHorizontal: 16,
    height: 100,
    width: 80,
    position: 'absolute',
    right: 0,
    bottom: -80,
  },
});
