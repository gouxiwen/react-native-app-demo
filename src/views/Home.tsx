import * as React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Button } from '@react-navigation/elements';
// import type { StaticScreenProps } from '@react-navigation/native';
// import { CommonNavigationProps } from '../../global';
import { fetchGetTianqi } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';

function HomeScreen() {
  // function HomeScreen({ route }: StaticScreenProps<{ post: any }>) {
  // const navigation = useNavigation<CommonNavigationProps>();

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
  const [text, setText] = React.useState('');
  const [tianqi, setTianqi] = React.useState<any>({});
  const getTianqi = async () => {
    const res = await fetchGetTianqi({
      city: text || '深圳',
      type: 'json',
    });
    setTianqi(res.data);
  };
  React.useEffect(() => {
    getTianqi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CustomSafeAreaViws>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TextInput
          style={styles.input}
          placeholder="请输入城市"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
        />
        <Button title="查询天气" onPress={getTianqi} />
        <View style={styles.tianqi}>
          {tianqi?.current && (
            <>
              <View style={styles.city}>
                <Text style={styles.cityText}>{tianqi.current.city}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  marginBottom: 12,
                }}
              >
                <View style={styles.info}>
                  <Text style={styles.infoLabel}>天气</Text>
                  <Text style={styles.infoText}>{tianqi.current.weather}</Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.infoLabel}>温度</Text>
                  <Text style={styles.infoText}>{tianqi.current.temp}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
      {/* <Button
        onPress={() => {
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      >
        Go to Details
      </Button>
      <Button onPress={() => navigation.navigate('CreatePost')}>
        Create post
      </Button>
      <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
      <Button
        onPress={() =>
          navigation.navigate('Profile', {
            name: 'John Doe',
          })
        }
      >
        Go to Profile
      </Button>
      <Text>{count}</Text>
      <Button onPress={() => navigation.navigate('Help')}>Help</Button> */}
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tianqi: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  city: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  cityText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  info: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 22,
    color: '#3498db',
    fontWeight: '500',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

export default HomeScreen;
