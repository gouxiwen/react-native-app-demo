import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import VideoPlayer from 'react-native-media-console';
import { useAnimations } from '@react-native-media-console/reanimated';
import { CommonNavigationProps, VideoItemType } from '../../global';

function VideoPlayerScreen({ route }: StaticScreenProps<VideoItemType>) {
  const navigation = useNavigation<CommonNavigationProps>();

  return (
    <>
      <StatusBar hidden={true} />
      <VideoPlayer
        source={{ uri: route.params.playUrl }}
        useAnimations={useAnimations}
        navigator={navigation}
        repeat
        tapAnywhereToPause
        resizeMode="contain"
      />
    </>
  );
}

// var styles = StyleSheet.create({
//   backgroundVideo: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
// });

export default VideoPlayerScreen;
