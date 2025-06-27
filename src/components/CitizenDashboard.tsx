import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertTriangle, MapPin, Calendar, ArrowLeft, User, Eye, X } from 'lucide-react';
import { MaintenanceRequest } from '../types';
const logo = '/img/Gaianova_logo-removebg-preview.png';

interface CitizenDashboardProps {
  requests: MaintenanceRequest[];
  citizenEmail?: string;
  onBack: () => void;
}

export default function CitizenDashboard({ requests, citizenEmail, onBack }: CitizenDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // Filter requests by citizen email if provided, otherwise show all
  const citizenRequests = citizenEmail 
    ? requests.filter(request => request.reporterEmail === citizenEmail)
    : requests;

  const filteredRequests = citizenRequests.filter(request => 
    request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: citizenRequests.length,
    pending: citizenRequests.filter(r => r.status === 'pending').length,
    inProgress: citizenRequests.filter(r => r.status === 'in-progress').length,
    completed: citizenRequests.filter(r => r.status === 'completed').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in-progress':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {getStatusIcon(status)}
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
      emergency: 'bg-red-200 text-red-900 border-red-300'
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[priority as keyof typeof styles] || styles.medium}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'in-progress': return 65;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const handleView = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  // Modal view for detailed request
  if (selectedRequest) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedRequest(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Report Details</h1>
          </div>
          <button
            onClick={() => setSelectedRequest(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Status</h3>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      selectedRequest.status === 'completed' ? 'bg-green-500' :
                      selectedRequest.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${getProgressPercentage(selectedRequest.status)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`${selectedRequest.status === 'pending' || selectedRequest.status === 'in-progress' || selectedRequest.status === 'completed' ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    Submitted
                  </span>
                  <span className={`${selectedRequest.status === 'in-progress' || selectedRequest.status === 'completed' ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    In Progress
                  </span>
                  <span className={`${selectedRequest.status === 'completed' ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    Completed
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            {/* Issue Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                  <p className="text-gray-900">{selectedRequest.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <p className="text-gray-900 leading-relaxed">{selectedRequest.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                    <p className="text-gray-900 capitalize">{selectedRequest.category?.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
                    <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
                    <p className="text-gray-900">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Ward</label>
                    <p className="text-gray-900">{selectedRequest.ward || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Report Submitted</p>
                    <p className="text-xs text-gray-500">
                      {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {selectedRequest.updatedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status Updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedRequest.updatedAt).toLocaleDateString()} at {new Date(selectedRequest.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <img 
                src={logo} 
                alt="Gaianova Local Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">My Reports</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Track your civic issue reports</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Reports List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <User className="mx-auto w-12 h-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {citizenRequests.length === 0 ? 'No reports yet' : 'No matching reports'}
            </h3>
            <p className="text-gray-600">
              {citizenRequests.length === 0 
                ? 'Start by submitting your first civic issue report.' 
                : 'Try adjusting your search terms.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((request) => (
                <div key={request.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(request.priority)}
                      <button
                        onClick={() => handleView(request)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{getProgressPercentage(request.status)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          request.status === 'completed' ? 'bg-green-500' :
                          request.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${getProgressPercentage(request.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status and Description */}
                  <div className="flex items-start justify-between">
                    <p className="text-gray-700 text-sm leading-relaxed flex-1 mr-4">
                      {request.description.length > 120 
                        ? `${request.description.substring(0, 120)}...` 
                        : request.description
                      }
                    </p>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
} 