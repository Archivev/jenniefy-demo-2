import { ArrowLeft, User, ShoppingBag, Tag, Search, Mail, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatorSidebar from "./CreatorSidebar";

interface ChatProps {
  onBack: () => void;
  initialMessage: string;
}

const Chat = ({ onBack, initialMessage }: ChatProps) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayedContent, setDisplayedContent] = useState("");
  const [showCreators, setShowCreators] = useState(false);
  const [productName, setProductName] = useState("");
  const [formData, setFormData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingCreators, setIsLoadingCreators] = useState(false);
  const [creators, setCreators] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [isRefreshingCreators, setIsRefreshingCreators] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");
  const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(null);
  const [thinkingElapsedTime, setThinkingElapsedTime] = useState<number>(0);
  const [thinkingComplete, setThinkingComplete] = useState<boolean>(false);
  const [previousThinkingStage, setPreviousThinkingStage] = useState<string>("");
  const [animatingStage, setAnimatingStage] = useState<boolean>(false);
  const [showThinkingIndicator, setShowThinkingIndicator] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const typeMessage = useCallback((content: string, callback: () => void) => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedContent((prev) => prev + content[index]);
      index++;
      if (index === content.length) {
        clearInterval(interval);
        callback();
      }
    }, 30);
  }, []);

  // 添加滚动到底部的函数，使用平滑滚动效果
  const scrollToBottom = () => {
    // 使用更具体的选择器找到消息容器
    const messageContainer = document.querySelector('.flex-1.overflow-y-auto');
    if (messageContainer) {
      // 使用平滑滚动
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 当消息列表更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedContent, isThinking]);

  // 获取表单变更内容
  const getFormChanges = (oldData: any, newData: any): string | null => {
    if (!oldData) return null;
    
    const changes = [];
    console.log("oldData:", oldData);
    console.log("newData:", newData);

    // 只有当新旧值都存在且不相等时才添加产品名称变更
    if (oldData.productName && newData.productName && oldData.productName !== newData.productName) {
      changes.push(`product name changed from "${oldData.productName}" to "${newData.productName}"`);
    }
    
    if (JSON.stringify(oldData.tags) !== JSON.stringify(newData.tags)) {
      // 找出添加和移除的标签
      const added = newData.tags.filter((t: string) => !oldData.tags.includes(t));
      const removed = oldData.tags.filter((t: string) => !newData.tags.includes(t));
      
      if (added.length > 0) {
        changes.push(`add tag: ${added.join(', ')}`);
      }
      
      if (removed.length > 0) {
        changes.push(`remove tag: ${removed.join(', ')}`);
      }
    }
    
    if (JSON.stringify(oldData.selectedCreators) !== JSON.stringify(newData.selectedCreators)) {
      const added = newData.selectedCreators.filter((c: string) => !oldData.selectedCreators.includes(c));
      const removed = oldData.selectedCreators.filter((c: string) => !newData.selectedCreators.includes(c));
      
      if (added.length > 0) {
        changes.push(`select creator: ${added.join(', ')}`);
      }
      
      if (removed.length > 0) {
        changes.push(`unselect creator: ${removed.join(', ')}`);
      }
    }
    
    return changes.length > 0 ? changes.join('；') : null;
  };

  // 处理表单数据变更
  const handleFormChange = (newFormData: any, isUserAction = false) => {
    // 确保保留现有的 productName
    const updatedFormData = {
      ...newFormData,
      productName: newFormData.productName || formData?.productName || ''
    };
    
    // 避免重复设置相同的数据
    if (JSON.stringify(formData) === JSON.stringify(updatedFormData)) {
      return;
    }
    
    // 如果有变更，且是用户主动操作，自动向AI发送消息
    if (formData && isUserAction) {
      const changes = getFormChanges(formData, updatedFormData);
      if (changes) {
        // 检查是否是标签相关操作（添加或移除）
        const isTagRemoval = changes.includes('remove tag:');
        const isTagAddition = changes.includes('add tag:');
        const isTagOperation = isTagRemoval || isTagAddition;

        // 如果是标签操作，更新本地标签状态
        if (isTagOperation) {
          setTags(updatedFormData.tags);
        }

        // 
        const userMessage = {
          role: "user",
          content: `I've made the following changes: ${changes}`
        };
        
        setMessages(prev => [...prev, userMessage]);

        // 使用真实的AI调用替代模拟响应
        handleUserInput(
          `I've made the following changes: ${changes}`, 
          (chunk, done) => {
            // 流式响应处理
          },
          // 如果是标签操作，则传递跳过标签获取的选项和当前标签
          isTagOperation ? { skipTagFetch: true, currentTags: updatedFormData.tags } : undefined
        );
      }
    }
    
    setFormData(updatedFormData);
  };

  useEffect(() => {
    const setupInitialMessages = async () => {
      if (initialMessage) {
        // 使用相同的流式处理函数处理初始消息
        handleUserInput(initialMessage, (chunk, done) => {
          // 初始消息的流式响应处理
        });
      }
    };

    setupInitialMessages();
  }, [initialMessage]); // 仅在 initialMessage 变化时执行

  // 处理用户输入并发送到后端
  const handleUserInput = async (input: string, onStreamResponse: (chunk: string, done: boolean) => void, options?: { skipTagFetch?: boolean, currentTags?: string[] }) => {
    // 添加用户消息到消息列表
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    
    // 显示AI思考状态
    setIsThinking(true);
    setShowThinkingIndicator(true);
    setThinkingComplete(false);
    setThinkingStartTime(Date.now());
    setThinkingElapsedTime(0);
    setThinkingStage("");
    
    try {
      // 创建 EventSource 连接
      const eventSource = new EventSource(`http://localhost:5001/chat?message=${encodeURIComponent(input)}`);
      
      // 创建一个空的AI响应
      const aiResponse = { role: "assistant", content: "" };
      setMessages([...newMessages, aiResponse]);
      setCurrentTypingIndex(newMessages.length);
      setDisplayedContent("");
      
      // 处理流式响应
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("SSE data received:", data); // 添加调试日志
          
          // 处理思考状态更新
          if (data.thinking) {
            console.log("Thinking stage update:", data.stage); // 添加调试日志
            
            // 保存上一个思考阶段，用于动画
            if (thinkingStage !== data.stage) {
              setPreviousThinkingStage(thinkingStage);
              setThinkingStage(data.stage || "");
              
              // 触发动画
              setAnimatingStage(false);
              setTimeout(() => {
                setAnimatingStage(true);
              }, 50);
            }
            
            return; // 确保在处理思考状态后返回，不继续处理
          }
          
          if (data.done) {
            // 响应完成
            eventSource.close();
            setThinkingStage("");
            setCurrentTypingIndex(-1);
            
            // 检查并处理状态更新
            if (data.state) {
              
              // 根据不同状态执行不同操作
              switch (data.state) {
                case "searchinginfluencers":
                  setIsThinking(true);
                  setShowCreators(true);
                  setProductName(data.product_name);
                  // 同时更新 formData 中的 productName
                  setFormData(prev => ({
                    ...prev,
                    productName: data.product_name
                  }));
                  // 发起达人搜索请求，传递选项
                  searchCreators(options);
                  break;
                case "tag_updated":
                  // 处理标签更新
                  if (data.tags && Array.isArray(data.tags)) {
                    // 更新标签状态
                    setTags(data.tags);
                    // 更新表单数据
                    setFormData(prev => ({
                      ...prev,
                      tags: data.tags
                    }));
                    
                    // 如果需要，可以在这里触发创作者搜索
                    if (data.refresh_creators) {
                      searchCreators({ skipTagFetch: true, currentTags: data.tags });
                    }
                  }
                  break;
                case "preparing_email":
                  // 可能显示邮件编辑界面
                  break;
                case "initial":
                  // 重置界面
                  setShowCreators(false);
                  setIsThinking(false);
                  setThinkingComplete(true);
                  setShowThinkingIndicator(false);
                  break;
                default:
                  // 其他状态处理
                  break;
              }
            }
            onStreamResponse("", true);
            return;
          }
          
          if (data.content) {
            // 更新显示内容
            setDisplayedContent(prev => prev + data.content);
            
            // 更新消息列表中的AI响应
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content += data.content;
              return updated;
            });
            
            // 通知父组件有新的响应块
            onStreamResponse(data.content, false);
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };
      
      // 处理错误
      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource.close();
        setIsThinking(false);
        setCurrentTypingIndex(-1);
        onStreamResponse("", true);
      };
    } catch (error) {
      console.error("Error setting up SSE:", error);
      setIsThinking(false);
      setCurrentTypingIndex(-1);
    }
  };

  // 修改 handleSubmit 函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 使用新的流式处理函数
    handleUserInput(inputValue, (chunk, done) => {
      // 可以在这里添加额外的处理逻辑
    });
    
    setInputValue("");
  };

  // 获取标签的函数
  const fetchTags = async (userMessage: string) => {
    setIsLoadingTags(true);
    
    try {
      const response = await fetch('http://localhost:5001/get_tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          additional_query: userMessage
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const fetchedTags = data.tags;
        setTags(fetchedTags);
        
        // 更新表单数据中的标签
        setFormData(prev => ({
          ...prev,
          tags: fetchedTags
        }));
        
        return fetchedTags;
      } else {
        console.error("获取标签失败:", data.error);
        return [];
      }
    } catch (error) {
      console.error("获取标签请求出错:", error);
      return [];
    } finally {
      setIsLoadingTags(false);
    }
  };

  // 获取创作者的函数
  const fetchCreators = async (userMessage: string, currentTags: string[]) => {
    // 如果已有创作者数据，则显示蒙层
    if (creators.length > 0) {
      setIsRefreshingCreators(true);
    } else {
      setIsLoadingCreators(true);
    }
    
    try {
      // 构建请求体
      const requestBody = {
        query: userMessage,
        product_info: {
          name: productName,
          category: "" // 如果有类目信息，可以在这里添加
        }
      };
      
      const response = await fetch('http://localhost:5001/search_creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.success && data.creators) {
        // 更新创作者列表
        setThinkingStage("已找到匹配的创作者");
        setThinkingComplete(true);
        const formattedCreators = await Promise.all(data.creators.map(async (creator: any) => {
          // 获取创作者头像
          let avatarUrl = "";
          try {
            const avatarResponse = await fetch(`https://api.jennie.im/opensearch/genIndexDataByTtsCreatorId?tts_creator_id=${creator.tts_creator_id}`);
            const avatarData = await avatarResponse.json();
            if (avatarData && avatarData.creatorAuthorIcon) {
              avatarUrl = avatarData.creatorAuthorIcon;
            }
          } catch (error) {
            console.error("获取创作者头像失败:", error);
          }
          
          return {
            creator_handle: creator.creator_handle,
            portrait: "18-30", // 默认值
            location: creator.country || "US",
            followers: formatNumber(creator.author_fans),
            er: formatEngagementRate(creator.creator_video_engagement), // 将互动率格式化为百分比
            video_ten_avg_vv: formatNumber(creator.video_ten_avg_vv), // 添加新字段并格式化
            age: "18-30",
            platforms: ["instagram", "tiktok", "youtube"],
            period: "10W",
            id: creator.tts_creator_id,
            avatar: avatarUrl // 添加头像URL
          };
        }));
        
        setCreators(formattedCreators);
        
        // 更新表单数据中的创作者
        setFormData(prev => ({
          ...prev,
          selectedCreators: []
        }));
      } else {
        console.error("获取创作者失败:", data.error);
        setCreators([]);
        setThinkingComplete(false);
        setIsThinking(false); // 确保思考状态结束
      }
    } catch (error) {
      console.error("获取创作者请求出错:", error);
      setCreators([]);
      setThinkingComplete(false);
      setIsThinking(false); // 确保思考状态结束
    } finally {
      setIsLoadingCreators(false);
      setIsRefreshingCreators(false);
    }
  };

  // 修改搜索达人的主函数，添加参数控制是否跳过标签获取
  const searchCreators = async (options?: { skipTagFetch?: boolean, currentTags?: string[] }) => {
    try {
      // 获取最后一条用户消息作为查询
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
      
      // 初始化表单数据（如果尚未初始化）
      if (!formData) {
        setFormData({
          productName: productName,
          tags: [],
          selectedCreators: []
        });
      }
      
      let tagsToUse: string[] = [];
      
      // 根据选项决定是否跳过标签获取
      if (options?.skipTagFetch && options.currentTags) {
        // 直接使用传入的标签
        tagsToUse = options.currentTags;
      } else {
        // 正常获取标签流程
        setThinkingStage("更新标签..."); // 添加思考阶段
        tagsToUse = await fetchTags(lastUserMessage);
      }
      
      // 使用标签来获取创作者
      setThinkingStage("搜索匹配的创作者中..."); // 更新思考阶段
      await fetchCreators(lastUserMessage, tagsToUse);
      
      // 设置思考完成状态
      setThinkingStage("已找到匹配的创作者");
      setThinkingComplete(true);
      
      // 只清除isThinking状态，但保持思考模块的显示
      setIsThinking(false);
    } catch (error) {
      console.error("搜索达人流程失败:", error);
      setTags([]);
      setCreators([]);
      setThinkingStage("搜索过程中出现错误");
      setThinkingComplete(false);
      setIsThinking(false);
      
      // 重置表单数据
      setFormData({
        productName: productName,
        tags: [],
        selectedCreators: []
      });
    }
  };

  // 在组件顶部添加这些样式
  const thinkingStageEnterAnimation = "transition-all duration-300 transform translate-y-0 opacity-100";
  const thinkingStageExitAnimation = "transition-all duration-300 transform -translate-y-full opacity-0";

  // 修改思考状态显示组件，解决布局问题
  const renderThinkingIndicator = () => {
    // 只有当showThinkingIndicator为true时才显示
    if (!showThinkingIndicator) return null;
    
    // 格式化耗时，使用毫秒级精度
    const formatElapsedTime = (seconds: number) => {
      if (seconds < 60) {
        return `${seconds.toFixed(1)}s`; // 显示一位小数
      }
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds.toFixed(1)}s`; // 分钟数和秒数，秒数显示一位小数
    };

    return (
      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-xl max-w-[80%]">
        <div className="w-5 h-5 relative">
          {thinkingComplete ? (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-medium text-gray-700">
            {thinkingComplete ? "Complete" : "Jennie is thinking"}
          </p>
          <div className="relative h-5 overflow-hidden w-full">
            {/* 上一个思考阶段（动画退出） */}
            {animatingStage && previousThinkingStage && (
              <div className="absolute w-full text-xs text-gray-500 truncate transition-all duration-300 transform -translate-y-full opacity-0">
                {previousThinkingStage} {thinkingElapsedTime > 0 && `(${formatElapsedTime(thinkingElapsedTime)})`}
              </div>
            )}
            
            {/* 当前思考阶段（动画进入） */}
            {thinkingStage && (
              <div 
                className="text-xs text-gray-500 truncate transition-all duration-300 transform"
                style={{ 
                  transform: animatingStage ? 'translateY(0)' : 'translateY(100%)',
                  opacity: animatingStage ? 1 : 0
                }}
              >
                {thinkingStage} {thinkingElapsedTime > 0 && `(${formatElapsedTime(thinkingElapsedTime)})`}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 修改计时器逻辑，使用毫秒级精度
  useEffect(() => {
    let timer: number | null = null;
    
    if (isThinking && thinkingStartTime && !thinkingComplete) {
      // 使用更高频率的计时器，每100毫秒更新一次
      timer = window.setInterval(() => {
        // 计算毫秒级的时间差
        setThinkingElapsedTime((Date.now() - thinkingStartTime) / 1000);
      }, 100); // 每100毫秒更新一次，以获得更平滑的显示效果
    }
    
    return () => {
      if (timer !== null) {
        clearInterval(timer);
      }
    };
  }, [isThinking, thinkingStartTime, thinkingComplete]);

  // 添加清除记忆的处理函数
  const handleClearMemory = async () => {
    // 添加确认对话框
    if (!window.confirm("确定要清除所有对话记忆吗？此操作不可撤销。")) {
      return;
    }
    
    setIsClearing(true);
    
    try {
      // 调用后端接口清除记忆
      const response = await fetch('http://localhost:5001/clear_memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 重置前端状态
        setMessages([]);
        setInputValue("");
        setIsThinking(false);
        setCurrentTypingIndex(-1);
        setDisplayedContent("");
        setShowCreators(false);
        setProductName("");
        setFormData({
          productName: "",
          tags: [],
          selectedCreators: []
        });
        setCreators([]);
        setTags([]);
        setIsLoadingCreators(false);
        setIsLoadingTags(false);
        setIsRefreshingCreators(false);
        setThinkingStage("");
        setThinkingStartTime(null);
        setThinkingElapsedTime(0);
        setThinkingComplete(false);
        setPreviousThinkingStage("");
        setAnimatingStage(false);
        setShowThinkingIndicator(false);
        
        // 添加系统消息提示用户记忆已清除
        setMessages([{
          role: "assistant",
          content: "Memory has been cleared. You can start a new conversation."
        }]);
      } else {
        console.error("清除记忆失败:", data.error);
      }
    } catch (error) {
      console.error("清除记忆请求出错:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className={`flex h-screen transition-all duration-500 ${showCreators ? 'w-[50%]' : 'w-[100%]'}`}>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-gray-100 py-4 px-6 bg-white flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Promoting by Jennie</span>
            </button>
            
            <button 
              onClick={handleClearMemory}
              disabled={isClearing}
              className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                isClearing 
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                  : 'text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400'
              }`}
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-1"></div>
                  <span>清除中...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  <span>clear memory</span>
                </>
              )}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 ${
                  message.role === "assistant" ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="https://fakeimg.pl/40/fff/?text=Jenniefy&font=noto" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="https://fakeimg.pl/40/fff/?text=Me&font=noto" alt="User" />
                      <AvatarFallback>Me</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div
                  className={`p-4 rounded-2xl max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-gray-50"
                      : "bg-blue-50"
                  }`}
                >
                  {index === currentTypingIndex ? displayedContent : message.content}
                </div>
              </div>
            ))}
            {showThinkingIndicator && (
              <div className="flex justify-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                {renderThinkingIndicator()}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 bg-white flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your requisition"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-300"
              />
              <button
                type="submit"
                disabled={isThinking}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 ${
                  isThinking ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
                } rounded-lg transition-colors`}
              >
                {isThinking ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white rotate-90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <CreatorSidebar 
        isOpen={showCreators}
        productName={productName}
        creators={creators}
        tags={tags}
        onClose={() => setShowCreators(false)}
        onFormChange={handleFormChange}
        isLoading={isLoadingCreators}
        isLoadingTags={isLoadingTags}
        isRefreshing={isRefreshingCreators}
      />
    </div>
  );
};

// 添加在组件外部或组件内部
const formatNumber = (num: number | undefined | null) => {
  if (num === undefined || num === null) return '0';
  return num >= 10000 ? (num / 10000).toFixed(1) + 'w' : num.toString();
};

// 添加格式化互动率的函数
const formatEngagementRate = (rate: number | undefined | null) => {
  if (rate === undefined || rate === null || rate === 0) return '-';
  // 将小数转换为百分比并保留两位小数
  return (rate * 100).toFixed(2) + '%';
};

export default Chat;
