import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

declare global {}

export type RootStackParamList = {
  Home:
    | {
        post?: string;
      }
    | undefined;
  AiImage: undefined;
  MinVideo: undefined;
  Message: undefined;
  VideoPlayer: VideoItemType;
  Details: {
    itemId: number;
    otherParam?: string;
  };
  CreatePost: undefined;
  Profile: {
    name: string;
  };
  HomeBottom:
    | {
        screen: string;
        params?: Record<string, unknown>;
      }
    | undefined;
  Help: undefined;
  Weather: undefined;
  Express: undefined;
};
export type CommonNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

declare module 'react-native-config' {
  export interface NativeConfig {
    HOSTNAME?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

export type VideoItemType = {
  id: number;
  title: string;
  userName: string;
  userPic: string;
  coverUrl: string;
  playUrl: string;
  duration: string;
};
