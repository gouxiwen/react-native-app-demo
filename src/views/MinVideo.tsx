import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  View,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
  ViewToken,
  StatusBar,
  GestureResponderEvent,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import { fetchGetMinVideo } from '../services/http';
import FastImage from 'react-native-fast-image';
import { CommonNavigationProps, VideoItemType } from '../../global';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import Video from 'react-native-video';
// @ts-ignore: no type declarations for 'react-native-video-controls'
import Video from 'react-native-video-controls';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AntDesign from '@react-native-vector-icons/ant-design';
import Toast from 'react-native-simple-toast';
import { primaryColor } from '../common/const';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  userInfo: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  videoCover: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  footer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

const statusBarHeight = StatusBar.currentHeight || 0; // 输出自定义状态栏高度，和原生状态栏有6像素误差，即下面的difference值
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
let difference = statusBarHeight - (screenHeight - windowHeight); // 包含状态栏和导航栏高度之和
difference = difference < 0 ? 0 : difference; // 安卓某些机型会出现负数情况

function ModelChangeBtn({
  show,
  onLongPress,
}: {
  show: boolean;
  onLongPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableWithoutFeedback onLongPress={onLongPress}>
      {/* video组件会拦截点击事件 */}
      <View
        style={{
          position: 'absolute',
          width: 30,
          height: 30,
          top: 100,
          right: 10,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {show ? <AntDesign name="bars" color={primaryColor} size={30} /> : ''}
      </View>
    </TouchableWithoutFeedback>
  );
}

function VideoItemFullScreen({
  item,
  index,
  state,
  height,
  onPress,
}: {
  item: VideoItemType;
  index: number;
  state: any;
  height: number;
  onPress: (event: GestureResponderEvent) => void;
}) {
  const { width } = useWindowDimensions();
  const handlePause = (event: GestureResponderEvent) => {
    Toast.showWithGravity(
      '长按右侧按钮可以切换为列表模式哦~',
      Toast.LONG,
      Toast.SHORT,
    );
    onPress(event);
  };
  return (
    <View
      style={{
        width: width,
        height: height,
      }}
    >
      <View style={{ flex: 1, position: 'relative' }}>
        <Video
          source={{ uri: item.playUrl }}
          style={{ flex: 1, backgroundColor: '#000' }}
          repeat
          paused={index === state.current ? state.isPause : true}
          resizeMode="contain"
          onPlay={onPress}
          onShowControls={handlePause}
          showOnStart={false}
          showBackButton={false}
          showFullscreenButton={false}
          tapAnywhereToPause
          disablePlayPause
          controlTimeout={2000}
        />
        <TouchableWithoutFeedback onPress={onPress}>
          <View
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
              zIndex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {state.isPause ? (
              <AntDesign name="play-circle" color="#fff" size={50} />
            ) : (
              ''
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
function VideoItem({ item }: { item: VideoItemType }) {
  const navigation = useNavigation<CommonNavigationProps>();
  return (
    <Pressable onPress={() => navigation.navigate('VideoPlayer', item)}>
      <View style={styles.item}>
        <View style={styles.userInfo}>
          <FastImage
            style={styles.avatar}
            source={{
              uri: item.userPic,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <FastImage
          style={styles.videoCover}
          source={{ uri: item.coverUrl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    </Pressable>
  );
}

function MinVideoScreen() {
  const { height: usewindowHeight } = useWindowDimensions(); // 不包含状态栏高度
  const tabBarHeight = useBottomTabBarHeight();
  const height = usewindowHeight - tabBarHeight - difference;
  const [refreshing, setRefreshing] = React.useState(false);
  const [listMode, setListMode] = React.useState(false);
  const listModeRef = React.useRef<FlatList<VideoItemType>>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const pageSize = 20;
  const pageNo = React.useRef(0);
  const totalPage = React.useRef(0);
  const [data, setData] = React.useState<Array<VideoItemType>>([]);
  const [showFoot, setShowFoot] = React.useState(0);
  const [state, setState] = React.useState({
    isPause: false, //控制播放器是否停止播放
    current: 0, //表示当前item的索引，通过这个实现一个state控制全部的播放器
  });
  function getVideoList() {
    return fetchGetMinVideo({ page: pageNo.current, size: pageSize })
      .then((res: any) => {
        if (res.code === 200) {
          totalPage.current = res.result.total;
          if (pageNo.current === 0) setData(res.result.list);
          else setData(prevData => [...prevData, ...res.result.list]);
          if (pageNo.current >= totalPage.current) {
            setShowFoot(1);
          } else {
            setShowFoot(0);
          }
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
  }
  React.useEffect(() => {
    getVideoList();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setState(pre => ({
        ...pre,
        isPause: false,
      }));
      setIsFocused(true);
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setState(pre => ({
          ...pre,
          isPause: true,
        }));
        setIsFocused(false);
      };
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    pageNo.current = 0;
    setShowFoot(0);
    getVideoList();
  }, []);

  function _onEndReached() {
    //如果是正在加载中或没有更多数据了，则返回
    if (showFoot !== 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (pageNo.current !== 1 && pageNo.current >= totalPage.current) {
      return;
    } else {
      pageNo.current++;
    }
    //底部显示正在加载更多数据
    setShowFoot(2);
    //获取数据
    getVideoList();
  }

  function _renderFooter() {
    if (showFoot === 1) {
      return (
        <View
          style={{
            height: 30,
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Text
            style={{
              color: '#999999',
              fontSize: 14,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            没有更多数据了
          </Text>
        </View>
      );
    } else if (showFoot === 2) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator />
          <Text>正在加载更多数据...</Text>
        </View>
      );
    } else if (showFoot === 0) {
      return <View style={styles.footer}>{/* <Text></Text>  */}</View>;
    }
  }

  function _onViewableItemsChanged({
    viewableItems,
  }: // changed,
  {
    changed: ViewToken[];
    viewableItems: ViewToken[];
  }) {
    //这个方法为了让state对应当前呈现在页面上的item的播放器的state
    //也就是只会有一个播放器播放，而不会每个item都播放
    //可以理解为，只要不是当前再页面上的item 它的状态就应该暂停
    //只有100%呈现再页面上的item（只会有一个）它的播放器是播放状态

    if (viewableItems.length === 1) {
      setState(pre => ({
        ...pre,
        isPause: false,
        current: viewableItems[0]?.index as number,
      }));
      if (viewableItems[0]?.index === data.length - 1) {
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if (pageNo.current !== 1 && pageNo.current >= totalPage.current) {
          return;
        } else {
          pageNo.current++;
        }
        getVideoList();
      }
    }
  }

  React.useEffect(() => {
    if (listMode) {
      listModeRef.current?.scrollToIndex({
        index: state.current,
        animated: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listMode]);

  const VIEWABILITY_CONFIG = {
    viewAreaCoveragePercentThreshold: 80, //item滑动80%部分才会到下一个
  };
  if (!data.length)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={primaryColor}
        size="large"
      />
    );
  if (listMode) {
    return (
      <>
        <FlatList
          ref={listModeRef}
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReachedThreshold={0.5}
          onEndReached={_onEndReached}
          ListFooterComponent={_renderFooter}
          data={data}
          renderItem={({ item }) => <VideoItem item={item} />}
          keyExtractor={item => item.id.toString()}
          onViewableItemsChanged={({ viewableItems }) => {
            if (viewableItems.length > 0) {
              setState(pre => ({
                ...pre,
                current: viewableItems[0]?.index as number,
              }));
            }
          }}
        />
        <ModelChangeBtn
          onLongPress={() => setListMode(false)}
          show={state.isPause}
        />
      </>
    );
  }
  return (
    <>
      {isFocused && (
        <StatusBar backgroundColor="#000" barStyle="light-content" />
      )}
      <FlatList
        contentContainerStyle={{}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        renderItem={props => (
          <VideoItemFullScreen
            {...props}
            state={state}
            height={height}
            onPress={() => {
              setState(pre => ({
                ...pre,
                isPause: !pre.isPause,
              }));
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        pagingEnabled={true}
        getItemLayout={(data, index) => {
          return { length: height, offset: height * index, index };
        }}
        initialScrollIndex={state.current}
        viewabilityConfig={VIEWABILITY_CONFIG}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={_onViewableItemsChanged}
      />
      <ModelChangeBtn
        onLongPress={() => setListMode(true)}
        show={state.isPause}
      />
    </>
  );
}

export default MinVideoScreen;
