import { ArrowUpRight } from "lucide-react";
import { useState, ChangeEvent, useRef, useEffect } from "react";

interface SearchInputProps {
  onEnter: (value: string, onStreamResponse: (chunk: string, done: boolean) => void) => void;
}

const SearchInput = ({ onEnter }: SearchInputProps) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      setIsLoading(true);
      
      // 定义流式响应的回调函数
      const handleStreamResponse = (chunk: string, done: boolean) => {
        if (done) {
          setIsLoading(false);
        }
      };
      
      // 调用父组件的回调，传入消息和流式响应处理函数
      onEnter(value, handleStreamResponse);
      setValue("");
      adjustHeight();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <div className="relative w-full max-w-4xl mt-12">
      <div className="absolute left-6 top-6">
        <ArrowUpRight className="w-6 h-6 text-gray-300" />
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Enter the product link or title to find more suitable influencers for promotion"
          className="w-full pl-16 pr-16 py-6 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-200 focus:ring-0 transition-all resize-none min-h-[72px] max-h-[200px] overflow-y-auto text-lg placeholder:text-gray-300"
          style={{ height: "72px" }}
          disabled={isLoading}
        />
        <div className="absolute right-6 top-6">
          <div 
            onClick={handleSubmit}
            className={`w-10 h-10 ${isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} rounded-lg flex items-center justify-center cursor-pointer transition-colors`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ArrowUpRight className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
