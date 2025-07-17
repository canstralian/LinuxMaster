
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Module } from "@/lib/types";

export default function AutomationScheduler() {
  const [newTask, setNewTask] = useState({
    name: '',
    schedule: '',
    moduleId: '',
    enabled: true
  });

  const queryClient = useQueryClient();

  const { data: modules = [] } = useQuery<Module[]>({
    queryKey: ['/api/modules']
  });

  const { data: scheduledTasks = [] } = useQuery({
    queryKey: ['/api/automation/tasks']
  });

  const scheduleTaskMutation = useMutation({
    mutationFn: async (task: any) => {
      const response = await fetch('/api/automation/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/tasks'] });
      setNewTask({ name: '', schedule: '', moduleId: '', enabled: true });
    }
  });

  const predefinedSchedules = [
    { label: 'Every Hour', value: '0 * * * *' },
    { label: 'Daily at 2 AM', value: '0 2 * * *' },
    { label: 'Weekly (Sundays)', value: '0 2 * * 0' },
    { label: 'Monthly (1st)', value: '0 2 1 * *' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' }
  ];

  const handleScheduleTask = () => {
    if (newTask.name && newTask.schedule && newTask.moduleId) {
      scheduleTaskMutation.mutate({
        id: `task-${Date.now()}`,
        ...newTask
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Automation & Scheduling</h2>
        <p className="text-gray-600">Automate your Raspberry Pi maintenance tasks</p>
      </div>

      {/* Create New Scheduled Task */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Automation Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Name</label>
              <Input
                placeholder="e.g., Daily Security Scan"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Module to Execute</label>
              <Select value={newTask.moduleId} onValueChange={(value) => setNewTask({ ...newTask, moduleId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id.toString()}>
                      {module.name} ({module.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Schedule (Cron)</label>
              <Select value={newTask.schedule} onValueChange={(value) => setNewTask({ ...newTask, schedule: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedSchedules.map((schedule) => (
                    <SelectItem key={schedule.value} value={schedule.value}>
                      {schedule.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Custom Cron Expression</label>
              <Input
                placeholder="0 2 * * * (custom cron)"
                value={newTask.schedule}
                onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={handleScheduleTask}
            disabled={!newTask.name || !newTask.schedule || !newTask.moduleId}
            className="w-full"
          >
            <i className="fas fa-clock mr-2"></i>
            Schedule Task
          </Button>
        </CardContent>
      </Card>

      {/* Active Scheduled Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Active Automation Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Default System Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Daily Security Scan</h4>
                  <p className="text-sm text-gray-600">Runs every day at 2:00 AM</p>
                  <p className="text-xs text-gray-500">Cron: 0 2 * * *</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">System</Badge>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">System Health Check</h4>
                  <p className="text-sm text-gray-600">Runs every 30 minutes</p>
                  <p className="text-xs text-gray-500">Cron: */30 * * * *</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">System</Badge>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Weekly Disk Cleanup</h4>
                  <p className="text-sm text-gray-600">Runs every Sunday at 3:00 AM</p>
                  <p className="text-xs text-gray-500">Cron: 0 3 * * 0</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Maintenance</Badge>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            </div>

            {scheduledTasks.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No custom automation tasks scheduled. Create one above to get started!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Automation Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <i className="fas fa-tasks h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              System automation tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h Executions</CardTitle>
            <i className="fas fa-play h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Automated executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <i className="fas fa-check-circle h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">
              Task completion rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
