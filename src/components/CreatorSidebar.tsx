import { ShoppingBag, Instagram, Youtube, MapPin, Check, Share2, User2, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Creator {
  creator_handle: string;
  portrait: string;
  location: string;
  followers: string;
  er: string;
  age: string;
  platforms: string[];
  period: string;
  selected?: boolean;
  avatar?: string;
  id?: string;
  video_ten_avg_vv?: string;
}

export interface CreatorSidebarProps {
  isOpen: boolean;
  productName: string;
  creators: Creator[];
  tags: string[];
  onClose: () => void;
  onFormChange: (newFormData: any, isUserAction?: boolean) => void;
  isLoading: boolean;
  isLoadingTags: boolean;
  isRefreshing?: boolean;
}

// 添加自定义 TikTok 图标组件
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

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

const CreatorSidebar = ({ isOpen, productName, tags: initialTags, creators: initialCreators, onClose, onFormChange, isLoading = false, isLoadingTags, isRefreshing = false }: CreatorSidebarProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [localProductName, setLocalProductName] = useState(productName);
  const [formData, setFormData] = useState({
    productName: productName,
    tags: [] as string[],
    selectedCreators: [] as string[]
  });
  // 添加新标签的输入状态
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const newTagInputRef = useRef<HTMLInputElement>(null);
  
  // 添加一个状态来控制是否显示动画
  const [shouldAnimate, setShouldAnimate] = useState(true);
  
  useEffect(() => {
    // 当创作者数据变化时，确保启用动画
    if (initialCreators.length > 0) {
      // 先禁用动画，然后在下一帧启用，确保新数据有动画效果
      setShouldAnimate(false);
      
      // 使用 requestAnimationFrame 确保在下一帧渲染时启用动画
      const timeoutId = setTimeout(() => {
        setShouldAnimate(true);
      }, 200); // 短暂延迟以确保状态更新
      
      return () => clearTimeout(timeoutId);
    }
  }, [initialCreators]);
  
  useEffect(() => {
    // 比较标签内容是否有变化
    const hasNewTags = initialTags.some(tag => !tags.includes(tag));
    // 在初始加载或有新标签时更新
    if (initialTags.length > 0 && (tags.length === 0 || hasNewTags)) {
      setTags(initialTags);
    }
    
    // 直接使用传入的创作者数据
    setCreators(initialCreators);
  }, [initialCreators, initialTags]);
  
  useEffect(() => {
    // 当 productName 属性变化时，更新本地状态
    setLocalProductName(productName);
  }, [productName]);
  
  // 处理产品名称变更
  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLocalProductName(newName);
    updateFormData({ productName: newName }, true); // 用户主动操作
  };
  
  // 更新表单数据并通知父组件
  const updateFormData = (newData: Partial<typeof formData>, isUserAction = false) => {
    const updatedFormData = { ...formData, ...newData };
    setFormData(updatedFormData);
    onFormChange(updatedFormData, isUserAction);
  };
  
  // 移除标签
  const removeTag = (index: number) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
    
    // 通知父组件标签已更改
    updateFormData({ tags: updatedTags }, true);
  };
  
  const toggleCreatorSelection = (index: number) => {
    const newCreators = [...creators];
    newCreators[index].selected = !newCreators[index].selected;
    setCreators(newCreators);
    
    const selectedCreatorNames = newCreators
      .filter(creator => creator.selected)
      .map(creator => creator.creator_handle);
    
    updateFormData({ selectedCreators: selectedCreatorNames }, true); // 用户主动操作
  };

  // 添加新标签的处理函数
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      const newTag = newTagInput.trim();
      // 检查标签是否已存在
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        updateFormData({ tags: updatedTags }, true); // 用户主动操作
      }
      setNewTagInput("");
      setIsAddingTag(false);
    } else {
      setIsAddingTag(false);
    }
  };
  
  // 处理按键事件，按Enter添加标签，按Esc取消
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setNewTagInput("");
    }
  };
  
  // 当切换到添加标签模式时，自动聚焦输入框
  useEffect(() => {
    if (isAddingTag && newTagInputRef.current) {
      newTagInputRef.current.focus();
    }
  }, [isAddingTag]);

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
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {isLoadingTags ? (
                <div className="w-full flex items-center justify-center py-2">
                  <div className="relative w-5 h-5 mr-2">
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-t-black rounded-full animate-spin"></div>
                  </div>
                  <span className="text-sm text-gray-500 animate-pulse">loading tags...</span>
                </div>
              ) : (
                <>
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
                  
                  {isAddingTag ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600"
                    >
                      <input
                        ref={newTagInputRef}
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        onBlur={handleAddTag}
                        placeholder="Add tag..."
                        className="bg-transparent border-none outline-none w-24 text-sm"
                      />
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setIsAddingTag(true)}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors py-1.5"
                      title="Add custom tag"
                      style={{ marginTop: '3px' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        <path d="M12 5v14M5 12h14"/>
                      </svg>
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6 relative">
          {isRefreshing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-black rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 animate-pulse">update creators ...</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-black rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 animate-pulse">searching creators...</p>
            </div>
          ) : (
            <AnimatePresence mode="sync">
              {shouldAnimate && creators.map((creator, index) => (
                <motion.div
                  key={creator.id || creator.creator_handle + index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05, // 减少延迟时间，使动画更快
                    type: "spring",
                    stiffness: 100
                  }}
                  className={`p-4 rounded-xl transition-colors ${creator.selected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {creator.avatar ? (
                          <img 
                            src={creator.avatar} 
                            alt={creator.creator_handle} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://fakeimg.pl/40/fff/?text=' + creator.creator_handle.charAt(0).toUpperCase();
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {creator.creator_handle.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          <a 
                            href={`https://www.tiktok.com/@${creator.creator_handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:translate-y-[-2px] transition-transform duration-200 inline-block"
                          >
                            {creator.creator_handle}
                          </a>
                        </h3>
                        <div className="flex items-center space-x-3 text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Instagram className="w-4 h-4" />
                            <TikTokIcon className="w-4 h-4" />
                            <Youtube className="w-4 h-4" />
                          </div>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{creator.location}</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span className="text-sm">{creator.followers} Followers</span>
                        </div>
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
                      <div className="font-medium">{creator.video_ten_avg_vv || '-'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">ER</div>
                      <div className="font-medium">{creator.er}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
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
