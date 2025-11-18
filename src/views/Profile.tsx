import * as React from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import type { StaticScreenProps } from '@react-navigation/native';

function ProfileScreen({ route }: StaticScreenProps<{ name: string }>) {
  const { name } = route.params;
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log('ProfileScreen focus effect');
      //   Alert.alert('ProfileScreen was focus');
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('ProfileScreen focus effect cleanup');
        // Alert.alert('ProfileScreen was unfocus');
      };
    }, []),
  );
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{name}</Text>
      <Button onPress={() => navigation.setOptions({ title: 'Updated!' })}>
        Update the title
      </Button>
    </View>
  );
}
export default ProfileScreen;
