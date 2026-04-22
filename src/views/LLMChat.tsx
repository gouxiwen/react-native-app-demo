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
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import CustomSafeAreaViws from '../components/CustomSafeAreaViws';
import { primaryColor } from '../common/const';
import {
  fetchSiliconFlowChatStream,
  ChatMessage,
} from '../services/http';

const { width } = Dimensions.get('window');

// 消息类型定义
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function LLMChatScreen() {
  const [inputText, setInputText] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(false);
  const flatListRef = React.useRef<FlatList>(null);

  // 发送消息给硅基流动API
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

    setMessages(prevMessages => {
      const newMessages = [...prevMessages, userMessage];
      // 滚动到底部
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return newMessages;
    });
    setInputText('');
    setLoading(true);

    // 创建一个空的AI回复消息ID，用于后续更新
    const botMessageId = (Date.now() + 1).toString();
    // 不立即添加空的AI回复消息，等待接收到第一个内容时再添加

    try {
      // 获取对话历史，用于上下文
      const conversationHistory: ChatMessage[] = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

      // 添加当前用户消息
      conversationHistory.push({
        role: 'user',
        content: userMessage.text,
      });

      let fullText = '';
      let hasAddedBotMessage = false;

      // 调用硅基流动流式API
      await fetchSiliconFlowChatStream(
        {
          messages: [
            { role: 'system', content: '你是一个有用的助手' },
            ...conversationHistory,
          ],
        },
        // onMessage: 接收到流式内容时的回调
        content => {
          fullText += content;

          // 如果还没有添加AI回复消息，则添加
          if (!hasAddedBotMessage) {
            hasAddedBotMessage = true;
            const botMessage: Message = {
              id: botMessageId,
              text: fullText,
              isUser: false,
              timestamp: new Date(),
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
          } else {
            // 更新消息内容
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                msg.id === botMessageId ? { ...msg, text: fullText } : msg,
              ),
            );
          }

          // 滚动到底部
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 50);
        },
        // onComplete: 流式传输完成时的回调
        () => {
          setLoading(false);
        },
        // onError: 发生错误时的回调
        error => {
          setLoading(false);
          console.error('API调用失败:', error);
          Toast.showWithGravity('请求失败，请稍后重试', Toast.LONG, Toast.TOP);
          // 添加错误消息
          const botMessage: Message = {
            id: botMessageId,
            text: '抱歉，发生了错误，请稍后重试。',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prevMessages => [...prevMessages, botMessage]);
        },
      );
    } catch (error) {
      setLoading(false);
      console.error('API调用失败:', error);
      Toast.showWithGravity('请求失败，请稍后重试', Toast.LONG, Toast.TOP);
      // 添加错误消息
      const botMessage: Message = {
        id: botMessageId,
        text: '抱歉，发生了错误，请稍后重试。',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
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
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          ListFooterComponent={loading ? <LoadingIndicator /> : null}
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

// 加载指示器组件
const LoadingIndicator = () => (
  <View style={styles.loadingWrapper}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={primaryColor} />
      <Text style={styles.loadingText}>正在思考中...</Text>
    </View>
  </View>
);

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
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: primaryColor,
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
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: primaryColor,
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
  loadingWrapper: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: width * 0.75,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: primaryColor,
  },
});

export default LLMChatScreen;
