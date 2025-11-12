import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonNavigationProps } from '../global';
// import ScrollViewBasics from './components/ScrollViewBasics';
// import PizzaTranslator from './components/PizzaTranslator';
// import FlatListBasics from './components/FlatListBasics ';
// import SectionListBasics from './components/SectionListBasics ';
// import FadeInView from './components/FadeInView';
// import AnimatedEventScroll from './components/AnimatedEventScroll';
// import AnimatedEventPan from './components/AnimatedEventPan';
// import LayoutAnimations from './components/LayoutAnimations';
// import FetchApi from './components/FetchApi';
// import NativeMoudle from './components/NativeMoudle';
// import NativeComponent from './components/NativeComponent';

function HomeScreen({ route }: StaticScreenProps<{ post: any }>) {
  const navigation = useNavigation<CommonNavigationProps>();
  const insets = useSafeAreaInsets();

  // Use an effect to monitor the update to params
  React.useEffect(() => {
    if (route.params?.post) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      Alert.alert('', 'New post: ' + route.params?.post, [
        { text: '确定', onPress: () => console.log('确定按钮被点击') },
      ]);
    }
  }, [route.params?.post]);

  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Button
          style={{ backgroundColor: 'transparent' }}
          onPress={() => setCount(c => c + 1)}
        >
          Update count
        </Button>
      ),
    });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>Home Screen</Text>
      <Button
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
      <Button onPress={() => navigation.navigate('Help')}>Help</Button>
    </View>
  );
}

export default HomeScreen;
