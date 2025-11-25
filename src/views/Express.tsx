import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetKuaidi } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo = {
  current: {
    time: '--',
    ftime: '--',
    context: '--',
  },
};
function ExpressScreen() {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [kuaidi, setKuaidi] = React.useState<any>(defaultInfo);
  const getKuaidi = async () => {
    if (!text) return;
    setKuaidi(defaultInfo);
    setLoading(true);
    const res = await fetchGetKuaidi({
      id: text,
    });
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 1) {
      Toast.showWithGravity((res as any).text, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setKuaidi(res.data);
  };
  React.useEffect(() => {
    getKuaidi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1 }}
        color={primaryColor}
        size="large"
      />
    );
  return (
    <CustomSafeAreaViws>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TextInput
          style={styles.input}
          placeholder="请输入快递单号"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          onSubmitEditing={getKuaidi}
          clearButtonMode="while-editing"
        />
        <View style={styles.kuaidi}>
          <Text style={styles.time}>更新时间：{kuaidi.current.time}</Text>
          <Text style={styles.context}>当前位置：{kuaidi.current.context}</Text>
        </View>
      </KeyboardAvoidingView>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 16,
  },
  kuaidi: {
    width: '80%',
    backgroundColor: primaryColor,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  time: {
    backgroundColor: '#F0F5FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: primaryColor,
  },
  context: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    color: primaryColor,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
});

export default ExpressScreen;
