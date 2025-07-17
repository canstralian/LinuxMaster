
import cron from 'node-cron';
import { storage } from './storage';
import { SecurityScanner } from './security-scanner';

export class AutomationEngine {
  private scanner = new SecurityScanner();
  private scheduledTasks = new Map();

  constructor() {
    this.initializeDefaultTasks();
  }

  private initializeDefaultTasks() {
    // Daily security scan at 2 AM
    this.scheduleTask('daily-security-scan', '0 2 * * *', async () => {
      const portScan = await this.scanner.scanOpenPorts();
      const failedLogins = await this.scanner.checkFailedLogins();
      const fileIntegrity = await this.scanner.checkFileIntegrity();

      // Create security report activity
      await storage.createActivity({
        type: failedLogins.failedAttempts > 5 ? 'warning' : 'info',
        title: 'Daily Security Scan Complete',
        description: `Found ${portScan.count} open ports, ${failedLogins.failedAttempts} failed login attempts`,
        icon: 'shield-alt'
      });
    });

    // System health check every 30 minutes
    this.scheduleTask('health-check', '*/30 * * * *', async () => {
      const metrics = await this.getSystemHealth();
      
      if (metrics.cpuUsage > 90 || metrics.memoryUsage > 95) {
        await storage.createActivity({
          type: 'warning',
          title: 'High Resource Usage Detected',
          description: `CPU: ${metrics.cpuUsage}%, Memory: ${metrics.memoryUsage}%`,
          icon: 'exclamation-triangle'
        });
      }
    });
  }

  scheduleTask(id: string, schedule: string, task: () => Promise<void>) {
    if (this.scheduledTasks.has(id)) {
      this.scheduledTasks.get(id).destroy();
    }

    const scheduledTask = cron.schedule(schedule, task, {
      scheduled: true,
      timezone: "UTC"
    });

    this.scheduledTasks.set(id, scheduledTask);
  }

  async getSystemHealth() {
    // This would integrate with actual system monitoring
    return {
      cpuUsage: Math.floor(Math.random() * 100),
      memoryUsage: Math.floor(Math.random() * 100),
      diskUsage: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 30) + 35
    };
  }

  getScheduledTasks() {
    return Array.from(this.scheduledTasks.keys());
  }

  stopTask(id: string) {
    if (this.scheduledTasks.has(id)) {
      this.scheduledTasks.get(id).destroy();
      this.scheduledTasks.delete(id);
    }
  }
}
