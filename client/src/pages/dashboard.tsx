import { useState } from "react";
import Sidebar from "@/components/sidebar";
import SystemMetrics from "@/components/system-metrics";
import ModuleCard from "@/components/module-card";
import RecentActivity from "@/components/recent-activity";
import TerminalModal from "@/components/terminal-modal";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Module } from "@/lib/types";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules'],
  });

  const { systemMetrics, executeModule } = useWebSocket();

  const handleModuleRun = (module: Module) => {
    setSelectedModule(module);
    setTerminalOpen(true);
    executeModule(module.id);
  };

  const systemModules = modules.filter(m => m.category === 'system');
  const securityModules = modules.filter(m => m.category === 'security');
  const networkModules = modules.filter(m => m.category === 'network');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">System Dashboard</h1>
                <p className="text-sm text-gray-600">Raspberry Pi Management Suite</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span className="text-sm text-gray-600">System Online</span>
                </div>
                <div className="text-sm text-gray-600">
                  <i className="fas fa-clock mr-1"></i>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeSection === "dashboard" && (
            <>
              {/* System Health Metrics */}
              <SystemMetrics metrics={systemMetrics} />

              {/* Module Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <ModuleCard
                  title="System Maintenance"
                  description="Core system operations"
                  icon="server"
                  color="primary"
                  modules={systemModules}
                  onModuleRun={handleModuleRun}
                />
                
                <ModuleCard
                  title="Security Automation"
                  description="Security monitoring and hardening"
                  icon="shield-alt"
                  color="danger"
                  modules={securityModules}
                  onModuleRun={handleModuleRun}
                />
                
                <ModuleCard
                  title="Network Management"
                  description="Network configuration and monitoring"
                  icon="network-wired"
                  color="secondary"
                  modules={networkModules}
                  onModuleRun={handleModuleRun}
                />
              </div>

              {/* Recent Activity */}
              <RecentActivity />
            </>
          )}
        </main>
      </div>

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        module={selectedModule}
      />
    </div>
  );
}
