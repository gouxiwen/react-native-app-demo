import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  View,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { fetchGetMinVideo } from '../services/http';
import FastImage from 'react-native-fast-image';
import { CommonNavigationProps, VideoItemType } from '../../global';
import { useNavigation } from '@react-navigation/native';

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

function VideoItem({ item }: { item: VideoItemType }) {
  const navigation = useNavigation<CommonNavigationProps>();
  return (
    <Pressable onPress={() => navigation.navigate('VideoPlayer', item)}>
      <View style={styles.item}>
        <View style={styles.userInfo}>
          <FastImage
            style={styles.avatar}
            source={{ uri: item.picuser, priority: FastImage.priority.normal }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <FastImage
          style={styles.videoCover}
          source={{ uri: item.picurl, priority: FastImage.priority.normal }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    </Pressable>
  );
}
function MinVideoScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const pageSize = 20;
  const pageNo = React.useRef(0);
  const totalPage = React.useRef(0);
  const [data, setData] = React.useState<Array<VideoItemType>>([]);
  const [showFoot, setShowFoot] = React.useState(0);
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
      renderItem={({ item }) => <VideoItem item={item} />}
      keyExtractor={item => item.id.toString()}
    />
  );
}

export default MinVideoScreen;
