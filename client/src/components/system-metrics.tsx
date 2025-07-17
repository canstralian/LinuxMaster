import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SystemMetrics } from "@/lib/types";

interface SystemMetricsProps {
  metrics: SystemMetrics | null;
}

export default function SystemMetrics({ metrics }: SystemMetricsProps) {
  const defaultMetrics = {
    cpuUsage: 24,
    memoryUsage: 45,
    storageUsage: 39,
    temperature: 42
  };

  const currentMetrics = metrics || defaultMetrics;

  const metricsData = [
    {
      label: "CPU Usage",
      value: `${currentMetrics.cpuUsage}%`,
      progress: currentMetrics.cpuUsage,
      icon: "microchip",
      color: "bg-success"
    },
    {
      label: "Memory Usage",
      value: `${(currentMetrics.memoryUsage / 1024 * 4).toFixed(1)} GB`,
      progress: currentMetrics.memoryUsage,
      icon: "memory",
      color: "bg-warning"
    },
    {
      label: "Storage",
      value: `${(currentMetrics.storageUsage / 1024 * 32).toFixed(1)} GB`,
      progress: currentMetrics.storageUsage,
      icon: "hdd",
      color: "bg-primary"
    },
    {
      label: "Temperature",
      value: `${currentMetrics.temperature}°C`,
      progress: Math.min((currentMetrics.temperature / 80) * 100, 100),
      icon: "thermometer-half",
      color: "bg-success"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricsData.map((metric, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className={`w-12 h-12 ${metric.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                <i className={`fas fa-${metric.icon} text-xl`} style={{ color: `var(--${metric.color.replace('bg-', '')})` }}></i>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={metric.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
