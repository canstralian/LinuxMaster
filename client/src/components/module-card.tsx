import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Module } from "@/lib/types";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'danger';
  modules: Module[];
  onModuleRun: (module: Module) => void;
}

export default function ModuleCard({
  title,
  description,
  icon,
  color,
  modules,
  onModuleRun
}: ModuleCardProps) {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    danger: 'bg-destructive'
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${colorClasses[color]} bg-opacity-10 rounded-full flex items-center justify-center`}>
            <i className={`fas fa-${icon}`} style={{ color: `var(--${color})` }}></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <i className={`fas fa-${module.icon} text-gray-600`}></i>
              <div>
                <p className="text-sm font-medium text-gray-900">{module.name}</p>
                <p className="text-xs text-gray-500">{module.description}</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => onModuleRun(module)}
              className={`px-3 py-1 text-xs text-white rounded-full`}
              style={{ backgroundColor: `var(--${color})` }}
            >
              Run
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
