
import { ShoppingBag, Instagram, Youtube, MapPin, Check, Share2, User2, X } from "lucide-react";

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

const CreatorSidebar = ({ isOpen, productName, creators, onClose }: CreatorSidebarProps) => {
  return (
    <div
      className={`fixed top-0 right-0 w-[480px] h-full bg-white border-l border-gray-200 transform transition-transform duration-500 ease-in-out ${
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
              {["United States", "VR: 2~%", "Active: ~60 Days", "三次元"].map((tag, index) => (
                <div key={index} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600">
                  <span>{tag}</span>
                  <X className="w-3.5 h-3.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-2 pb-6">
          {Array(20).fill(null).map((_, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl transition-colors ${
                index % 3 === 0 ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
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
                <button 
                  className={`p-2 rounded-lg transition-colors ${
                    index % 3 === 0 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
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
