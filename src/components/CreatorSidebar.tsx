
import { X, Instagram, Youtube, MapPin, Check, Share2 } from "lucide-react";

interface Creator {
  name: string;
  portrait: string;
  location: string;
  followers: string;
  er: string;
  age: string;
  platforms: string[];
  period: string;
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
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-100">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500">Product Name</label>
            <div className="mt-1 p-3 bg-white border border-gray-200 rounded-lg">
              {productName}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Creator Sample</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <button className="px-2 py-1 hover:bg-gray-100 rounded-md">
                  <span>Relevance</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded-full">United States ×</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">VR: 2~% ×</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">Active: ~60 Days ×</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full">三次元 ×</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {creators.map((creator, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{creator.name}</h3>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                    <Instagram className="w-4 h-4" />
                    <Share2 className="w-4 h-4" />
                    <Youtube className="w-4 h-4" />
                    <MapPin className="w-4 h-4" />
                    <span>{creator.location}</span>
                    <span>{creator.period}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Check className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <div className="text-gray-500">Portrait</div>
                  <div>{creator.age}</div>
                </div>
                <div>
                  <div className="text-gray-500">PV</div>
                  <div>{creator.followers}</div>
                </div>
                <div>
                  <div className="text-gray-500">ER</div>
                  <div>{creator.er}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Invite All Similar Creators
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSidebar;
