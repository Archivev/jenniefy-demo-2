
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { useState } from "react";
import Chat from "./components/Chat";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import SearchInput from "@/components/SearchInput";
import MainHeader from "@/components/MainHeader";

const queryClient = new QueryClient();

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const handleStartChat = (message: string) => {
    setInitialMessage(message);
    setShowChat(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 relative overflow-hidden">
              <div className={`w-full transition-all duration-500 ${showChat ? 'translate-y-[-100vh]' : 'translate-y-0'}`}>
                <main className="p-8">
                  <div className="max-w-4xl mx-auto pt-12">
                    <MainHeader />
                    <SearchInput onEnter={handleStartChat} />
                  </div>
                </main>
              </div>
              <div 
                className={`absolute inset-0 w-full transition-all duration-500 ${
                  showChat ? 'translate-y-0' : 'translate-y-[100vh]'
                }`}
                style={{ marginLeft: 0 }}
              >
                <Chat initialMessage={initialMessage} onBack={() => setShowChat(false)} />
              </div>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
