// 全局使用的接口
import { get, post } from './axios';
import EventSource from 'react-native-sse';
import { siliconflow_API_KEY } from './apikey';
// 定义接口：
// url      请求地址
// function 请求方法

// ---------->查询天气
export function fetchGetTianqi(data: { city: string; type?: string }) {
  return get('http://shanhe.kim/api/za/tianqi.php', {
    city: data.city,
    type: data.type || 'json',
  });
}
// ---------->查询快递
export function fetchGetKuaidi(data: { id: string; type?: string }) {
  return get('http://shanhe.kim/api/za/kuaidi.php', {
    id: data.id,
    type: data.type || 'json',
  });
}
// ---------->查询油价
export function fetchGetYoujia(data: { province: string; type?: string }) {
  return get('http://shanhe.kim/api/youjia/youjia.php', {
    province: data.province,
    type: data.type || 'json',
  });
}
// ---------->随机ai绘制图
export function fetchGetAiImg(type: string) {
  if (type === 'ai') {
    return get('http://shanhe.kim/api/tu/aiv1.php', {
      type: 'txt',
    });
  } else if (type === 'head') {
    return get('https://v2.xxapi.cn/api/head', {
      return: 'json',
    }).then(res => {
      if ((res as any).code === 200) {
        return (res as any).data;
      }
    });
  } else if (type === 'wallpaper') {
    return get('https://v2.xxapi.cn/api/random4kPic', {
      type: 'wallpaper',
      return: 'json',
    }).then(res => {
      if ((res as any).code === 200) {
        return (res as any).data;
      }
    });
  }
}
// ---------->获取短视频列表
export type VideoListParams = {
  page: number;
  size: number;
};
// export function fetchGetMinVideo(data: VideoListParams) {
//   return get('https://api.apiopen.top/api/getHaoKanVideo', data);
// }
export function fetchGetMinVideo(data: VideoListParams) {
  return get(
    `http://baobab.kaiyanapp.com/api/v4/discovery/hot?start=${data.page}&num=${data.size}`,
  );
}

// ---------->车辆价格信息查询
export function fetchGetCarPrice(query: string) {
  return get('https://v2.xxapi.cn/api/carprice', {
    search: query,
  });
}
// ---------->每日英语
export function fetchGetEnglishwords() {
  return get('https://v2.xxapi.cn/api/randomenglishwords');
}
// ---------->图灵机器人
export function fetchGetTuring(msg: string) {
  return get('https://v2.xxapi.cn/api/turing', { msg });
}

// ---------->硅基流动AI对话
export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type SiliconFlowChatParams = {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
};

export function fetchSiliconFlowChat(params: SiliconFlowChatParams) {
  return post(
    'https://api.siliconflow.cn/v1/chat/completions',
    {
      model: params.model || 'Qwen/Qwen2.5-7B-Instruct',
      messages: params.messages,
      stream: params.stream || false,
    },
    {},
    {
      headers: {
        Authorization:
          'Bearer sk-vcsmjxxaanktozmkjkqkipjsisvbcoezstlvsxslbqqfddir',
      },
    },
  );
}

// ---------->硅基流动AI流式对话
export type StreamCallback = (content: string) => void;
export type StreamCompleteCallback = () => void;
export type StreamErrorCallback = (error: Error) => void;

export async function fetchSiliconFlowChatStream(
  params: SiliconFlowChatParams,
  onMessage: StreamCallback,
  onComplete: StreamCompleteCallback,
  onError: StreamErrorCallback,
) {
  const eventSource = new EventSource(
    'https://api.siliconflow.cn/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${siliconflow_API_KEY}`,
      },
      body: JSON.stringify({
        model: params.model || 'Qwen/Qwen2.5-7B-Instruct',
        messages: params.messages,
        stream: true,
      }),
    },
  );

  eventSource.addEventListener('message', (event) => {
    if (event.data === '[DONE]') {
      onComplete();
      eventSource.close();
      return;
    }

    if (!event.data) {
      return;
    }

    try {
      const parsed = JSON.parse(event.data);
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) {
        onMessage(content);
      }
    } catch (e) {
      console.error('解析流数据失败:', e);
    }
  });

  eventSource.addEventListener('error', (error) => {
    let errorMessage = '请求失败，请稍后重试';
    
    if ('message' in error) {
      errorMessage = error.message;
    } else if ('type' in error) {
      errorMessage = `请求失败: ${error.type}`;
    }
    
    onError(new Error(errorMessage));
    eventSource.close();
  });

  return () => eventSource.close();
}
// ---------->随机一言/古诗词
export function fetchGetYiyan(type: 'hitokoto' | 'poetry' = 'poetry') {
  return get('https://v2.xxapi.cn/api/yiyan', { type });
}

// ---------->获取AI工具列表
export function fetchGetAITools() {
  // 由于没有真实的API，我们返回模拟数据
  return Promise.resolve({
    data: [
      {
        id: '1',
        name: 'ChatGPT',
        purpose: '通用对话、内容创作、问题解答',
        company: 'OpenAI',
        isPaid: true,
        category: '对话助手',
      },
      {
        id: '2',
        name: 'Claude',
        purpose: '对话、内容生成、数据分析',
        company: 'Anthropic',
        isPaid: true,
        category: '对话助手',
      },
      {
        id: '3',
        name: 'Gemini',
        purpose: '多模态对话、创意内容生成',
        company: 'Google',
        isPaid: true,
        category: '对话助手',
      },
      {
        id: '4',
        name: 'Midjourney',
        purpose: 'AI图像生成',
        company: 'Midjourney Inc.',
        isPaid: true,
        category: '图像生成',
      },
      {
        id: '5',
        name: 'DALL·E 3',
        purpose: '文本到图像生成',
        company: 'OpenAI',
        isPaid: true,
        category: '图像生成',
      },
      {
        id: '6',
        name: 'Stable Diffusion',
        purpose: '开源图像生成',
        company: 'Stability AI',
        isPaid: false,
        category: '图像生成',
      },
      {
        id: '7',
        name: 'GitHub Copilot',
        purpose: '代码生成、智能编程助手',
        company: 'GitHub & OpenAI',
        isPaid: true,
        category: '编程助手',
      },
      {
        id: '8',
        name: 'Codeium',
        purpose: 'AI代码编辑器助手',
        company: 'Codeium',
        isPaid: false,
        category: '编程助手',
      },
      {
        id: '9',
        name: 'Notion AI',
        purpose: '文档智能助手、内容生成',
        company: 'Notion',
        isPaid: true,
        category: '办公助手',
      },
      {
        id: '10',
        name: 'Grammarly',
        purpose: '语法检查、写作助手',
        company: 'Grammarly',
        isPaid: true,
        category: '办公助手',
      },
      {
        id: '11',
        name: 'Descript',
        purpose: 'AI视频编辑、音频处理',
        company: 'Descript',
        isPaid: true,
        category: '音视频处理',
      },
      {
        id: '12',
        name: 'Runway ML',
        purpose: 'AI视频生成与编辑',
        company: 'Runway',
        isPaid: true,
        category: '音视频处理',
      },
    ],
  });
}

// ---------->获取AI工具详情
export function fetchGetAIToolDetail(id: string) {
  // 由于没有真实的API，我们返回模拟数据
  const tools = [
    {
      id: '1',
      name: 'ChatGPT',
      purpose: '通用对话、内容创作、问题解答',
      company: 'OpenAI',
      isPaid: true,
      category: '对话助手',
      description:
        'ChatGPT是由OpenAI开发的大型语言模型，能够进行自然语言对话、生成创意内容、回答问题等多种任务。它基于GPT架构，通过海量文本数据训练而成，具备理解上下文和生成连贯文本的能力。',
      website: 'https://openai.com/chatgpt',
    },
    {
      id: '2',
      name: 'Claude',
      purpose: '对话、内容生成、数据分析',
      company: 'Anthropic',
      isPaid: true,
      category: '对话助手',
      description:
        'Claude是由Anthropic开发的AI助手，专注于安全性和可靠性。它能够进行深入的对话，生成高质量的内容，以及分析和总结复杂的信息。Claude以其详细和准确的回答而闻名。',
      website: 'https://www.anthropic.com/claude',
    },
    {
      id: '3',
      name: 'Gemini',
      purpose: '多模态对话、创意内容生成',
      company: 'Google',
      isPaid: true,
      category: '对话助手',
      description:
        'Gemini是Google开发的多模态AI模型，能够理解和生成文本、图像、音频等多种类型的内容。它设计用于处理复杂的任务，提供准确的信息，并与用户进行自然的交互。',
      website: 'https://gemini.google.com',
    },
    {
      id: '4',
      name: 'Midjourney',
      purpose: 'AI图像生成',
      company: 'Midjourney Inc.',
      isPaid: true,
      category: '图像生成',
      description:
        'Midjourney是一款强大的AI图像生成工具，能够根据文本描述创建高质量的图像。它以其艺术风格和创意能力而闻名，被广泛用于设计、艺术创作和内容制作等领域。',
      website: 'https://www.midjourney.com',
    },
    {
      id: '5',
      name: 'DALL·E 3',
      purpose: '文本到图像生成',
      company: 'OpenAI',
      isPaid: true,
      category: '图像生成',
      description:
        'DALL·E 3是OpenAI开发的文本到图像生成模型，能够根据详细的文本描述创建准确、高质量的图像。它支持复杂的场景描述和多种艺术风格，为创意表达提供了新的可能性。',
      website: 'https://openai.com/dall-e-3',
    },
    {
      id: '6',
      name: 'Stable Diffusion',
      purpose: '开源图像生成',
      company: 'Stability AI',
      isPaid: false,
      category: '图像生成',
      description:
        'Stable Diffusion是由Stability AI开发的开源图像生成模型，允许用户根据文本提示创建图像。作为开源项目，它可以在本地运行，为开发者和创作者提供了更多的灵活性和控制权。',
      website: 'https://stability.ai/stable-diffusion',
    },
    {
      id: '7',
      name: 'GitHub Copilot',
      purpose: '代码生成、智能编程助手',
      company: 'GitHub & OpenAI',
      isPaid: true,
      category: '编程助手',
      description:
        'GitHub Copilot是GitHub和OpenAI合作开发的AI编程助手，能够根据上下文自动生成代码建议。它集成到常见的IDE中，帮助开发者提高编码效率，减少重复工作，发现和修复错误。',
      website: 'https://github.com/features/copilot',
    },
    {
      id: '8',
      name: 'Codeium',
      purpose: 'AI代码编辑器助手',
      company: 'Codeium',
      isPaid: false,
      category: '编程助手',
      description:
        'Codeium是一款免费的AI代码助手，提供实时代码补全、智能搜索和文档生成等功能。它支持多种编程语言和编辑器，旨在帮助开发者编写更好的代码，更快地解决问题。',
      website: 'https://codeium.com',
    },
    {
      id: '9',
      name: 'Notion AI',
      purpose: '文档智能助手、内容生成',
      company: 'Notion',
      isPaid: true,
      category: '办公助手',
      description:
        'Notion AI是集成在Notion笔记应用中的AI助手，能够帮助用户生成内容、总结文档、回答问题等。它与Notion的工作流程无缝集成，为用户提供智能的文档管理和内容创作工具。',
      website: 'https://www.notion.so/ai',
    },
    {
      id: '10',
      name: 'Grammarly',
      purpose: '语法检查、写作助手',
      company: 'Grammarly',
      isPaid: true,
      category: '办公助手',
      description:
        'Grammarly是一款AI驱动的写作助手，能够检查语法、拼写、标点和风格等问题。它提供实时建议，帮助用户改进写作质量，适用于学术论文、商务邮件和日常写作等多种场景。',
      website: 'https://www.grammarly.com',
    },
    {
      id: '11',
      name: 'Descript',
      purpose: 'AI视频编辑、音频处理',
      company: 'Descript',
      isPaid: true,
      category: '音视频处理',
      description:
        'Descript是一款集成了AI技术的音视频编辑工具，提供文本转语音、语音克隆、自动转录等功能。它以直观的文本编辑界面为特色，简化了视频和音频的编辑流程，适合内容创作者和专业人士使用。',
      website: 'https://www.descript.com',
    },
    {
      id: '12',
      name: 'Runway ML',
      purpose: 'AI视频生成与编辑',
      company: 'Runway',
      isPaid: true,
      category: '音视频处理',
      description:
        'Runway ML是一款AI创意工具集，专注于视频生成和编辑。它提供了多种AI模型，支持风格转换、对象移除、深度合成等功能，为视频创作者提供了强大的工具，简化了复杂的视频制作流程。',
      website: 'https://runwayml.com',
    },
  ];

  const tool = tools.find(t => t.id === id);
  if (tool) {
    return Promise.resolve({ data: tool });
  } else {
    return Promise.reject(new Error('Tool not found'));
  }
}
