import * as React from 'react';
import {
  Text,
  // Image,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {
  createStaticNavigation,
  // useLinkBuilder,
  // useTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
// import { Button /* , PlatformPressable  */ } from '@react-navigation/elements';
import AntDesign from '@react-native-vector-icons/ant-design';
import type { StaticParamList } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './views/Home';
import DetailsScreen from './views/Details';
import CreatePostScreen from './views/CreatePost';
import ProfileScreen from './views/Profile';
import SplashScreen from 'react-native-splash-screen';
//要调用的配置文件写功能,如：app.tsx
import Config from 'react-native-config';
import AiImageScreen from './views/AiImage';
import MinVideoScreen from './views/MinVideo';
import VideoPlayerScreen from './views/VideoPlayer';
import { VideoItemType } from '../global';

//打印接口域名配置信息
console.log(Config.FLAVOR, '=Config==config', Config);

// function LogoTitle(props: any) {
//   console.log(props);
//   return (
//     <Image
//       style={{ width: 50, height: 50 }}
//       source={require('@/static/image/logo.png')}
//     />
//   );
// }

// function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
//   const { colors } = useTheme();
//   const { buildHref } = useLinkBuilder();

//   return (
//     <View style={{ flexDirection: 'row' }}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         return (
//           <PlatformPressable
//             key={route.key}
//             href={buildHref(route.name, route.params)}
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarButtonTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{
//               flex: 1,
//               height: 50,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             <AntDesign
//               name="read"
//               color={isFocused ? colors.primary : colors.text}
//               size={20}
//             />
//             <Text style={{ color: isFocused ? colors.primary : colors.text }}>
//               {label as string}
//             </Text>
//           </PlatformPressable>
//         );
//       })}
//     </View>
//   );
// }

const HomeBottomTabs = createBottomTabNavigator({
  // tabBar: props => <MyTabBar {...props} />, // 自定义底部导航栏
  screenOptions: {
    tabBarLabelPosition: 'beside-icon',
    // tabBarLabelStyle: {
    //   fontSize: 16,
    //   fontFamily: 'Georgia',
    // },
    tabBarShowLabel: false,
    headerTitleAlign: 'center',
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: {
        title: '首页',
        // headerTitle: props => <LogoTitle {...props} />,
        // headerRight: () => <Button>Update count</Button>,
        tabBarIcon: ({ /* focused, */ color, size }) => (
          <AntDesign name="home" color={color} size={size} />
        ),
      },
    },
    AiImage: {
      screen: AiImageScreen,
      options: {
        title: 'AI图片',
        tabBarIcon: ({ /* focused, */ color, size }) => (
          <AntDesign name="picture" color={color} size={size} />
        ),
      },
    },
    MinVideo: {
      screen: MinVideoScreen,
      options: {
        title: '短视频',
        tabBarIcon: ({ /* focused, */ color, size }) => (
          <AntDesign name="youtube" color={color} size={size} />
        ),
        // tabBarBadge: 0,
      },
    },
  },
});

// 依赖HomeBottomTabs定义底部导航栏类型
// type BottomTabParamList = StaticParamList<typeof HomeBottomTabs>;
// type FeedScreenNavigationProp = BottomTabNavigationProp<
//   BottomTabParamList,
//   'Feed'
// >;

const RootStack = createNativeStackNavigator({
  initialRouteName: 'HomeBottom',
  screenOptions: {
    headerStyle: {
      backgroundColor: '#fff',
    },
    headerTintColor: '#000',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTitleAlign: 'center',
  },
  screens: {
    HomeBottom: {
      screen: HomeBottomTabs,
      options: {
        headerShown: false,
      },
    },
    VideoPlayer: {
      screen: VideoPlayerScreen,
      options: ({ route }) => ({
        headerShown: false,
        title: (route.params as VideoItemType).title,
      }),
    },
    Details: {
      screen: DetailsScreen,
      initialParams: { itemId: 42 },
      options: {
        // headerShown: false,
        // headerLeft: () => (
        //   <AntDesign name="arrow-left" color="#000" size={20} />
        // ),
        // headerBackVisible: true, // 当定义了 headerLeft 时，默认为 false
        headerBackTitle: 'Back', // Only supported on iOS.
        headerBackTitleStyle: { fontSize: 20 }, // Only supported on iOS.
      },
    },
    CreatePost: CreatePostScreen,
    Profile: {
      screen: ProfileScreen,
      options: ({ route }: any) => ({
        title: (route.params as { name: string })?.name,
      }),
    },
  },
  groups: {
    // Common modal screens
    Modal: {
      screenOptions: {
        presentation: 'modal', // 配置渲染和过渡效果的样式，card | modal | transparentModal
      },
      screens: {
        Help: () => <Text>Help</Text>,
        Invite: () => <Text>Invite</Text>,
      },
    },
    // Screens for logged in users
    // User: {
    //   if: useIsLoggedIn,
    //   screens: {
    //     Home,
    //     Profile,
    //   },
    // },
    // // Auth screens
    // Guest: {
    //   if: useIsGuest,
    //   screens: {
    //     SignIn,
    //     SignUp,
    //   },
    // },
  },
});

// 为根导航器生成 ParamList 类型，并将其指定为 RootParamList 类型的默认类型。
type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  React.useEffect(() => {
    // 启动页结束前，做一些初始化操作
    const init = async () => {
      return new Promise<string>(resolve => {
        setTimeout(() => {
          resolve('done');
        }, 2000);
      });
    };

    init().finally(async () => {
      await SplashScreen.hide(); // 关闭启动页
      console.log('BootSplash has been hidden successfully');
    });
  }, []);
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#fff"
      />
      <Navigation />;
    </SafeAreaProvider>
  );
}
