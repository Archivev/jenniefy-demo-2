import { ShoppingBag, Instagram, Youtube, MapPin, Check, Share2, User2, X } from "lucide-react";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Creator {
  name: string;
  portrait: string;
  location: string;
  followers: string;
  er: string;
  age: string;
  platforms: string[];
  period: string;
  selected?: boolean;
}

interface CreatorSidebarProps {
  isOpen: boolean;
  productName: string;
  creators: Creator[];
  onClose: () => void;
}

// 模拟API调用获取标签
const fetchTags = (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["United States", "VR: 2~%", "Active: ~60 Days", "三次元", "Lifestyle", "Fashion"]);
    }, 500);
  });
};

const CreatorSidebar = ({ isOpen, productName, creators, onClose }: CreatorSidebarProps) => {
  const [tags, setTags] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      try {
        const fetchedTags = await fetchTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTags();
  }, []);
  
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div
      className={`fixed top-0 right-0 w-[50%] h-full bg-white border-l border-gray-200 transform transition-transform duration-500 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ marginLeft: 0 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-black">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-medium">Product Name</span>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              {productName}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-black">
                <User2 className="w-5 h-5" />
                <span className="font-medium">Creator Sample</span>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <span className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Relevance</span>
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <div className="text-sm text-gray-500">加载标签中...</div>
              ) : (
                <AnimatePresence>
                  {tags.map((tag, index) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600"
                    >
                      <span>{tag}</span>
                      <button 
                        onClick={() => removeTag(index)}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6">
          {Array(20).fill(null).map((_, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl transition-colors hover:bg-gray-50`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Jennifer</h3>
                  <div className="flex items-center space-x-3 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Instagram className="w-4 h-4" />
                      <Share2 className="w-4 h-4" />
                      <Youtube className="w-4 h-4" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">US</span>
                    </div>
                    <span className="text-sm">10W</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`p-2 rounded-lg transition-colors text-black hover:bg-black hover:text-white`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    className={`p-2 rounded-lg transition-colors text-black hover:bg-red-500 hover:text-white`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Portrait</div>
                  <div className="font-medium">18-30</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">PV</div>
                  <div className="font-medium">123456</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">ER</div>
                  <div className="font-medium">55%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-3.5 bg-[#16181d] text-white rounded-xl hover:bg-black transition-colors">
            Invite All Similar Creators
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSidebar;
