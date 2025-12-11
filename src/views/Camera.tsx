import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
// import ZoomCamra from '../components/CameraZoom';
import CameraFocus from '../components/CameraFocus';

function PermissionsPage({
  setIsPermissionGranted,
}: {
  setIsPermissionGranted: (isPermissionGranted: boolean) => void;
}) {
  const { requestPermission } = useCameraPermission();

  function handlePress() {
    requestPermission().then(success => {
      if (success) setIsPermissionGranted(true);
    });
  }
  return (
    <View>
      <Text>PermissionsPage</Text>
      <Button title="申请权限" onPress={handlePress} />
    </View>
  );
}
function CameraScreen() {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const [isPermissionGranted, setIsPermissionGranted] = useState(hasPermission);

  if (!isPermissionGranted) {
    return <PermissionsPage setIsPermissionGranted={setIsPermissionGranted} />;
  }
  if (device == null) return <Text>没有找到相机</Text>;
  return (
    // 基础功能
    // <Camera
    //   style={StyleSheet.absoluteFill}
    //   device={device}
    //   isActive={true}
    //   photo={true}
    // />
    // 变焦功能
    // <ZoomCamra />
    // 聚焦功能
    <CameraFocus />
  );
}

export default CameraScreen;
