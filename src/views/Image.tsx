import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { fetchGetAiImg } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import { downloadImage } from '../common/camera';

function AiImageScreen({ type = 'ai' }: { type?: string }) {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const getImageUrl = async () => {
    setLoading(true);
    const res: any = await fetchGetAiImg(type);
    setLoading(false);
    setImageUrl(res);
  };
  React.useEffect(() => {
    getImageUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downImage = () => {
    Alert.alert(
      '提示',
      '是否将图片保存到相册',
      [
        {
          text: '取消',
          onPress: () => console.log('取消按钮被点击'),
          style: 'cancel', // ios样式
        },
        {
          text: '确定',
          onPress: () => downloadImage(imageUrl),
        },
      ],
      { cancelable: false },
    );
  };

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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>保存图片到相册</Text>
            <View style={styles.buttonWrap}>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>取消</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => {
                  downloadImage(imageUrl);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>保存</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback
        onLongPress={() => {
          console.log('long');

          setModalVisible(!modalVisible);
        }}
      >
        <FastImage
          style={styles.image}
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
        <View style={styles.buttonWrap}>
          <Pressable
            style={[styles.button, styles.buttonConfirm]}
            onPress={getImageUrl}
          >
            <Text style={styles.textStyle}>更新图片</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonConfirm]}
            onPress={downImage}
          >
            <Text style={styles.textStyle}>保存图片</Text>
          </Pressable>
        </View>
      </View>
    </CustomSafeAreaViws>
  );
}

const renderScene = SceneMap({
  AiImageScreen: () => <AiImageScreen />,
  HeadImageScreen: () => <AiImageScreen type="head" />,
  WallPaperImageScreen: () => <AiImageScreen type="wallpaper" />,
});

const routes = [
  { key: 'AiImageScreen', title: 'AI图片' },
  { key: 'HeadImageScreen', title: '头像' },
  { key: 'WallPaperImageScreen', title: '壁纸' },
];

function ImageScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default ImageScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonWrap: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonConfirm: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
