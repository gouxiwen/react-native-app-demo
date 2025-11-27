import * as React from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useWindowDimensions } from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
  TabDescriptor,
  Route,
} from 'react-native-tab-view';
import { fetchGetAiImg } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import { downloadImage } from '../common/camera';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

function AiImageScreen({ type = 'head' }: { type?: string }) {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showBottom, setShowBottom] = React.useState(false);
  const toggle = () => setShowBottom(prev => !prev); // 切换显示状态的方法
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
          setModalVisible(!modalVisible);
        }}
        onPress={toggle}
      >
        <FastImage
          style={styles.image}
          source={{ uri: imageUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.buttonWrapBottom,
          {
            opacity: showBottom ? 0.6 : 0,
            transitionProperty: ['opacity'],
            transitionDuration: 100,
          },
        ]}
      >
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
      </Animated.View>
    </CustomSafeAreaViws>
  );
}

const renderTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<Route>;
    options: Record<string, TabDescriptor<Route>> | undefined;
  },
) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#fff' }}
    style={{ backgroundColor: primaryColor }}
  />
);

const renderScene = SceneMap({
  // AiImageScreen: () => <AiImageScreen />,
  HeadImageScreen: () => <AiImageScreen type="head" />,
  WallPaperImageScreen: () => <AiImageScreen type="wallpaper" />,
});

const routes = [
  // { key: 'AiImageScreen', title: 'AI图片' },
  { key: 'HeadImageScreen', title: '头像' },
  { key: 'WallPaperImageScreen', title: '壁纸' },
];

function ImageScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [isFocused, setIsFocused] = React.useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, []),
  );

  return (
    <>
      {isFocused && (
        <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      )}
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}

export default ImageScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    backgroundColor: '#000',
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
    width: 'auto',
    height: 'auto',
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  buttonWrapBottom: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
