import React from 'react';
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/hooks/use-websocket";
import type { Module } from "@/lib/types";

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module | null;
  output: string[];
  status: 'idle' | 'running' | 'success' | 'error';
}

export function TerminalModal({ isOpen, onClose, module, output, status }: TerminalModalProps) {
  const [duration, setDuration] = useState<number>(0);
  const { executeModule } = useWebSocket();

  useEffect(() => {
    if (isOpen && module) {
      setOutput([]);
      setStatus('running');
      setDuration(0);
      
      // Add initial prompt
      setOutput([`pi@raspberrypi:~$ ./pimaint.sh --module ${module.name.toLowerCase().replace(/\s+/g, '-')}`]);
      
      const startTime = Date.now();
      const interval = setInterval(() => {
        setDuration(Date.now() - startTime);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, module]);

  // Listen for WebSocket messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'output') {
        setOutput(prev => [...prev, data.data]);
      } else if (data.type === 'execution-completed') {
        setStatus(data.status);
        setOutput(prev => [...prev, `✓ Module execution completed successfully`]);
      } else if (data.type === 'error') {
        setStatus('error');
        setOutput(prev => [...prev, `✗ Error: ${data.message}`]);
      }
    };

    // This would normally be handled by the WebSocket hook
    // For now, we'll simulate the output
    if (isOpen && module && status === 'running') {
      const timer = setTimeout(() => {
        setOutput(prev => [
          ...prev,
          "Initializing PiMaint Module System...",
          "✓ Loading configuration files",
          "✓ Checking system permissions",
          "✓ Validating module dependencies",
          `Executing ${module.name.toLowerCase()} module...`,
          "✓ Module execution completed successfully"
        ]);
        setStatus('success');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, module, status]);

  const handleRunAgain = () => {
    if (module) {
      executeModule(module.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terminal rounded-full flex items-center justify-center">
                <i className="fas fa-terminal text-white"></i>
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  {module?.name || 'Module Execution'}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {status === 'running' ? 'Running module...' : 'Module execution completed'}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Terminal Output */}
          <div className="bg-terminal rounded-lg p-4 font-mono text-sm overflow-y-auto h-96 mb-4">
            <div className="space-y-1">
              {output.map((line, index) => (
                <div key={index} className="text-green-400">
                  {line}
                </div>
              ))}
              {status === 'running' && (
                <div className="text-yellow-400">
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </div>
              )}
              <div className="text-blue-400 mt-4">
                <span>pi@raspberrypi:~$</span>
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  status === 'success' ? 'bg-success' : 
                  status === 'error' ? 'bg-destructive' : 
                  status === 'running' ? 'bg-warning' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-600">
                  Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Duration: {(duration / 1000).toFixed(1)}s
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <i className="fas fa-download mr-1"></i>
                Export Log
              </Button>
              <Button onClick={handleRunAgain} size="sm">
                <i className="fas fa-redo mr-1"></i>
                Run Again
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}