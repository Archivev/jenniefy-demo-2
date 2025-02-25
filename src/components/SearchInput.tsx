
import { ArrowUpRight } from "lucide-react";
import { useState, ChangeEvent, useRef, useEffect } from "react";

const SearchInput = () => {
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

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <div className="relative w-full max-w-4xl my-12">
      <div className="absolute left-4 top-4">
        <ArrowUpRight className="w-6 h-6 text-gray-400" />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        rows={1}
        placeholder="Enter the product link or title to find more suitable influencers for promotion"
        className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
        style={{ height: "60px" }}
      />
    </div>
  );
};

export default SearchInput;
