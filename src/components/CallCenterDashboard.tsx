import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  Users,
  Building,
  Car,
  Calendar,
  Timer,
  MessageCircle,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Printer,
  Mail,
  Phone as PhoneIcon,
  Flag,
  Target,
  Navigation,
  Zap,
  RefreshCw,
  Archive,
  UserCheck,
  UserX,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Camera,
  Paperclip,
  Share2,
  MoreHorizontal,
  Home,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { SOUTH_AFRICAN_MUNICIPALITIES } from '../data/municipalities';

interface Report {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'assigned' | 'in-progress' | 'pending-review' | 'resolved' | 'closed' | 'cancelled';
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  location: string;
  ward: string;
  gpsCoordinates?: { lat: number; lng: number };
  attachments: { name: string; url: string; type: string }[];
  assignedTo?: string;
  assignedDepartment?: string;
  assignedVehicle?: string;
  estimatedResolution: string;
  actualResolution?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  callCenterAgent: string;
  communicationLog: CommunicationEntry[];
  isValidMunicipalIssue: boolean;
  resolutionNotes?: string;
  citizenFeedback?: {
    rating: number;
    comments: string;
    submittedAt: string;
  };
  escalationLevel: number;
  timeToFirstResponse?: number;
  totalResolutionTime?: number;
  reopenCount: number;
  tags: string[];
}

interface CommunicationEntry {
  id: string;
  type: 'call' | 'email' | 'sms' | 'field-update' | 'system-update' | 'internal-note';
  message: string;
  sender: string;
  recipient: string;
  timestamp: string;
  isRead: boolean;
  attachments?: { name: string; url: string }[];
}

interface CallCenterDashboardProps {
  userData: any;
  onBack: () => void;
}

interface FilterOptions {
  status: string;
  priority: string;
  category: string;
  assignedTo: string;
  department: string;
  ward: string;
  dateRange: string;
  escalationLevel: string;
  searchTerm: string;
}

const CallCenterDashboard: React.FC<CallCenterDashboardProps> = ({ userData, onBack }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all',
    department: 'all',
    ward: 'all',
    dateRange: 'all',
    escalationLevel: 'all',
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(20);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalReports: 0,
    newReports: 0,
    inProgress: 0,
    resolved: 0,
    averageResolutionTime: 0,
    citizenSatisfaction: 0,
    departmentPerformance: [],
    timeToFirstResponse: 0,
    escalatedReports: 0
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileMenuOpen && !target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  // Utility function to get municipality logo
  const getMunicipalityLogo = (municipalityId: string) => {
    const municipality = SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === municipalityId);
    if (municipality?.id === 'sol-plaatje') {
      return '/img/img-Municipality/Sol Plaatje Municipality.png';
    }
    return null;
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    onBack();
  };

  // Get user's municipality info
  const userMunicipality = userData?.municipality ? 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === userData.municipality.id) : 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === 'sol-plaatje'); // Default to Sol Plaatje
   
  const municipalityLogo = userData?.municipality?.id ? getMunicipalityLogo(userData.municipality.id) : null;

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        referenceNumber: 'CC-2025-001',
        title: 'Water Supply Interruption - Galeshewe Area',
        description: 'Residents in Galeshewe Extensions 1-3 have been without water for 18 hours. Multiple households affected including elderly residents.',
        category: 'water-sanitation',
        subcategory: 'Water Supply Interruption',
        priority: 'urgent',
        status: 'in-progress',
        reporterName: 'Maria Tsholo',
        reporterEmail: 'm.tsholo@gmail.com',
        reporterPhone: '+27 53 123 4567',
        location: 'Galeshewe Extension 2, Block B',
        ward: '7',
        gpsCoordinates: { lat: -28.7282, lng: 24.7499 },
        attachments: [
          { name: 'water_issue_photo.jpg', url: '#', type: 'image' }
        ],
        assignedTo: 'John Mokwena',
        assignedDepartment: 'Water & Sanitation',
        assignedVehicle: 'SPM-W001',
        estimatedResolution: '24 hours',
        createdAt: '2025-01-10T08:30:00Z',
        updatedAt: '2025-01-10T10:15:00Z',
        callCenterAgent: 'Sarah Williams',
        communicationLog: [
          {
            id: '1',
            type: 'call',
            message: 'Initial complaint received via phone call',
            sender: 'Maria Tsholo',
            recipient: 'Sarah Williams',
            timestamp: '2025-01-10T08:30:00Z',
            isRead: true
          },
          {
            id: '2',
            type: 'system-update',
            message: 'Report assigned to Water & Sanitation Department',
            sender: 'System',
            recipient: 'John Mokwena',
            timestamp: '2025-01-10T08:45:00Z',
            isRead: true
          },
          {
            id: '3',
            type: 'field-update',
            message: 'Technician dispatched to location. Issue identified as main valve failure.',
            sender: 'John Mokwena',
            recipient: 'Maria Tsholo',
            timestamp: '2025-01-10T10:15:00Z',
            isRead: false
          }
        ],
        isValidMunicipalIssue: true,
        escalationLevel: 1,
        timeToFirstResponse: 15,
        reopenCount: 0,
        tags: ['water', 'emergency', 'galeshewe']
      },
      {
        id: '2',
        referenceNumber: 'CC-2025-002',
        title: 'Pothole Repair Request - Oliver Road',
        description: 'Large pothole causing vehicle damage near Oliver Road intersection. Multiple residents have reported tire damage.',
        category: 'roads-infrastructure',
        subcategory: 'Potholes',
        priority: 'high',
        status: 'assigned',
        reporterName: 'David van der Merwe',
        reporterEmail: 'd.vandermerwe@outlook.com',
        reporterPhone: '+27 53 234 5678',
        location: 'Oliver Road, near N12 intersection',
        ward: '15',
        gpsCoordinates: { lat: -28.7489, lng: 24.7699 },
        attachments: [
          { name: 'pothole_damage.jpg', url: '#', type: 'image' },
          { name: 'tire_damage_invoice.pdf', url: '#', type: 'pdf' }
        ],
        assignedTo: 'Peter Sehume',
        assignedDepartment: 'Roads & Infrastructure',
        estimatedResolution: '7 days',
        createdAt: '2025-01-09T14:20:00Z',
        updatedAt: '2025-01-09T15:00:00Z',
        callCenterAgent: 'Michael Brown',
        communicationLog: [
          {
            id: '1',
            type: 'email',
            message: 'Complaint submitted via online form',
            sender: 'David van der Merwe',
            recipient: 'Michael Brown',
            timestamp: '2025-01-09T14:20:00Z',
            isRead: true
          },
          {
            id: '2',
            type: 'system-update',
            message: 'Report forwarded to Roads & Infrastructure Department',
            sender: 'System',
            recipient: 'Peter Sehume',
            timestamp: '2025-01-09T15:00:00Z',
            isRead: true
          }
        ],
        isValidMunicipalIssue: true,
        escalationLevel: 0,
        timeToFirstResponse: 40,
        reopenCount: 0,
        tags: ['roads', 'safety', 'infrastructure']
      },
      {
        id: '3',
        referenceNumber: 'CC-2025-003',
        title: 'Illegal Dumping - Vacant Lot',
        description: 'Construction waste dumped illegally in vacant lot. Creating health hazard and attracting pests.',
        category: 'waste-management',
        subcategory: 'Illegal Dumping',
        priority: 'medium',
        status: 'resolved',
        reporterName: 'Patricia Mothibi',
        reporterEmail: 'p.mothibi@yahoo.com',
        reporterPhone: '+27 53 345 6789',
        location: 'Vacant lot, corner of Hertzog & Long Street',
        ward: '11',
        gpsCoordinates: { lat: -28.7389, lng: 24.7599 },
        attachments: [
          { name: 'illegal_dump_before.jpg', url: '#', type: 'image' },
          { name: 'illegal_dump_after.jpg', url: '#', type: 'image' }
        ],
        assignedTo: 'Joseph Marumo',
        assignedDepartment: 'Waste Management',
        assignedVehicle: 'SPM-WM002',
        estimatedResolution: '3 days',
        actualResolution: '2 days',
        createdAt: '2025-01-07T11:15:00Z',
        updatedAt: '2025-01-09T16:30:00Z',
        closedAt: '2025-01-09T16:30:00Z',
        callCenterAgent: 'Linda Johnson',
        communicationLog: [
          {
            id: '1',
            type: 'call',
            message: 'Complaint received via phone',
            sender: 'Patricia Mothibi',
            recipient: 'Linda Johnson',
            timestamp: '2025-01-07T11:15:00Z',
            isRead: true
          },
          {
            id: '2',
            type: 'field-update',
            message: 'Cleanup crew dispatched and waste removed',
            sender: 'Joseph Marumo',
            recipient: 'Patricia Mothibi',
            timestamp: '2025-01-09T16:30:00Z',
            isRead: true
          }
        ],
        isValidMunicipalIssue: true,
        resolutionNotes: 'Waste successfully removed. Area cleaned and disinfected. Warning signs posted.',
        citizenFeedback: {
          rating: 5,
          comments: 'Very satisfied with quick response and thorough cleanup.',
          submittedAt: '2025-01-09T18:00:00Z'
        },
        escalationLevel: 0,
        timeToFirstResponse: 25,
        totalResolutionTime: 2160, // minutes
        reopenCount: 0,
        tags: ['waste', 'cleanup', 'environment']
      }
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);

    // Calculate analytics
    const totalReports = mockReports.length;
    const newReports = mockReports.filter(r => r.status === 'new').length;
    const inProgress = mockReports.filter(r => ['assigned', 'in-progress'].includes(r.status)).length;
    const resolved = mockReports.filter(r => ['resolved', 'closed'].includes(r.status)).length;
    const avgResolutionTime = mockReports
      .filter(r => r.totalResolutionTime)
      .reduce((acc, r) => acc + (r.totalResolutionTime || 0), 0) / 
      mockReports.filter(r => r.totalResolutionTime).length || 0;
    
    setAnalytics({
      totalReports,
      newReports,
      inProgress,
      resolved,
      averageResolutionTime: Math.round(avgResolutionTime / 60), // convert to hours
      citizenSatisfaction: 4.5,
      departmentPerformance: [],
      timeToFirstResponse: 27,
      escalatedReports: mockReports.filter(r => r.escalationLevel > 0).length
    });
  }, []);

  // Filter and sort reports
  useEffect(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = filters.searchTerm === '' || 
        report.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.referenceNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.reporterName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || report.status === filters.status;
      const matchesPriority = filters.priority === 'all' || report.priority === filters.priority;
      const matchesCategory = filters.category === 'all' || report.category === filters.category;
      const matchesAssignedTo = filters.assignedTo === 'all' || report.assignedTo === filters.assignedTo;
      const matchesDepartment = filters.department === 'all' || report.assignedDepartment === filters.department;
      const matchesWard = filters.ward === 'all' || report.ward === filters.ward;
      const matchesEscalation = filters.escalationLevel === 'all' || 
        (filters.escalationLevel === '0' && report.escalationLevel === 0) ||
        (filters.escalationLevel === '1+' && report.escalationLevel > 0);

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && 
             matchesAssignedTo && matchesDepartment && matchesWard && matchesEscalation;
    });

    // Sort reports
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Report];
      let bValue = b[sortBy as keyof Report];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [reports, filters, sortBy, sortOrder]);

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'pending-review': 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus as any,
            updatedAt: new Date().toISOString(),
            ...(newStatus === 'closed' && { closedAt: new Date().toISOString() })
          }
        : report
    ));
    toast.success(`Report status updated to ${newStatus}`);
  };

  const handleAssignReport = (reportId: string, assignedTo: string, department: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            assignedTo,
            assignedDepartment: department,
            status: 'assigned' as any,
            updatedAt: new Date().toISOString()
          }
        : report
    ));
    toast.success(`Report assigned to ${assignedTo}`);
  };

  const renderAnalyticCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
          </div>
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">New Reports</p>
            <p className="text-3xl font-bold text-yellow-600">{reports.filter(r => r.status === 'new').length}</p>
          </div>
          <Bell className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{reports.filter(r => r.status === 'in-progress').length}</p>
          </div>
          <Activity className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Resolved Today</p>
            <p className="text-3xl font-bold text-green-600">{reports.filter(r => r.status === 'resolved').length}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
  );

  const renderFilters = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="pending-review">Pending Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select 
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="water-sanitation">Water & Sanitation</option>
                <option value="roads-infrastructure">Roads & Infrastructure</option>
                <option value="waste-management">Waste Management</option>
                <option value="electricity">Electricity</option>
                <option value="parks-recreation">Parks & Recreation</option>
                <option value="housing">Housing</option>
                <option value="safety-security">Safety & Security</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ward</label>
              <select 
                value={filters.ward}
                onChange={(e) => setFilters(prev => ({ ...prev, ward: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Wards</option>
                {Array.from({ length: 33 }, (_, i) => i + 1).map(ward => (
                  <option key={ward} value={ward.toString()}>Ward {ward}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderReportsTable = () => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    const currentReports = filteredReports.slice(startIndex, endIndex);

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Reporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.referenceNumber}</p>
                      <p className="text-xs text-gray-500">Ward {report.ward}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{report.title}</p>
                      <p className="text-xs text-gray-500">{report.reporterName}</p>
                      <p className="text-xs text-gray-400">{report.reporterPhone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(report.priority)}`}>
                      {report.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{report.assignedTo || 'Unassigned'}</p>
                      <p className="text-xs text-gray-500">{report.assignedDepartment}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={endIndex >= filteredReports.length}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredReports.length)}</span> of{' '}
                <span className="font-medium">{filteredReports.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={endIndex >= filteredReports.length}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Dynamic Municipality Branding */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 shadow-lg relative overflow-visible">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30 shadow-lg overflow-hidden">
                  {municipalityLogo ? (
                    <img 
                      src={municipalityLogo} 
                      alt={`${userMunicipality?.name} Logo`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Phone className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Call Center Dashboard
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base font-medium">
                    {userMunicipality?.name || 'Sol Plaatje Municipality'}
                  </p>
                  <p className="text-blue-200 text-xs">
                    {userMunicipality?.province || 'Northern Cape Province'} • Municipal Call Operations
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2.5 hover:bg-white/25 transition-all duration-200 flex items-center gap-2 border border-white/20 shadow-lg text-white font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Report
                </button>

                {userData && (
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 hover:bg-white/25 transition-all duration-200 cursor-pointer border border-white/20 shadow-lg"
                    >
                      <div className="hidden sm:block">
                        <p className="text-sm font-bold text-white text-right">{userData.name}</p>
                        <p className="text-xs text-blue-100 capitalize text-right font-medium">{userData.type.replace('-', ' ')}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center ring-2 ring-white/20">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-[100] ring-1 ring-black/5">
                        <div className="px-5 py-4 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 mb-1">{userData.name}</p>
                          <p className="text-xs text-gray-500 mb-2">{userData.email}</p>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                            {userData.type.replace('-', ' ')}
                          </div>
                        </div>
                        
                        <button
                          onClick={onBack}
                          className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-all duration-200 group"
                        >
                          <Home className="w-4 h-4 group-hover:text-blue-600" />
                          <span className="font-medium">Back to Portal</span>
                        </button>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-3 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:text-red-600" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {reports.filter(r => r.status === 'new').length} New Reports
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Total: {reports.length}</span>
                </div>
              </div>
              
              <button
                onClick={() => {/* handle export */}}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
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
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'reports', label: 'All Reports', icon: FileText },
              { id: 'new-report', label: 'New Report', icon: Plus },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Analytics Cards */}
            {renderAnalyticCards()}

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search reports by reference, title, reporter name..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${
                      showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  
                  <button className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {renderFilters()}

            {/* Reports Table */}
            {renderReportsTable()}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {renderReportsTable()}
          </div>
        )}

        {activeTab === 'new-report' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Report</h2>
            <p className="text-gray-600">New report form would go here...</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {renderAnalyticCards()}
          </div>
        )}
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedReport.referenceNumber}</h2>
                  <p className="text-gray-600">{selectedReport.title}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Report Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Report Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(selectedReport.priority)}`}>
                          {selectedReport.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">{selectedReport.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{selectedReport.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ward:</span>
                        <span className="font-medium">Ward {selectedReport.ward}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reporter Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Name:</span>
                        <span className="font-medium">{selectedReport.reporterName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedReport.reporterEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{selectedReport.reporterPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication Log */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Communication Log</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedReport.communicationLog.map((entry) => (
                      <div key={entry.id} className="border-l-4 border-emerald-400 pl-4 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">{entry.sender}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{entry.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedReport.description}</p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                  Update Status
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Assign
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Add Note
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CallCenterDashboard; 