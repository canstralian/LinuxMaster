import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@/lib/types";

export default function RecentActivity() {
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-success bg-success';
      case 'warning': return 'text-warning bg-warning';
      case 'error': return 'text-destructive bg-destructive';
      default: return 'text-primary bg-primary';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-success bg-opacity-10 text-success';
      case 'warning': return 'bg-warning bg-opacity-10 text-warning';
      case 'error': return 'bg-destructive bg-opacity-10 text-destructive';
      default: return 'bg-primary bg-opacity-10 text-primary';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 flex items-center space-x-4">
              <div className={`w-10 h-10 ${getActivityColor(activity.type)} bg-opacity-10 rounded-full flex items-center justify-center`}>
                <i className={`fas fa-${activity.icon} ${getActivityColor(activity.type).split(' ')[0]}`}></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.description}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(activity.type)}`}>
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
