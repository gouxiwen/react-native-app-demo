import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Button } from '@react-navigation/elements';
// import type { StaticScreenProps } from '@react-navigation/native';
// import { CommonNavigationProps } from '../../global';
import { fetchGetTianqi } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import { useNavigation } from '@react-navigation/native';
import { CommonNavigationProps, RootStackParamList } from '../../global';

const defaultInfo = {
  current: {
    city: '--',
    weather: '--',
    temp: '--',
  },
};
function HomeScreen() {
  // function HomeScreen({ route }: StaticScreenProps<{ post: any }>) {
  const navigation = useNavigation<CommonNavigationProps>();

  // Use an effect to monitor the update to params
  // React.useEffect(() => {
  //   if (route.params?.post) {
  //     // Post updated, do something with `route.params.post`
  //     // For example, send the post to the server
  //     Alert.alert('', 'New post: ' + route.params?.post, [
  //       { text: '确定', onPress: () => console.log('确定按钮被点击') },
  //     ]);
  //   }
  // }, [route.params?.post]);

  // const [count, setCount] = React.useState(0);
  // React.useEffect(() => {
  //   // Use `setOptions` to update the button that we previously specified
  //   // Now the button includes an `onPress` handler to update the count
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <Button
  //         style={{ backgroundColor: 'transparent' }}
  //         onPress={() => setCount(c => c + 1)}
  //       >
  //         Update count
  //       </Button>
  //     ),
  //   });
  // }, [navigation]);
  return (
    <CustomSafeAreaViws>
      <View style={styles.container}>
        <Text style={styles.title}>查询服务</Text>
        <View style={styles.gridContainer}>
          {[
            {
              id: 1,
              name: '天气查询',
              icon: '☀️',
              color: '#FF9500',
              route: 'Weather',
            },
            {
              id: 2,
              name: '快递查询',
              icon: '📦',
              color: '#007AFF',
              route: 'Express',
            },
          ].map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.route as any)}
            >
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gridIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  gridText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default HomeScreen;
