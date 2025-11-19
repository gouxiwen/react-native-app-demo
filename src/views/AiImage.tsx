import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { fetchGetAiImg } from '../services/http';

function AiImageScreen() {
  const insets = useSafeAreaInsets();
  const [imageUrl, setImageUrl] = React.useState<string>();

  const getImageUrl = async () => {
    const res: any = await fetchGetAiImg();
    setImageUrl(res);
  };
  React.useEffect(() => {
    getImageUrl();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <FastImage
        style={styles.image}
        source={{ uri: imageUrl, priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Button title="更新图片" onPress={getImageUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '80%',
  },
});

export default AiImageScreen;
