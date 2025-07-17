import { Link } from "wouter";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "tachometer-alt" },
    { id: "system", label: "System", icon: "server" },
    { id: "security", label: "Security", icon: "shield-alt" },
    { id: "network", label: "Network", icon: "network-wired" },
    { id: "terminal", label: "Terminal", icon: "terminal" },
    { id: "logs", label: "Logs", icon: "file-alt" },
    { id: "settings", label: "Settings", icon: "cog" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-primary shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 bg-primary border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <i className="fas fa-microchip text-2xl text-white"></i>
          <span className="text-xl font-bold text-white">PiMaint</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8">
        <div className="px-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">
            Navigation
          </h3>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-secondary ${
              activeSection === item.id
                ? "text-white bg-secondary border-r-4 border-success"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <i className={`fas fa-${item.icon} mr-3`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="absolute bottom-0 w-full p-4 bg-primary border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-sm"></i>
          </div>
          <div>
            <p className="text-sm text-white">pi@raspberrypi</p>
            <p className="text-xs text-gray-300">System Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
