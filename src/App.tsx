
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="relative min-h-screen">
          <div className={`transition-opacity duration-500 ${showChat ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <Index onStartChat={() => setShowChat(true)} />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-500 ${showChat ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Chat onBack={() => setShowChat(false)} />
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
