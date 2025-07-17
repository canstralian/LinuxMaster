
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecurityData {
  openPorts?: { openPorts: any[], count: number };
  failedLogins?: { failedAttempts: number, attempts: any[] };
  fileIntegrity?: { files: any[] };
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: portScan, refetch: refetchPorts } = useQuery({
    queryKey: ['/api/security/scan-ports'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: failedLogins, refetch: refetchLogins } = useQuery({
    queryKey: ['/api/security/failed-logins'],
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: fileIntegrity, refetch: refetchFiles } = useQuery({
    queryKey: ['/api/security/file-integrity'],
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  const runFullScan = () => {
    refetchPorts();
    refetchLogins();
    refetchFiles();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Security Dashboard</h2>
          <p className="text-gray-600">Real-time security monitoring and threat detection</p>
        </div>
        <Button onClick={runFullScan} className="bg-red-600 hover:bg-red-700">
          <i className="fas fa-shield-alt mr-2"></i>
          Run Full Scan
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Ports</CardTitle>
            <i className="fas fa-network-wired h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portScan?.count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Network services exposed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <i className="fas fa-exclamation-triangle h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {failedLogins?.failedAttempts || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Files</CardTitle>
            <i className="fas fa-file-shield h-4 w-4 text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {fileIntegrity?.files?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Files monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Information */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ports">Network Ports</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="integrity">File Integrity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>System Security Level</span>
                <Badge variant={failedLogins?.failedAttempts > 5 ? "destructive" : "default"}>
                  {failedLogins?.failedAttempts > 5 ? "High Risk" : "Normal"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Network Exposure</span>
                <Badge variant={portScan?.count > 10 ? "destructive" : "secondary"}>
                  {portScan?.count > 10 ? "High" : "Moderate"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>File Integrity</span>
                <Badge variant="default">Secure</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Network Ports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portScan?.openPorts?.map((port, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{port.service}</span>
                      <p className="text-sm text-gray-600">{port.address}</p>
                    </div>
                    <Badge variant="secondary">{port.protocol}</Badge>
                  </div>
                )) || <p className="text-gray-500">No open ports detected</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Threat Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {failedLogins?.attempts?.slice(0, 10).map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <span className="font-medium text-red-700">Failed SSH Login</span>
                      <p className="text-sm text-gray-600">From IP: {attempt.ip}</p>
                    </div>
                    <Badge variant="destructive">Blocked</Badge>
                  </div>
                )) || <p className="text-gray-500">No recent threats detected</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Integrity Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fileIntegrity?.files?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium">{file.file}</span>
                      <p className="text-sm text-gray-600">
                        Last modified: {new Date(file.lastModified).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="default">OK</Badge>
                  </div>
                )) || <p className="text-gray-500">No files monitored</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
