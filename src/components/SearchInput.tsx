import { ArrowUpRight } from "lucide-react";
import { useState, ChangeEvent, useRef, useEffect } from "react";

interface SearchInputProps {
  onEnter: (value: string) => void;
}

const SearchInput = ({ onEnter }: SearchInputProps) => {
  const [value, setValue] = useState("");
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onEnter(value);
        setValue("");
      }
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
        />
        <div className="absolute right-6 top-6">
          <div 
            onClick={() => {
              if (value.trim()) {
                onEnter(value);
                setValue("");
              }
            }}
            className="w-10 h-10 bg-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
