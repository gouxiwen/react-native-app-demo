import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { fetchGetTuring } from '../services/http';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';

const { width } = Dimensions.get('window');

// 消息类型定义
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function TuringChatScreen() {
  const [inputText, setInputText] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);

  // 发送消息给图灵机器人
  const sendMessage = async () => {
    if (!inputText.trim()) {
      return;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // 调用图灵机器人API
      const res = await fetchGetTuring(inputText);
      setLoading(false);

      if ((res as any).code !== 200) {
        Toast.showWithGravity(
          (res as any).msg || '请求失败',
          Toast.LONG,
          Toast.TOP,
        );
        return;
      }

      // 添加机器人回复
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: (res as any).data || '抱歉，我没有理解您的问题。',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // 渲染单个消息项
  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={item.isUser ? styles.userMessageWrapper : styles.botMessageWrapper}
    >
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
      <View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessage : styles.botMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.botMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <CustomSafeAreaViws>
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="请输入您的问题..."
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, { opacity: loading ? 0.5 : 1 }]}
              onPress={sendMessage}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>
                {loading ? '发送中...' : '发送'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </CustomSafeAreaViws>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  messageContainer: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: primaryColor,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#FBF8F1', // 淡米色卡片背景
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8DFC9', // 淡褐色边框
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#534741', // 深褐色文字
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8DFC9',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E8DFC9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: primaryColor,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TuringChatScreen;
