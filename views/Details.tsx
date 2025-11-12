import * as React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';
import { CommonNavigationProps } from '../global';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DetailsScreen({
  route,
}: StaticScreenProps<{ itemId: number; otherParam: string }>) {
  const { itemId, otherParam } = route.params;
  const navigation = useNavigation<CommonNavigationProps>();
  const insets = useSafeAreaInsets();
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
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        onPress={() => {
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          });
        }}
      >
        Go to Details... again
      </Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
      <Button onPress={() => navigation.popTo('HomeBottom')}>Go to Home</Button>
      <Button onPress={() => navigation.popToTop()}>
        Go back to first screen in stack
      </Button>
      <Button
        onPress={() => navigation.navigate('HomeBottom', { screen: 'Home' })}
      >
        HomeBottom
      </Button>
    </View>
  );
}

export default DetailsScreen;
