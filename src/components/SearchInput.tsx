
import { ArrowUpRight } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="relative w-full max-w-4xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <ArrowUpRight className="w-6 h-6 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Enter the product link or title to find more suitable influencers for promotion"
        className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
};

export default SearchInput;
