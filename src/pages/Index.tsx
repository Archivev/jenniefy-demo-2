
import Sidebar from "@/components/Sidebar";
import MainHeader from "@/components/MainHeader";
import SearchInput from "@/components/SearchInput";

interface IndexProps {
  onStartChat: () => void;
}

const Index = ({ onStartChat }: IndexProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto pt-12">
          <MainHeader />
          <SearchInput onEnter={onStartChat} />
        </div>
      </main>
    </div>
  );
};

export default Index;
