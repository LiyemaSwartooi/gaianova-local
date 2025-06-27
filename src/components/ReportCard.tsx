import React from 'react';
import { Calendar, MapPin, User, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { MaintenanceRequest } from '../types';

interface ReportCardProps {
  request: MaintenanceRequest;
  onStatusChange?: (id: string, status: MaintenanceRequest['status']) => void;
  isManager?: boolean;
}

export default function ReportCard({ request, onStatusChange, isManager = false }: ReportCardProps) {
  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{request.residentName}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={request.status} />
          <div className={`flex items-center gap-1 text-sm font-medium ${priorityColors[request.priority]}`}>
            <AlertCircle className="w-4 h-4" />
            <span className="capitalize">{request.priority} Priority</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{request.description}</p>

      <div className="flex justify-between items-center">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {request.category}
          </span>
        </div>
        
        {isManager && onStatusChange && (
          <div className="flex gap-2">
            {request.status === 'pending' && (
              <button
                onClick={() => onStatusChange(request.id, 'in-progress')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Work
              </button>
            )}
            {request.status === 'in-progress' && (
              <button
                onClick={() => onStatusChange(request.id, 'completed')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}