import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertExecutionSchema, insertSystemMetricsSchema, insertActivitySchema } from "@shared/schema";
import { SecurityScanner } from "./security-scanner";
import { AutomationEngine } from "./automation-engine";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const securityScanner = new SecurityScanner();
  const automationEngine = new AutomationEngine();

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        if (data.type === 'execute-module') {
          handleModuleExecution(ws, data.moduleId);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  // Module execution handler
  async function handleModuleExecution(ws: WebSocket, moduleId: number) {
    try {
      const module = await storage.getModule(moduleId);
      if (!module) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Module not found'
        }));
        return;
      }

      // Create execution record
      const execution = await storage.createExecution({
        moduleId,
        status: 'running',
        output: '',
        startTime: new Date(),
        endTime: null,
        duration: null
      });

      // Send execution started event
      ws.send(JSON.stringify({
        type: 'execution-started',
        executionId: execution.id,
        module: module.name
      }));

      // Simulate script execution with real-time output
      const scriptLines = module.script.split('\n').filter(line => line.trim());
      let output = '';
      
      for (let i = 0; i < scriptLines.length; i++) {
        const line = scriptLines[i];
        if (line.startsWith('echo ')) {
          const message = line.substring(5).replace(/'/g, '');
          output += message + '\n';
          
          // Send real-time output
          ws.send(JSON.stringify({
            type: 'output',
            executionId: execution.id,
            data: message
          }));
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 800));
        } else if (line.startsWith('sleep ')) {
          const seconds = parseInt(line.substring(6));
          await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        }
      }

      // Update execution as completed
      const endTime = new Date();
      const duration = endTime.getTime() - execution.startTime!.getTime();
      
      await storage.updateExecution(execution.id, {
        status: 'success',
        output,
        endTime,
        duration
      });

      // Send completion event
      ws.send(JSON.stringify({
        type: 'execution-completed',
        executionId: execution.id,
        status: 'success',
        duration
      }));

      // Create activity record
      await storage.createActivity({
        type: 'success',
        title: `${module.name} completed successfully`,
        description: `Module executed in ${(duration / 1000).toFixed(1)}s`,
        icon: 'check'
      });

    } catch (error) {
      console.error('Module execution error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Module execution failed'
      }));
    }
  }

  // API Routes
  app.get('/api/modules', async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  });

  app.get('/api/modules/:idOrCategory', async (req, res) => {
    try {
      const { idOrCategory } = req.params;
      
      // Check if it's a numeric ID
      if (/^\d+$/.test(idOrCategory)) {
        const moduleId = parseInt(idOrCategory);
        const module = await storage.getModule(moduleId);
        if (module) {
          res.json(module);
        } else {
          res.status(404).json({ error: 'Module not found' });
        }
      } else {
        // Treat as category
        const modules = await storage.getModulesByCategory(idOrCategory);
        res.json(modules);
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  });

  app.get('/api/executions', async (req, res) => {
    try {
      const executions = await storage.getExecutions();
      res.json(executions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch executions' });
    }
  });

  app.get('/api/system-metrics', async (req, res) => {
    try {
      const metrics = await storage.getLatestSystemMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
  });

  app.get('/api/activities', async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  // Security endpoints
  app.get('/api/security/scan-ports', async (req, res) => {
    try {
      const result = await securityScanner.scanOpenPorts();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Port scan failed' });
    }
  });

  app.get('/api/security/failed-logins', async (req, res) => {
    try {
      const result = await securityScanner.checkFailedLogins();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed login check failed' });
    }
  });

  app.get('/api/security/file-integrity', async (req, res) => {
    try {
      const result = await securityScanner.checkFileIntegrity();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'File integrity check failed' });
    }
  });

  // Automation endpoints
  app.get('/api/automation/tasks', async (req, res) => {
    try {
      const tasks = automationEngine.getScheduledTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch automation tasks' });
    }
  });

  app.post('/api/automation/schedule', async (req, res) => {
    try {
      const { id, schedule, moduleId } = req.body;
      // Schedule module execution
      automationEngine.scheduleTask(id, schedule, async () => {
        // Execute module logic here
        console.log(`Executing scheduled module: ${moduleId}`);
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to schedule task' });
    }
  });

  // Simulate system metrics updates
  setInterval(async () => {
    try {
      const metrics = {
        cpuUsage: Math.floor(Math.random() * 80) + 10,
        memoryUsage: Math.floor(Math.random() * 60) + 20,
        storageUsage: Math.floor(Math.random() * 50) + 30,
        temperature: Math.floor(Math.random() * 30) + 35,
        additionalData: {}
      };

      await storage.createSystemMetrics(metrics);

      // Broadcast to all connected clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'metrics-update',
            data: metrics
          }));
        }
      });
    } catch (error) {
      console.error('Error updating system metrics:', error);
    }
  }, 5000);

  return httpServer;
}
