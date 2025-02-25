
import { MessageSquare, ArrowUpRight, LayoutGrid, MousePointer2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: <ArrowUpRight className="w-5 h-5" />, label: "Promote", path: "/" },
    { icon: <LayoutGrid className="w-5 h-5" />, label: "Process", path: "/process" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "Chat", path: "/chat" },
    { icon: <MousePointer2 className="w-5 h-5" />, label: "Hover", path: "/hover" },
  ];

  return (
    <div className="w-[240px] min-h-screen bg-sidebar-bg border-r border-gray-200 p-4 animate-slide-in">
      <div className="mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ArrowUpRight className="w-6 h-6" />
          JENNIEFY
        </h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "hover:bg-sidebar-hover"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
