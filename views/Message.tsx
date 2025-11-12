import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    // backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const mock = [
  { key: 'Devin' },
  { key: 'Dan' },
  { key: 'Dominic' },
  { key: 'Jackson' },
  { key: 'James' },
  { key: 'Joel' },
  { key: 'John' },
  { key: 'Jillian' },
  { key: 'Jimmy' },
  { key: 'Julie' },
];
const MessageScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const pageNum = React.useRef(1);
  const [data, setData] = React.useState(mock);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setData(mock.map(item => ({ ...item, key: item.key + pageNum.current })));
    pageNum.current++;
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <FlatList
        data={data}
        renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
      />
    </ScrollView>
  );
};

export default MessageScreen;
