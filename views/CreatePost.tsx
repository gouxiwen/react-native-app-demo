import * as React from 'react';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { CommonNavigationProps } from '../global';

function CreatePostScreen() {
  const navigation = useNavigation<CommonNavigationProps>();
  const [postText, setPostText] = React.useState('');

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: 'white' }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        onPress={() => {
          // Pass params back to home screen
          navigation.popTo('HomeBottom', {
            screen: 'Home',
            params: {
              post: postText,
            },
          });
        }}
      >
        Done
      </Button>
    </>
  );
}

export default CreatePostScreen;
