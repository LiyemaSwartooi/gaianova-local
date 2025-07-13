import React, { useState, useEffect, useMemo } from 'react';
import { Truck, Users, BarChart3, FileText, Settings, Bell, Download, AlertTriangle, CheckCircle, Clock, MapPin, Phone, Mail, Car, Wrench, Calendar, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CivicReport, DepartmentStats, FleetVehicleWithStatus, UserProfile } from '../types';
import { SOL_PLAATJE_MUNICIPALITY } from '../data/municipalities';
import { calculateDepartmentStats, generateReportAnalytics, exportReportsData, findBestAssignee, assignFleetVehicle } from '../utils/municipalUtils';

interface MunicipalDashboardProps {
  requests: CivicReport[];
  onStatusChange: (id: string, status: CivicReport['status']) => void;
  onDeleteRequest: (id: string) => void;
  onAssignRequest?: (id: string, assignedTo: string, vehicle?: string) => void;
}

export default function MunicipalDashboard({ 
  requests, 
  onStatusChange, 
  onDeleteRequest,
  onAssignRequest 
}: MunicipalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'fleet' | 'analytics' | 'reports'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<CivicReport | null>(null);

  // Mock user data - in real app, this would come from authentication
  const mockUsers: UserProfile[] = [
    {
      id: 'user1',
      name: 'John Mthembu',
      email: 'j.mthembu@solplaatje.gov.za',
      role: 'municipal-staff',
      department: 'water-sanitation',
      municipality: 'Sol Plaatje Local Municipality',
      isActive: true,
      permissions: ['view-reports', 'assign-reports', 'update-status'],
      workloadCapacity: 8,
      currentAssignments: [],
      performanceMetrics: {
        totalReportsHandled: 45,
        averageResolutionTime: 24,
        citizenSatisfactionRating: 4.2,
        onTimeCompletion: 85,
        escalationRate: 12
      }
    },
    {
      id: 'user2',
      name: 'Sarah van der Merwe',
      email: 's.vandermerwe@solplaatje.gov.za',
      role: 'department-head',
      department: 'roads-infrastructure',
      municipality: 'Sol Plaatje Local Municipality',
      isActive: true,
      permissions: ['view-reports', 'assign-reports', 'update-status', 'manage-department'],
      workloadCapacity: 12,
      currentAssignments: [],
      performanceMetrics: {
        totalReportsHandled: 67,
        averageResolutionTime: 18,
        citizenSatisfactionRating: 4.5,
        onTimeCompletion: 92,
        escalationRate: 8
      }
    }
  ];

  // Calculate department statistics
  const departmentStats = useMemo(() => {
    return SOL_PLAATJE_MUNICIPALITY.departments.map(dept => 
      calculateDepartmentStats(dept.id, requests)
    );
  }, [requests]);

  // Calculate overall analytics
  const analytics = useMemo(() => {
    return generateReportAnalytics(requests);
  }, [requests]);

  // Filter requests based on current filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchTerm === '' || 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.referenceNumber && request.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDepartment = selectedDepartment === 'all' || 
        request.assignedDepartment === selectedDepartment;
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
    });
  }, [requests, searchTerm, selectedDepartment, statusFilter, priorityFilter]);

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const colors = {
      emergency: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      escalated: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      await exportReportsData(filteredRequests, format);
      toast.success(`Reports exported as ${format.toUpperCase()}`, {
        icon: <Download className="w-5 h-5 text-green-500" />,
      });
    } catch (error) {
      toast.error('Export failed. Please try again.');
    }
  };

  // Handle assignment
  const handleAssignRequest = (requestId: string, departmentId: string) => {
    const bestAssignee = findBestAssignee(departmentId, mockUsers, requests);
    const assignedVehicle = assignFleetVehicle(departmentId, 'general');
    
    if (bestAssignee && onAssignRequest) {
      onAssignRequest(requestId, bestAssignee.id, assignedVehicle || undefined);
      toast.success(`Assigned to ${bestAssignee.name}`, {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        description: assignedVehicle ? `Vehicle: ${assignedVehicle}` : 'No vehicle assigned'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with stats and export - simpler design since main header is above */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">
                    {requests.filter(r => r.status === 'pending').length} Pending Reports
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Total: {requests.length}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'departments', label: 'Departments', icon: Users },
              { id: 'fleet', label: 'Fleet', icon: Truck },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'reports', label: 'All Reports', icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalReports}</p>
                  </div>
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{analytics.reportsByStatus.pending || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Resolution</p>
                    <p className="text-3xl font-bold text-blue-600">{Math.round(analytics.averageResolutionTime)}h</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                    <p className="text-3xl font-bold text-green-600">{analytics.citizenSatisfactionRating.toFixed(1)}/5</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            {/* Department Overview */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Department Overview</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentStats.map(dept => (
                    <div key={dept.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{dept.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Reports:</span>
                          <span className="font-medium">{dept.totalReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-medium text-yellow-600">{dept.pendingReports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg. Resolution:</span>
                          <span className="font-medium">{Math.round(dept.averageResolutionTime)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Satisfaction:</span>
                          <span className="font-medium text-green-600">{dept.citizenSatisfactionRating.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Reports with Filtering */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Departments</option>
                      {SOL_PLAATJE_MUNICIPALITY.departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="escalated">Escalated</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="all">All Priority</option>
                      <option value="emergency">Emergency</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
                      />
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>
                
                {/* Filter summary */}
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <span>Showing {filteredRequests.length} of {requests.length} reports</span>
                  {(selectedDepartment !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm) && (
                    <button
                      onClick={() => {
                        setSelectedDepartment('all');
                        setStatusFilter('all');
                        setPriorityFilter('all');
                        setSearchTerm('');
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              
              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ward
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequests.slice(0, 15).map(request => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 text-sm">{request.title}</h4>
                              {request.referenceNumber && (
                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                                  {request.referenceNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {request.description.substring(0, 80)}...
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reporter: {request.reporterName}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {SOL_PLAATJE_MUNICIPALITY.departments.find(d => d.id === request.assignedDepartment)?.name || 'Unassigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            Ward {request.ward}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-md transition-all duration-200 border border-emerald-200 hover:border-emerald-300 font-medium text-xs"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </button>
                            {!request.assignedTo && (
                              <button
                                onClick={() => request.assignedDepartment && handleAssignRequest(request.id, request.assignedDepartment)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 rounded-md transition-all duration-200 border border-blue-200 hover:border-blue-300 font-medium text-xs"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Assign
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Empty state when no filtered results */}
                {filteredRequests.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <FileText className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No reports found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || selectedDepartment !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all'
                        ? 'Try adjusting your filters to see more reports.'
                        : 'No reports have been submitted yet.'}
                    </p>
                    {(selectedDepartment !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || searchTerm) && (
                      <button
                        onClick={() => {
                          setSelectedDepartment('all');
                          setStatusFilter('all');
                          setPriorityFilter('all');
                          setSearchTerm('');
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {/* View All Reports button */}
              {filteredRequests.length > 15 && (
                <div className="p-4 border-t bg-gray-50">
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full text-center py-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    View all {filteredRequests.length} reports →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fleet Tab */}
        {activeTab === 'fleet' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Fleet Management</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SOL_PLAATJE_MUNICIPALITY.fleetVehicles.map(vehicle => (
                    <div key={vehicle.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Car className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{vehicle.registration}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                          vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Type: {vehicle.type}</p>
                        <p>Department: {SOL_PLAATJE_MUNICIPALITY.departments.find(d => d.id === vehicle.department)?.name}</p>
                        {vehicle.assignedTo && <p>Assigned to: {vehicle.assignedTo}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add other tabs content here... */}
        
      </div>

      {/* Full Screen Report Detail View */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                  </button>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">{selectedRequest.title}</h1>
                    <p className="text-sm text-gray-500">
                      Report #{selectedRequest.referenceNumber || selectedRequest.id}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Report Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Description */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Description</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                </div>

                {/* Location & Contact Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-gray-600">{selectedRequest.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Ward</p>
                          <p className="text-gray-600">Ward {selectedRequest.ward}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Reporter</p>
                          <p className="text-gray-600">{selectedRequest.reporterName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Contact</p>
                          <p className="text-gray-600">{selectedRequest.contactInfo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Management */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h2>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {['pending', 'in-progress', 'completed', 'cancelled', 'escalated'].map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            onStatusChange(selectedRequest.id, status as CivicReport['status']);
                            setSelectedRequest(null);
                          }}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            selectedRequest.status === status
                              ? getStatusColor(status) + ' cursor-not-allowed opacity-75'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                          disabled={selectedRequest.status === status}
                        >
                          {selectedRequest.status === status && (
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <p>Current status: <span className="font-medium">{selectedRequest.status}</span></p>
                      <p>Last updated: {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Image & Metadata */}
              <div className="space-y-6">
                
                {/* Report Image */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Image</h2>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {selectedRequest.image ? (
                      <img 
                        src={selectedRequest.image} 
                        alt="Report evidence"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">No image provided</p>
                        <p className="text-xs text-gray-500 mt-1">Reporter did not attach an image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Metadata */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Details</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Reference Number</span>
                      <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedRequest.referenceNumber || selectedRequest.id}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Department</span>
                      <span className="text-sm text-gray-600">
                        {SOL_PLAATJE_MUNICIPALITY.departments.find(d => d.id === selectedRequest.assignedDepartment)?.name || 'Unassigned'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Submitted</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedRequest.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Time</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedRequest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {selectedRequest.assignedTo && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-700">Assigned To</span>
                        <span className="text-sm text-gray-600">{selectedRequest.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    {!selectedRequest.assignedTo && (
                      <button
                        onClick={() => selectedRequest.assignedDepartment && handleAssignRequest(selectedRequest.id, selectedRequest.assignedDepartment)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Assign to Department
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        // Export functionality could be added here
                        alert('Export functionality to be implemented');
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 