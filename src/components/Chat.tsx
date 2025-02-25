
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface ChatProps {
  onBack: () => void;
}

const Chat = ({ onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1);
  const [displayedContent, setDisplayedContent] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsThinking(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      setIsThinking(false);
      const aiResponse = {
        role: "assistant",
        content: "Based on your requirements, I recommend focusing on TikTok and Instagram as your primary platforms. These platforms have a strong presence in the United States and are ideal for product demonstrations. Look for influencers with 10k-50k followers who specifically create content about personal care products or lifestyle content."
      };
      setMessages([...newMessages, aiResponse]);
      setCurrentTypingIndex(newMessages.length);
      setDisplayedContent("");
      typeMessage(aiResponse.content, () => {
        setCurrentTypingIndex(-1);
      });
    }, 2000);
  };

  // Initial greeting message with typing effect
  useEffect(() => {
    const initialMessage = {
      role: "assistant",
      content: "I need more information, such as target market, number of promoters, etc., so that I can generate the best plan for you"
    };
    setMessages([initialMessage]);
    setCurrentTypingIndex(0);
    typeMessage(initialMessage.content, () => {
      setCurrentTypingIndex(-1);
    });
  }, [typeMessage]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-100 py-4 px-6">
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
              className={`p-4 rounded-2xl ${
                message.role === "assistant"
                  ? "bg-gray-50"
                  : "bg-blue-50"
              } max-w-3xl`}
            >
              {index === currentTypingIndex ? displayedContent : message.content}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center space-x-2 text-gray-400 p-4 bg-gray-50 rounded-2xl">
              <span className="font-medium">Jennie is thinking</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
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
  );
};

export default Chat;
