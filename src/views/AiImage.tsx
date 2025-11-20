import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { fetchGetAiImg } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import { downloadImage } from '../common/cameraRoll';

function AiImageScreen() {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const getImageUrl = async () => {
    setLoading(true);
    const res: any = await fetchGetAiImg();
    setLoading(false);
    setImageUrl(res);
  };
  React.useEffect(() => {
    getImageUrl();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={primaryColor}
        size="large"
      />
    );
  return (
    <CustomSafeAreaViws>
      <TouchableWithoutFeedback onLongPress={() => downloadImage(imageUrl)}>
        <FastImage
          style={styles.image}
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
      <Button title="更新图片" onPress={getImageUrl} />
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '80%',
  },
});

export default AiImageScreen;
