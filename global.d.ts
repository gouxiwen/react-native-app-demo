import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

declare global {}

export type CommonNavigationProps = NativeStackNavigationProp<{
  Home:
    | {
        post?: string;
      }
    | undefined;
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
}>;

declare module 'react-native-config' {
  export interface NativeConfig {
      HOSTNAME?: string;
  }
  
  export const Config: NativeConfig
  export default Config
}
