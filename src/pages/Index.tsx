import MainHeader from "@/components/MainHeader";
import SearchInput from "@/components/SearchInput";

interface IndexProps {
  onStartChat: (initialMessage: string) => void;
}

const Index = ({ onStartChat }: IndexProps) => {
  return (
    <main className="flex-1 p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <MainHeader />
        <SearchInput onEnter={onStartChat} />
      </div>
    </main>
  );
};

export default Index;
