import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { fetchGetAiImg } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';

function AiImageScreen() {
  const [imageUrl, setImageUrl] = React.useState<string>();

  const getImageUrl = async () => {
    const res: any = await fetchGetAiImg();
    setImageUrl(res);
  };
  React.useEffect(() => {
    getImageUrl();
  }, []);

  return (
    <CustomSafeAreaViws>
      <FastImage
        style={styles.image}
        source={{ uri: imageUrl, priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.contain}
      />
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
