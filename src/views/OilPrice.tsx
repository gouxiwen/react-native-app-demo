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
import { fetchGetYoujia } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo = {
  province: '--',
  t0: '--',
  t92: '--',
  t95: '--',
  t98: '--',
};
function OilPriceScreen() {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [youjia, setYoujia] = React.useState<any>(defaultInfo);
  const getYoujia = async () => {
    if (!text) return;
    setLoading(true);
    const res = await fetchGetYoujia({
      province: text,
    });
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 1) {
      Toast.showWithGravity((res as any).msg, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setYoujia(res.data);
    else setYoujia(defaultInfo);
  };
  React.useEffect(() => {
    getYoujia();
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
          placeholder="请输入省份名称，如广东"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          onSubmitEditing={getYoujia}
          clearButtonMode="while-editing"
        />
        <View style={styles.youjia}>
          <Text style={styles.context}>{youjia.province}今日油价:</Text>
          <Text style={styles.time}>90号汽油：{youjia.t0}</Text>
          <Text style={styles.time}>92号汽油：{youjia.t92}</Text>
          <Text style={styles.time}>95号汽油：{youjia.t95}</Text>
          <Text style={styles.time}>98号汽油：{youjia.t98}</Text>
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
  youjia: {
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
    fontWeight: '600',
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default OilPriceScreen;
