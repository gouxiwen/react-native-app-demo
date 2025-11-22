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
  Dimensions,
  StatusBar,
  GestureResponderEvent,
} from 'react-native';
import { fetchGetMinVideo } from '../services/http';
import FastImage from 'react-native-fast-image';
import { CommonNavigationProps, VideoItemType } from '../../global';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
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

const { width, height: screenHeight } = Dimensions.get('screen');
function VideoItemFullScreen({
  item,
  index,
  state,
  height,
  onPress,
  onLongPress,
}: {
  item: VideoItemType;
  index: number;
  state: any;
  height: number;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
}) {
  return (
    <View
      style={{
        width: width,
        height: height,
      }}
    >
      <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
        <View style={{ flex: 1, position: 'relative' }}>
          <Video
            source={{ uri: item.playUrl }}
            style={{ flex: 1, backgroundColor: '#000' }}
            repeat
            paused={index === state.current ? state.isPause : true}
            resizeMode="contain"
          />
          {/* 写一个空view，传递点击事件，video组件会拦截点击事件 */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
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
        </View>
      </TouchableWithoutFeedback>
      {/*信息（头像，标题等）、写评论*/}
      {/* <View
        column
        style={{
          position: 'absolute',
          width: width,
          height: height - STATUSBAR_HEIGHT,
          justifyContent: 'flex-end',
          padding: 20,
          marginBottom: 30,
        }}
      >
        <View row style={{ alignItems: 'center' }}>
          <Image
            source={require('../../res/img/shootVideo/user_icon.png')}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 15, color: '#fff', marginLeft: 10 }}>
            懒散少女和猫
          </Text>
          <TouchableOpacity
            center
            style={{
              width: 60,
              height: 30,
              backgroundColor: '#f98589',
              borderRadius: 5,
              marginLeft: 10,
            }}
          >
            <Text style={{ fontSize: 14, color: '#fff' }}>关注</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 14, color: '#fff', marginTop: 10 }}>
          美丽的傍晚
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: 5,
            padding: 3,
            width: 155,
            marginTop: 10,
          }}
        >
          <Image
            source={require('../../res/img/shootVideo/bgmusic.png')}
            style={{ width: 15, height: 15 }}
          />
          <Text style={{ fontSize: 13, color: '#fff', marginLeft: 10 }}>
            @懒散的少女和猫
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            row
            style={{
              backgroundColor: '#4d4d4d',
              borderRadius: 17,
              padding: 10,
              alignItems: 'center',
              width: 270,
            }}
          >
            <Image
              source={require('../../res/img/shootVideo/write_review.png')}
              style={{ width: 15, height: 15 }}
            />
            <Text style={{ fontSize: 14, color: '#fff', marginLeft: 10 }}>
              写评论...
            </Text>
          </TouchableOpacity>
        </View>
      </View> */}
      {/*底部 右侧 功能键 （我拍，点赞，评论，转发）*/}
      {/* <View column style={{position:'absolute',width:width,height:height-STATUSBAR_HEIGHT,justifyContent:'flex-end',alignItems:'flex-end',padding: 20}}>
                    <TouchableOpacity column center style={styles.bottomRightBn} >
                        <Image source={require('../../res/img/shootVideo/shoot.png')} resizeMode={'contain'} style={styles.bottomRightImage}/>
                        <Text style={styles.bottomRightText}>我拍</Text>
                    </TouchableOpacity>
                    <TouchableOpacity column center style={styles.bottomRightBn}>
                        <Image source={require('../../res/img/shootVideo/like.png')} resizeMode={'contain'} style={styles.bottomRightImage}/>
                        <Text style={styles.bottomRightText}>2.1万</Text>
                    </TouchableOpacity>
                    <TouchableOpacity column center style={styles.bottomRightBn}>
                        <Image source={require('../../res/img/shootVideo/review.png')} resizeMode={'contain'} style={styles.bottomRightImage}/>
                        <Text style={styles.bottomRightText}>300</Text>
                    </TouchableOpacity>
                    <TouchableOpacity column center style={[styles.bottomRightBn,{marginBottom:50}]}>
                        <Image source={require('../../res/img/shootVideo/share.png')} resizeMode={'contain'} style={styles.bottomRightImage}/>
                        <Text style={styles.bottomRightText}>分享</Text>
                    </TouchableOpacity>
                </View> */}
      {/* 屏幕中央 播放按钮 */}
      {/* {this.state.isPause ? (
        <View
          column
          center
          flex
          style={{
            position: 'absolute',
            width: width,
            height: height - STATUSBAR_HEIGHT,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.setState({
                isPause: !this.state.isPause,
              });
            }}
          >
            <Image
              source={require('../../res/img/shootVideo/play.png')}
              resizeMode={'contain'}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
        </View>
      ) : null} */}
    </View>
  );
}
function VideoItem({
  item,
  onLongPress,
}: {
  item: VideoItemType;
  onLongPress: (event: GestureResponderEvent) => void;
}) {
  const navigation = useNavigation<CommonNavigationProps>();
  return (
    <Pressable
      onPress={() => navigation.navigate('VideoPlayer', item)}
      onLongPress={onLongPress}
    >
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
  const tabBarHeight = useBottomTabBarHeight();
  const height = screenHeight - tabBarHeight;
  const [refreshing, setRefreshing] = React.useState(false);
  const [listMode, setListMode] = React.useState(false);
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
    setTimeout(() => {
      Toast.showWithGravity('长按可以切换为列表模式哦~', Toast.LONG, Toast.TOP);
    }, 3000);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setState(pre => ({
        ...pre,
        isPause: false,
      }));
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setState(pre => ({
          ...pre,
          isPause: true,
        }));
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
        current: viewableItems[0].index as number,
      }));
      if (viewableItems[0].index === data.length - 1) {
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
      <FlatList
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.5}
        onEndReached={_onEndReached}
        ListFooterComponent={_renderFooter}
        data={data}
        renderItem={({ item }) => (
          <VideoItem item={item} onLongPress={() => setListMode(pre => !pre)} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    );
  }
  return (
    <>
      <StatusBar hidden={true} />
      <FlatList
        contentContainerStyle={{}}
        data={data}
        renderItem={props => (
          <VideoItemFullScreen
            {...props}
            state={state}
            height={height}
            onPress={() => {
              setState(pre => ({
                ...pre,
                isPause: !state.isPause,
              }));
            }}
            onLongPress={() => {
              setListMode(pre => !pre);
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        pagingEnabled={true}
        getItemLayout={(data, index) => {
          return { length: height, offset: height * index, index };
        }}
        viewabilityConfig={VIEWABILITY_CONFIG}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={_onViewableItemsChanged}
      />
    </>
  );
}

export default MinVideoScreen;
