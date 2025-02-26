import { ArrowLeft } from "lucide-react";
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
  const [productName, setProductName] = useState("Philips Norelco Shaver 2400,Rechargeable..");
  const [formData, setFormData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock creators data
  const mockCreators = [
    {
      name: "Jennifer",
      portrait: "18-30",
      location: "US",
      followers: "123456",
      er: "55%",
      age: "18-30",
      platforms: ["instagram", "tiktok", "youtube"],
      period: "10W"
    },
    // ... Add more mock creators as needed
  ];

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

  // 处理表单数据变更
  const handleFormChange = (newFormData: any) => {
    setFormData(newFormData);
    
    // 如果有变更，自动向AI发送消息
    if (formData) {
      const changes = getFormChanges(formData, newFormData);
      if (changes) {
        const userMessage = {
          role: "user",
          content: `I've made the following changes: ${changes}`
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // 模拟AI响应
        setIsThinking(true);
        setTimeout(() => {
          setIsThinking(false);
          const aiResponse = {
            role: "assistant",
            content: `I've updated the recommendations based on your changes. ${changes.includes('创作者') ? 'The creator list has been adjusted. ' : ''}${changes.includes('标签') ? 'Results have been filtered according to the new tags. ' : ''}${changes.includes('产品名称') ? 'Product-related recommendations have been updated. ' : ''}`
          };
          setMessages(prev => [...prev, aiResponse]);
          setCurrentTypingIndex(messages.length + 1);
          setDisplayedContent("");
          typeMessage(aiResponse.content, () => {
            setCurrentTypingIndex(-1);
          });
        }, 1500);
      }
    }
    
    setFormData(newFormData);
  };
  
  // 获取表单变更内容
  const getFormChanges = (oldData: any, newData: any): string | null => {
    if (!oldData) return null;
    
    const changes = [];
    
    if (oldData.productName !== newData.productName) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsThinking(true);

    // If this is the second message, show the creator sidebar
    if (messages.length === 2) {
      setTimeout(() => {
        setIsThinking(false);
        const aiResponse = {
          role: "assistant",
          content: "Based on your requirements, I've found some creators that match your criteria. You can review them in the sidebar. Feel free to adjust the tags or select suitable creators, and I'll optimize my recommendations based on your choices."
        };
        setMessages([...newMessages, aiResponse]);
        setCurrentTypingIndex(newMessages.length);
        setDisplayedContent("");
        typeMessage(aiResponse.content, () => {
          setCurrentTypingIndex(-1);
          setShowCreators(true);
        });
      }, 2000);
    } else {
      // First message response
      setTimeout(() => {
        setIsThinking(false);
        const aiResponse = {
          role: "assistant",
          content: "I need more information, such as target market, number of promoters, etc., so that I can generate the best plan for you."
        };
        setMessages([...newMessages, aiResponse]);
        setCurrentTypingIndex(newMessages.length);
        setDisplayedContent("");
        typeMessage(aiResponse.content, () => {
          setCurrentTypingIndex(-1);
        });
      }, 2000);
    }
  };

  useEffect(() => {
    const setupInitialMessages = async () => {
      if (initialMessage) {
        const userMessage = { role: "user", content: initialMessage };
        const aiMessage = {
          role: "assistant",
          content: "I need more information, such as target market, number of promoters, etc., so that I can generate the best plan for you."
        };
        
        setMessages([userMessage]);
        
        setTimeout(() => {
          setIsThinking(true);
          setTimeout(() => {
            setIsThinking(false);
            setMessages([userMessage, aiMessage]);
            setCurrentTypingIndex(1);
            setDisplayedContent("");
            typeMessage(aiMessage.content, () => {
              setCurrentTypingIndex(-1);
            });
          }, 1500);
        }, 500);
      }
    };

    setupInitialMessages();
  }, [initialMessage, typeMessage]);

  return (
    <div className={`flex h-screen transition-all duration-500 ${showCreators ? 'w-[50%]' : 'w-[100%]'}`}>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-gray-100 py-4 px-6 bg-white flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-center">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Promoting by Jennie</span>
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
                      <AvatarImage src="/avatar-ai.png" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/avatar-user.png" alt="User" />
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
            {isThinking && (
              <div className="flex items-start space-x-4">
                <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                  <AvatarImage src="/avatar-ai.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 text-gray-400 p-4 bg-gray-50 rounded-2xl">
                  <span className="font-medium">Jennie is thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
                  </div>
                </div>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <CreatorSidebar 
        isOpen={showCreators}
        productName={productName}
        creators={mockCreators}
        onClose={() => setShowCreators(false)}
        onFormChange={handleFormChange}
      />
    </div>
  );
};

export default Chat;
