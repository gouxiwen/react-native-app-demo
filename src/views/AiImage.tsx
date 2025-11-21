import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { fetchGetAiImg } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import { downloadImage } from '../common/camera';

function AiImageScreen() {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const getImageUrl = async () => {
    setLoading(true);
    const res: any = await fetchGetAiImg();
    setLoading(false);
    setImageUrl(res);
  };
  React.useEffect(() => {
    getImageUrl();
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
            <Pressable
              style={[styles.button]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>取消</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                downloadImage(imageUrl);
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>保存</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback
        onLongPress={() => setModalVisible(!modalVisible)}
      >
        <FastImage
          style={styles.image}
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
          gap: 20,
        }}
      >
        <Button title="更新图片" onPress={getImageUrl} />
        <Button title="保存图片" onPress={downImage} />
      </View>
    </CustomSafeAreaViws>
  );
}

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
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AiImageScreen;
