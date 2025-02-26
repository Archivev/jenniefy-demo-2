import { ShoppingBag, Instagram, Youtube, MapPin, Check, Share2, User2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  onFormChange: (formData: any) => void;
}

// 模拟SSE接口获取标签
const fetchTagsSSE = (callback: (tags: string[]) => void) => {
  // 模拟SSE连接
  const tags = ["United States", "VR: 2~%", "Active: ~60 Days", "三次元", "Lifestyle", "Fashion"];
  let index = 0;
  
  const interval = setInterval(() => {
    if (index < tags.length) {
      // 每次发送一个标签
      callback(tags.slice(0, index + 1));
      index++;
    } else {
      clearInterval(interval);
    }
  }, 300);
  
  return () => clearInterval(interval);
};

// 模拟SSE接口获取创作者
const fetchCreatorsSSE = (callback: (creators: Creator[]) => void) => {
  const mockCreators: Creator[] = Array(20).fill(null).map((_, i) => ({
    name: `Jennifer ${i+1}`,
    portrait: "18-30",
    location: "US",
    followers: `${Math.floor(Math.random() * 100) + 1}W`,
    er: `${Math.floor(Math.random() * 10) + 1}${Math.floor(Math.random() * 10)}%`,
    age: "18-30",
    platforms: ["instagram", "tiktok", "youtube"],
    period: "10W"
  }));
  
  let index = 0;
  
  const interval = setInterval(() => {
    if (index < mockCreators.length) {
      // 每次发送一批创作者
      callback(mockCreators.slice(0, index + 3));
      index += 3;
    } else {
      clearInterval(interval);
    }
  }, 500);
  
  return () => clearInterval(interval);
};

const CreatorSidebar = ({ isOpen, productName, creators: initialCreators, onClose, onFormChange }: CreatorSidebarProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingCreators, setIsLoadingCreators] = useState(true);
  const [localProductName, setLocalProductName] = useState(productName);
  const [formData, setFormData] = useState({
    productName: productName,
    tags: [] as string[],
    selectedCreators: [] as string[]
  });
  
  // 更新表单数据并通知父组件
  const updateFormData = (newData: Partial<typeof formData>) => {
    const updatedFormData = { ...formData, ...newData };
    setFormData(updatedFormData);
    onFormChange(updatedFormData);
  };
  
  // 处理产品名称变更
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalProductName(newName);
    updateFormData({ productName: newName });
  };
  
  useEffect(() => {
    // 使用SSE获取标签
    setIsLoadingTags(true);
    const cleanupTags = fetchTagsSSE((fetchedTags) => {
      setTags(fetchedTags);
      updateFormData({ tags: fetchedTags });
      if (fetchedTags.length === 6) { // 假设总共有6个标签
        setIsLoadingTags(false);
      }
    });
    
    // 使用SSE获取创作者
    setIsLoadingCreators(true);
    const cleanupCreators = fetchCreatorsSSE((fetchedCreators) => {
      setCreators(fetchedCreators);
      if (fetchedCreators.length === 20) { // 假设总共有20个创作者
        setIsLoadingCreators(false);
      }
    });
    
    return () => {
      cleanupTags();
      cleanupCreators();
    };
  }, []);
  
  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    updateFormData({ tags: newTags });
  };
  
  const toggleCreatorSelection = (index: number) => {
    const newCreators = [...creators];
    newCreators[index].selected = !newCreators[index].selected;
    setCreators(newCreators);
    
    const selectedCreatorNames = newCreators
      .filter(creator => creator.selected)
      .map(creator => creator.name);
    
    updateFormData({ selectedCreators: selectedCreatorNames });
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
            <input
              type="text"
              value={localProductName}
              onChange={handleProductNameChange}
              className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
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
              {isLoadingTags ? (
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
          {isLoadingCreators ? (
            <div className="text-center py-4 text-gray-500">加载创作者中...</div>
          ) : (
            creators.map((creator, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-xl transition-colors ${creator.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{creator.name}</h3>
                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Instagram className="w-4 h-4" />
                        <Share2 className="w-4 h-4" />
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{creator.location}</span>
                      </div>
                      <span className="text-sm">{creator.followers}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleCreatorSelection(index)}
                      className={`p-2 rounded-lg transition-colors ${
                        creator.selected 
                          ? 'bg-black text-white' 
                          : 'text-black hover:bg-black hover:text-white'
                      }`}
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
                    <div className="font-medium">{creator.age}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">PV</div>
                    <div className="font-medium">{creator.followers}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">ER</div>
                    <div className="font-medium">{creator.er}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-3.5 bg-[#16181d] text-white rounded-xl hover:bg-black transition-colors">
            邀请所有相似创作者
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSidebar;
