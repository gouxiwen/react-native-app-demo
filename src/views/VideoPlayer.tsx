import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import VideoPlayer from 'react-native-media-console';
import { useAnimations } from '@react-native-media-console/reanimated';
import { CommonNavigationProps, VideoItemType } from '../../global';

function VideoPlayerScreen({ route }: StaticScreenProps<VideoItemType>) {
  const navigation = useNavigation<CommonNavigationProps>();

  return (
    <VideoPlayer
      source={{ uri: route.params.playurl }}
      useAnimations={useAnimations}
      navigator={navigation}
      containerStyle={styles.backgroundVideo}
    />
  );
}

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default VideoPlayerScreen;
