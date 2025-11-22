import * as React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetTianqi } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo = {
  current: {
    city: '--',
    weather: '--',
    temp: '--',
  },
};
function WeatherScreen() {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [tianqi, setTianqi] = React.useState<any>(defaultInfo);
  const getTianqi = async () => {
    setLoading(true);
    const res = await fetchGetTianqi({
      city: text || '深圳',
    });
    console.log(res);
    if ((res as any).code !== 1) {
      Toast.showWithGravity((res as any).text, Toast.LONG, Toast.TOP);
      return;
    }
    setLoading(false);
    if (res.data) setTianqi(res.data);
    else setTianqi(defaultInfo);
  };
  React.useEffect(() => {
    getTianqi();
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
          placeholder="请输入城市"
          onChangeText={newText => setText(newText)}
          defaultValue={text}
          onSubmitEditing={getTianqi}
          clearButtonMode="while-editing"
        />
        {/* <Button title="查询天气" onPress={getTianqi} /> */}
        <View style={styles.tianqi}>
          <View style={styles.city}>
            <Text style={styles.cityText}>{tianqi.current.city}</Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 12,
            }}
          >
            <View style={styles.info}>
              <Text style={styles.infoLabel}>天气</Text>
              <Text style={styles.infoText}>{tianqi.current.weather}</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoLabel}>温度</Text>
              <Text style={styles.infoText}>{tianqi.current.temp}</Text>
            </View>
          </View>
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
  tianqi: {
    width: '80%',
    backgroundColor: '#ffffff',
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
  city: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  cityText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  info: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 22,
    color: '#3498db',
    fontWeight: '500',
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

export default WeatherScreen;
