export interface Module {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  script: string;
  enabled: boolean;
}

export interface Execution {
  id: number;
  moduleId: number;
  status: string;
  output: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
}

export interface SystemMetrics {
  id: number;
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  temperature: number;
  additionalData: any;
}

export interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
}
