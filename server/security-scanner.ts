
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SecurityScanner {
  async scanOpenPorts(): Promise<any> {
    try {
      const { stdout } = await execAsync('ss -tuln');
      return this.parsePortScan(stdout);
    } catch (error) {
      console.error('Port scan failed:', error);
      return { error: 'Port scan failed' };
    }
  }

  async checkFailedLogins(): Promise<any> {
    try {
      const { stdout } = await execAsync('journalctl -u ssh --since "24 hours ago" | grep "Failed password"');
      return this.parseFailedLogins(stdout);
    } catch (error) {
      return { failedAttempts: 0, attempts: [] };
    }
  }

  async checkFileIntegrity(): Promise<any> {
    try {
      // Check critical system files
      const files = ['/etc/passwd', '/etc/shadow', '/etc/sudoers'];
      const results = [];
      
      for (const file of files) {
        const { stdout } = await execAsync(`stat -c "%Y" ${file}`);
        results.push({
          file,
          lastModified: new Date(parseInt(stdout.trim()) * 1000),
          status: 'ok'
        });
      }
      
      return { files: results };
    } catch (error) {
      return { error: 'File integrity check failed' };
    }
  }

  private parsePortScan(output: string) {
    const lines = output.split('\n').slice(1);
    const openPorts = lines
      .filter(line => line.includes('LISTEN'))
      .map(line => {
        const parts = line.split(/\s+/);
        return {
          protocol: parts[0],
          address: parts[4],
          service: this.getServiceName(parts[4])
        };
      });
    
    return { openPorts, count: openPorts.length };
  }

  private parseFailedLogins(output: string) {
    const lines = output.split('\n').filter(line => line.includes('Failed password'));
    const attempts = lines.map(line => {
      const match = line.match(/from (\d+\.\d+\.\d+\.\d+)/);
      return {
        ip: match ? match[1] : 'unknown',
        timestamp: new Date(),
        details: line
      };
    });
    
    return { failedAttempts: attempts.length, attempts };
  }

  private getServiceName(address: string): string {
    const portMap: { [key: string]: string } = {
      '22': 'SSH',
      '80': 'HTTP',
      '443': 'HTTPS',
      '3306': 'MySQL',
      '5432': 'PostgreSQL',
      '6379': 'Redis'
    };
    
    const port = address.split(':').pop();
    return portMap[port || ''] || 'Unknown';
  }
}
