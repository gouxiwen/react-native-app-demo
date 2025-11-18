import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  RefreshControl,
  View,
  ActivityIndicator,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    // flex: 1, // flatlist不用设置flex:1，否则无法滚动
    // backgroundColor: 'pink',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  footer: {
    flexDirection: 'row',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});

const mock = (pageNum: number, pageSize: number) =>
  Array.from({ length: pageSize }).map((_, index) => ({
    key: `Item ${pageNum * pageSize + index + 1}`,
  }));
const MessageScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const pageNo = React.useRef(0);
  const pageSize = 20;
  const totalPage = 3;
  const [data, setData] = React.useState(mock(pageNo.current, pageSize));
  const [showFoot, setShowFoot] = React.useState(0);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    pageNo.current = 0;
    setShowFoot(0);
    setData(
      mock(pageNo.current, pageSize).map(item => ({
        ...item,
        key: item.key,
      })),
    );
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  function _onEndReached() {
    console.log('end', showFoot);

    //如果是正在加载中或没有更多数据了，则返回
    if (showFoot !== 0) {
      return;
    }
    //如果当前页大于或等于总页数，那就是到最后一页了，返回
    if (pageNo.current !== 1 && pageNo.current >= totalPage) {
      return;
    } else {
      pageNo.current++;
    }
    //底部显示正在加载更多数据
    setShowFoot(2);
    //获取数据
    setTimeout(() => {
      const res = mock(pageNo.current, pageSize);
      setData(prevData => [...prevData, ...res]);
      if (pageNo.current >= totalPage) {
        setShowFoot(1);
      } else {
        setShowFoot(0);
      }
    }, 1000);
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
      renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      keyExtractor={item => item.key}
    />
  );
};

export default MessageScreen;
