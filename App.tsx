/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import
// StatusBar,
// useColorScheme,
// StyleSheet,
// TextInput,
// View,
// 'react-native';
// import
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

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
import NativeComponent from './components/NativeComponent';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  // return (
  //   <SafeAreaProvider>
  //     <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
  //     <AppContent />
  //   </SafeAreaProvider>
  // );
  // return <PizzaTranslator />;
  // return <ScrollViewBasics />;
  // return <FlatListBasics />;
  // return <SectionListBasics />;
  // return <FadeInView />;
  // return <AnimatedEventScroll />;
  // return <AnimatedEventPan />;
  // return <LayoutAnimations />;
  // return <FetchApi />;
  // return <NativeMoudle />;
  return <NativeComponent />;
}

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

export default App;
