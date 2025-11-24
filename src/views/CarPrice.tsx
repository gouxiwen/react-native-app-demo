import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetCarPrice } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const defaultInfo: any[] = [
  // {
  //   brand_name: '小米汽车',
  //   car_name: '2024款 后驱标准长续航版',
  //   cover_url:
  //     'http://p3-dcd.byteimg.com/tos-cn-i-dcdx/7a507b6ec14c4ead9c95c336893aa9d2~tplv-f042mdwyw7-original:640:0.png',
  //   dealer_price: '21.59万',
  //   price: '21.59万',
  // },
];
function CarPriceScreen() {
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [carPrice, setCarPrice] = React.useState<any[]>(defaultInfo);
  const getCarPrice = async () => {
    if (!text) return;
    setLoading(true);
    const res = await fetchGetCarPrice(text);
    setLoading(false);
    console.log(res);
    if ((res as any).code !== 200) {
      Toast.showWithGravity((res as any).msg, Toast.LONG, Toast.TOP);
      return;
    }
    if (res.data) setCarPrice(res.data);
    else setCarPrice(defaultInfo);
  };
  React.useEffect(() => {
    getCarPrice();
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
          placeholder="请输入车型，如：小米su7"
          placeholderTextColor="#9AA4B2"
          onChangeText={newText => setText(newText)}
          value={text}
          onSubmitEditing={getCarPrice}
          clearButtonMode="while-editing"
        />
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }}
        >
          {carPrice && carPrice.length ? (
            carPrice.map((c: any, i: number) => (
              <View key={i} style={styles.card}>
                <Image source={{ uri: c.cover_url }} style={styles.cover} />
                <View style={styles.info}>
                  <Text style={styles.brand}>{c.brand_name}</Text>
                  <Text style={styles.carName} numberOfLines={2}>
                    {c.car_name}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.dealerPrice}>{c.dealer_price}</Text>
                    <View style={styles.priceChip}>
                      <Text style={styles.price}>{c.price}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>暂无车辆信息</Text>
          )}
        </ScrollView>
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
  carPrice: {
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
    borderColor: 'transparent',
    borderWidth: 0,
    width: '92%',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0b1720',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  card: {
    width: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    flexDirection: 'row',
    padding: 14,
    marginVertical: 10,
    shadowColor: '#08121a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 6,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: primaryColor,
    paddingLeft: 12,
  },
  cover: {
    width: 120,
    height: 76,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#f6f8fa',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    color: '#223344',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  carName: {
    color: '#2b3a42',
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dealerPrice: {
    color: '#7a8692',
    fontSize: 12,
  },
  price: {
    color: primaryColor,
    fontSize: 16,
    fontWeight: '800',
  },
  priceChip: {
    backgroundColor: '#EAF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  empty: {
    color: '#999',
    marginTop: 24,
  },
});

export default CarPriceScreen;
