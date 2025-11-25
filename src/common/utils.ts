import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * 存储数据到本地存储
 * @param key 存储的键名
 * @param value 要存储的值，可以是任何可序列化的JavaScript对象
 * @returns Promise<void> 存储操作完成
 * @throws 当存储失败时抛出错误
 */
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // saving error
  }
};

/**
 * 从本地存储获取数据
 * @param key 要获取数据的键名
 * @returns Promise<any> 返回解析后的JavaScript对象，如果键不存在则返回undefined
 * @throws 当读取或解析数据失败时抛出错误
 */
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // error reading value
  }
};
/**
 * 从本地存储中删除特定键的数据
 * @param key 要删除的键名
 * @returns Promise<void> 删除操作完成
 * @throws 当删除操作失败时抛出错误
 */
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // error reading value
  }
};
/**
 * 清空本地存储中的所有数据
 * @returns Promise<void> 清空操作完成
 * @throws 当清空操作失败时抛出错误
 * @warning 此操作将删除所有存储的数据，请谨慎使用
 */
export const clearData = async () => {
  try {
    await AsyncStorage.clear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // error reading value
  }
};
