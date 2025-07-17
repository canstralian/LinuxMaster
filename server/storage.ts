import { 
  modules, 
  executions, 
  systemMetrics, 
  activities,
  type Module, 
  type InsertModule, 
  type Execution, 
  type InsertExecution,
  type SystemMetrics,
  type InsertSystemMetrics,
  type Activity,
  type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // Modules
  getModules(): Promise<Module[]>;
  getModulesByCategory(category: string): Promise<Module[]>;
  getModule(id: number): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Executions
  getExecutions(): Promise<Execution[]>;
  getExecution(id: number): Promise<Execution | undefined>;
  createExecution(execution: InsertExecution): Promise<Execution>;
  updateExecution(id: number, updates: Partial<Execution>): Promise<Execution | undefined>;
  
  // System Metrics
  getLatestSystemMetrics(): Promise<SystemMetrics | undefined>;
  createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
  
  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private modules: Map<number, Module> = new Map();
  private executions: Map<number, Execution> = new Map();
  private systemMetrics: Map<number, SystemMetrics> = new Map();
  private activities: Map<number, Activity> = new Map();
  private currentModuleId = 1;
  private currentExecutionId = 1;
  private currentMetricsId = 1;
  private currentActivityId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed modules
    const defaultModules: InsertModule[] = [
      // System modules
      {
        name: "Disk Cleanup",
        category: "system",
        description: "Clear temporary files and caches",
        icon: "broom",
        script: "#!/bin/bash\necho 'Scanning temporary directories...'\nsleep 1\necho 'Cleaning /tmp/'\nsleep 1\necho 'Cleaning /var/tmp/'\nsleep 1\necho 'Disk cleanup completed successfully'"
      },
      {
        name: "Package Manager",
        category: "system",
        description: "Update and manage packages",
        icon: "download",
        script: "#!/bin/bash\necho 'Updating package lists...'\nsleep 2\necho 'Upgrading packages...'\nsleep 2\necho 'Package update completed'"
      },
      {
        name: "Service Health",
        category: "system",
        description: "Monitor and restart services",
        icon: "heartbeat",
        script: "#!/bin/bash\necho 'Checking service status...'\nsleep 1\necho 'All services running normally'"
      },
      {
        name: "Memory Optimizer",
        category: "system",
        description: "Optimize RAM and swap usage",
        icon: "memory",
        script: "#!/bin/bash\necho 'Analyzing memory usage...'\nsleep 1\necho 'Optimizing memory allocation...'\nsleep 1\necho 'Memory optimization completed'"
      },
      // Security modules
      {
        name: "Firewall Manager",
        category: "security",
        description: "Configure iptables rules",
        icon: "fire",
        script: "#!/bin/bash\necho 'Checking firewall rules...'\nsleep 1\necho 'Firewall configuration updated'"
      },
      {
        name: "Intrusion Detection",
        category: "security",
        description: "Analyze logs for threats",
        icon: "search",
        script: "#!/bin/bash\necho 'Scanning system logs...'\nsleep 2\necho 'No threats detected'"
      },
      {
        name: "SSL Renewal",
        category: "security",
        description: "Manage SSL certificates",
        icon: "certificate",
        script: "#!/bin/bash\necho 'Checking SSL certificates...'\nsleep 1\necho 'All certificates valid'"
      },
      {
        name: "Vulnerability Scan",
        category: "security",
        description: "Security assessment",
        icon: "bug",
        script: "#!/bin/bash\necho 'Running vulnerability scan...'\nsleep 3\necho 'System security assessment completed'"
      },
      // Network modules
      {
        name: "WiFi Manager",
        category: "network",
        description: "Configure wireless connections",
        icon: "wifi",
        script: "#!/bin/bash\necho 'Scanning available networks...'\nsleep 1\necho 'WiFi configuration updated'"
      },
      {
        name: "Bandwidth Monitor",
        category: "network",
        description: "Track network usage",
        icon: "chart-line",
        script: "#!/bin/bash\necho 'Monitoring network traffic...'\nsleep 2\necho 'Bandwidth analysis completed'"
      },
      {
        name: "Port Scanner",
        category: "network",
        description: "Network discovery",
        icon: "search-plus",
        script: "#!/bin/bash\necho 'Scanning network ports...'\nsleep 2\necho 'Port scan completed'"
      },
      {
        name: "VPN Manager",
        category: "network",
        description: "VPN connection automation",
        icon: "shield-alt",
        script: "#!/bin/bash\necho 'Configuring VPN connection...'\nsleep 1\necho 'VPN setup completed'"
      }
    ];

    interface Module {
  id: number;
  name: string;
  category: string;
  description: string;
  script: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
}

interface InsertActivity {
  type: string;
  title: string;
  description: string;
  icon: string;
}

defaultModules.forEach(module => {
      const newModule: Module = { ...module, id: this.currentModuleId++ };
      this.modules.set(newModule.id, newModule);
    });

    // Seed activities
    const defaultActivities: InsertActivity[] = [
      {
        type: "success",
        title: "Disk cleanup completed successfully",
        description: "Freed 1.2 GB of disk space • 2 minutes ago",
        icon: "check"
      },
      {
        type: "warning",
        title: "Package updates available",
        description: "12 packages need updating • 1 hour ago",
        icon: "exclamation-triangle"
      },
      {
        type: "info",
        title: "System backup completed",
        description: "Backup saved to /backups/system_20231215.tar.gz • 3 hours ago",
        icon: "info-circle"
      }
    ];

    defaultActivities.forEach(activity => {
      const newActivity: Activity = { 
        ...activity, 
        id: this.currentActivityId++,
        timestamp: new Date()
      };
      this.activities.set(newActivity.id, newActivity);
    });
  }

  async getModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }

  async getModulesByCategory(category: string): Promise<Module[]> {
    return Array.from(this.modules.values()).filter(m => m.category === category);
  }

  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  });
  }

  async createModule(module: InsertModule): Promise<Module> {
    const newModule: Module = { ...module, id: this.currentModuleId++ };
    this.modules.set(newModule.id, newModule);
    return newModule;
  }

  async getExecutions(): Promise<Execution[]> {
    return Array.from(this.executions.values());
  }

  async getExecution(id: number): Promise<Execution | undefined> {
    return this.executions.get(id);
  }

  async createExecution(execution: InsertExecution): Promise<Execution> {
    const newExecution: Execution = { 
      ...execution, 
      id: this.currentExecutionId++,
      startTime: new Date(),
      endTime: null,
      duration: null
    };
    this.executions.set(newExecution.id, newExecution);
    return newExecution;
  }

  async updateExecution(id: number, updates: Partial<Execution>): Promise<Execution | undefined> {
    const execution = this.executions.get(id);
    if (!execution) return undefined;
    
    const updatedExecution = { ...execution, ...updates };
    this.executions.set(id, updatedExecution);
    return updatedExecution;
  }

  async getLatestSystemMetrics(): Promise<SystemMetrics | undefined> {
    const metrics = Array.from(this.systemMetrics.values());
    return metrics.length > 0 ? metrics[metrics.length - 1] : undefined;
  }

  async createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const newMetrics: SystemMetrics = { 
      ...metrics, 
      id: this.currentMetricsId++,
      timestamp: new Date()
    };
    this.systemMetrics.set(newMetrics.id, newMetrics);
    return newMetrics;
  }

  async getActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const newActivity: Activity = { 
      ...activity, 
      id: this.currentActivityId++,
      timestamp: new Date()
    };
    this.activities.set(newActivity.id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
