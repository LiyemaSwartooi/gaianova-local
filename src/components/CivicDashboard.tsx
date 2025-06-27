import React, { useState } from 'react';
import { Search, Filter, BarChart3, Clock, CheckCircle, AlertTriangle, Trash2, Calendar, User, MapPin, Eye, X, ArrowLeft } from 'lucide-react';
import { MaintenanceRequest } from '../types';
const logo = '/img/Gaianova_logo-removebg-preview.png'

interface CivicDashboardProps {
  requests: MaintenanceRequest[];
  onStatusChange: (id: string, status: MaintenanceRequest['status']) => void;
  onDeleteRequest: (id: string) => void;
}

export default function CivicDashboard({ requests, onStatusChange, onDeleteRequest }: CivicDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.residentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }); 

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    highPriority: requests.filter(r => r.priority === 'high').length
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
      emergency: 'bg-red-200 text-red-900'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles] || styles.medium}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the request "${title}"?`)) {
      onDeleteRequest(id);
    }
  };

  const handleView = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  // If modal is open, render only the modal
  if (selectedRequest) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedRequest(null)}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <img 
              src={logo} 
              alt="Logo" 
              className="h-8 sm:h-12 w-auto"
            />
          </div>
          <button
            onClick={() => setSelectedRequest(null)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="h-full overflow-y-auto pb-16 sm:pb-20">
          <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Issue Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Issue Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Title</label>
                      <p className="text-sm sm:text-base text-gray-900">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Description</label>
                      <p className="text-sm sm:text-base text-gray-900">{selectedRequest.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Category</label>
                        <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedRequest.category?.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Priority</label>
                        <div className="mt-1">{getPriorityBadge(selectedRequest.priority)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Status</label>
                        <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Location</label>
                        <p className="text-sm sm:text-base text-gray-900">{selectedRequest.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Timeline</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Created</label>
                      <p className="text-sm sm:text-base text-gray-900">
                        {new Date(selectedRequest.createdAt).toLocaleDateString()} at{' '}
                        {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {selectedRequest.updatedAt && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Last Updated</label>
                        <p className="text-sm sm:text-base text-gray-900">
                          {new Date(selectedRequest.updatedAt).toLocaleDateString()} at{' '}
                          {new Date(selectedRequest.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Reporter Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Reporter Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-6 space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Name</label>
                      <p className="text-sm sm:text-base text-gray-900">{selectedRequest.reporterName || selectedRequest.residentName}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Email</label>
                        <p className="text-sm sm:text-base text-gray-900 break-all">{selectedRequest.reporterEmail || selectedRequest.residentEmail}</p>
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">Phone</label>
                        <p className="text-sm sm:text-base text-gray-900">{selectedRequest.reporterPhone || selectedRequest.residentPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedRequest.notes && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-6">
                      <p className="text-sm sm:text-base text-gray-900">{selectedRequest.notes}</p>
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
      {/* Mobile Header - Civic Theme */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Civic Reports</h1>
              <p className="text-xs text-gray-600">Municipal Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Stats - Civic Theme */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-emerald-800">{stats.total}</div>
                  <div className="text-xs text-emerald-600 font-medium">Total Reports</div>
                </div>
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-yellow-800">{stats.pending}</div>
                  <div className="text-xs text-yellow-600 font-medium">Pending</div>
                </div>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-blue-800">{stats.inProgress}</div>
                  <div className="text-xs text-blue-600 font-medium">In Progress</div>
                </div>
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-3 border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-emerald-800">{stats.completed}</div>
                  <div className="text-xs text-emerald-600 font-medium">Completed</div>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Stats - Civic Theme */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-3 sm:mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Civic Reports Overview</h1>
            <p className="text-gray-600 mt-1">Monitor and manage citizen-reported civic issues</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          <div className="bg-emerald-50 rounded-lg p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-emerald-600">Total Reports</p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-900">{stats.total}</p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">In Progress</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900">{stats.inProgress}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-emerald-600">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-900">{stats.completed}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-2 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-red-600">High Priority</p>
                <p className="text-lg sm:text-2xl font-bold text-red-900">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search - Professional */}
      <div className="lg:hidden bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search civic reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 mb-3 sm:mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search civic reports by title, description, or reporter name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Display */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* Mobile List - Professional & Clean */}
          <div className="lg:hidden bg-gray-50">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  Civic Reports ({filteredRequests.length})
                </h2>
                <div className="text-xs text-gray-500">
                  Latest first
                </div>
              </div>
            </div>
            
                        <div className="space-y-2 px-4 pb-6">
              {filteredRequests
                .sort((a, b) => {
                  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                  const aPriority = priorityOrder[a.priority] || 1;
                  const bPriority = priorityOrder[b.priority] || 1;
                  if (aPriority !== bPriority) {
                    return bPriority - aPriority;
                  }
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((request, index) => (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                    {/* Top Row: Priority + Date */}
                    <div className="flex items-center justify-between mb-2">
                      {getPriorityBadge(request.priority)}
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {request.title}
                    </h3>

                    {/* Location & Reporter Info */}
                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <User className="w-3 h-3 mr-1 text-gray-400" />
                      <span>{request.reporterName || request.residentName}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 mb-3">
                      <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                      <span>{request.location}</span>
                    </div>

                    {/* Bottom Row: Status + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(request)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={request.status}
                          onChange={(e) => onStatusChange(request.id, e.target.value as MaintenanceRequest['status'])}
                          className="text-xs px-2 py-1 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(request.id, request.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

                    {/* Desktop Cards - Compact Design */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-3 max-h-[600px] overflow-y-auto">
              {filteredRequests
                .sort((a, b) => {
                  const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                  const aPriority = priorityOrder[a.priority] || 1;
                  const bPriority = priorityOrder[b.priority] || 1;
                  if (aPriority !== bPriority) {
                    return bPriority - aPriority;
                  }
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((request, index) => (
                  <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    {/* Header with Priority and Date */}
                    <div className="flex items-center justify-between mb-2">
                      {getPriorityBadge(request.priority)}
                      <span className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-gray-900 mb-1 text-sm leading-tight truncate">
                      {request.title}
                    </h3>
                    
                    {/* Reporter & Location */}
                    <div className="space-y-1 mb-3 text-xs">
                      <div className="flex items-center text-gray-600 truncate">
                        <User className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{request.reporterName || request.residentName}</span>
                      </div>
                      <div className="flex items-center text-gray-600 truncate">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(request)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <select
                          value={request.status}
                          onChange={(e) => onStatusChange(request.id, e.target.value as MaintenanceRequest['status'])}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(request.id, request.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}