import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  Square,
  FileText, 
  MapPin, 
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Timer,
  Camera,
  Upload,
  MessageCircle,
  Phone,
  Navigation,
  Battery,
  Wifi,
  Signal,
  ChevronRight,
  ArrowLeft,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  BarChart3,
  Home,
  Truck,
  Shield,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { SOUTH_AFRICAN_MUNICIPALITIES } from '../data/municipalities';

interface TimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activity: string;
  location: string;
  notes?: string;
}

interface WorkOrder {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'assigned' | 'in-progress' | 'completed' | 'on-hold';
  location: string;
  estimatedDuration: string;
  dueDate: string;
  assignedBy: string;
  category: string;
}

interface FieldWorkerDashboardProps {
  userData: any;
  onBack: () => void;
}

// Utility function to get municipality logo
const getMunicipalityLogo = (municipalityId: string) => {
  const municipality = SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === municipalityId);
  if (municipality?.id === 'sol-plaatje') {
    return '/img/img-Municipality/Sol Plaatje Municipality.png';
  }
  return null;
};

const FieldWorkerDashboard: React.FC<FieldWorkerDashboardProps> = ({ userData, onBack }) => {
  const [activeTab, setActiveTab] = useState('timesheet');
  const [isClockIn, setIsClockIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Load sample work orders
  useEffect(() => {
    const sampleOrders: WorkOrder[] = [
      {
        id: '1',
        referenceNumber: 'WO-2025-001',
        title: 'Fix water leak on Main Street',
        description: 'Repair burst water pipe near intersection of Main Street and Oak Avenue',
        priority: 'urgent',
        status: 'assigned',
        location: 'Main Street & Oak Avenue',
        estimatedDuration: '4 hours',
        dueDate: '2025-01-10',
        assignedBy: 'John Manager',
        category: 'Water & Sanitation'
      },
      {
        id: '2',
        referenceNumber: 'WO-2025-002', 
        title: 'Pothole repair on Park Road',
        description: 'Fill and seal multiple potholes on Park Road between blocks 5-8',
        priority: 'high',
        status: 'assigned',
        location: 'Park Road, Blocks 5-8',
        estimatedDuration: '6 hours',
        dueDate: '2025-01-12',
        assignedBy: 'Sarah Supervisor',
        category: 'Roads & Infrastructure'
      }
    ];
    setWorkOrders(sampleOrders);
  }, []);

  const handleClockIn = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      activity: 'General Work',
      location: 'Field Location'
    };
    
    setActiveEntry(newEntry);
    setIsClockIn(true);
    toast.success('Clocked in successfully!');
  };

  const handleClockOut = () => {
    if (activeEntry) {
      const endTime = new Date();
      const startTime = new Date(activeEntry.startTime);
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60); // minutes
      
      const completedEntry: TimeEntry = {
        ...activeEntry,
        endTime: endTime.toISOString(),
        duration
      };
      
      setTimeEntries(prev => [completedEntry, ...prev]);
      setActiveEntry(null);
      setIsClockIn(false);
      toast.success(`Clocked out! Worked for ${duration} minutes`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    onBack();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      'on-hold': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.assigned;
  };

  // Get user's municipality info
  const userMunicipality = userData?.municipality ? 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === userData.municipality.id) : 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === 'sol-plaatje'); // Default to Sol Plaatje
  
  const municipalityLogo = userData?.municipality?.id ? getMunicipalityLogo(userData.municipality.id) : null;

  const renderTimeSheet = () => (
    <div className="space-y-6">
      {/* Current Time & Status */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{formatTime(currentTime)}</h2>
            <p className="text-blue-100">{formatDate(currentTime)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Status</p>
            <p className="text-lg font-semibold">
              {isClockIn ? 'Clocked In' : 'Clocked Out'}
            </p>
          </div>
        </div>
        
        {/* Clock In/Out Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isClockIn ? handleClockOut : handleClockIn}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
            isClockIn 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white hover:bg-gray-50 text-blue-700'
          }`}
        >
          {isClockIn ? (
            <>
              <Square className="w-6 h-6" />
              Clock Out
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              Clock In
            </>
          )}
        </motion.button>
      </div>

      {/* Active Session */}
      {activeEntry && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-800">Active Session</h3>
              <p className="text-yellow-600">Started at {new Date(activeEntry.startTime).toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-600">Duration</p>
              <p className="text-lg font-bold text-yellow-800">
                {Math.floor((currentTime.getTime() - new Date(activeEntry.startTime).getTime()) / 1000 / 60)} min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Time Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Today's Time Entries</h3>
        </div>
        <div className="p-6">
          {timeEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No time entries today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timeEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{entry.activity}</p>
                    <p className="text-sm text-gray-600">{entry.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(entry.startTime).toLocaleTimeString()} - {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : 'Active'}
                    </p>
                    {entry.duration && (
                      <p className="font-semibold text-gray-900">{entry.duration} min</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWorkOrders = () => (
    <div className="space-y-6">
      {/* Work Orders Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Work Orders</h2>
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            {workOrders.filter(wo => wo.status === 'assigned').length} Assigned
          </span>
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {workOrders.map(order => (
          <motion.div
            key={order.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{order.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                    {order.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{order.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {order.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {order.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    Est: {order.estimatedDuration}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('-', ' ').toUpperCase()}
                </span>
                <p className="text-xs text-gray-500 mt-2">{order.referenceNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors font-medium">
                Start Work
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Field Reports</h3>
        <p className="text-gray-600">Submit daily field reports and update work progress.</p>
        <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium">
          Create Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Dynamic Municipality Branding */}
      <header className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-600 shadow-lg relative overflow-visible">
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
                    <Shield className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Field Worker Dashboard
                  </h1>
                  <p className="text-emerald-100 text-sm sm:text-base font-medium">
                    {userMunicipality?.name || 'Sol Plaatje Municipality'}
                  </p>
                  <p className="text-emerald-200 text-xs">
                    {userMunicipality?.province || 'Northern Cape Province'} • Municipal Field Operations
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {userData && (
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 hover:bg-white/25 transition-all duration-200 cursor-pointer border border-white/20 shadow-lg"
                    >
                      <div className="hidden sm:block">
                        <p className="text-sm font-bold text-white text-right">{userData.name}</p>
                        <p className="text-xs text-emerald-100 capitalize text-right font-medium">{userData.type.replace('-', ' ')}</p>
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
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">
                            {userData.type.replace('-', ' ')}
                          </div>
                        </div>
                        
                        <button
                          onClick={onBack}
                          className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                        >
                          <Home className="w-4 h-4 group-hover:text-emerald-600" />
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
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                  <Bell className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">
                    {workOrders.filter(wo => wo.status === 'assigned').length} Active Work Orders
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">
                    Status: {isClockIn ? 'On Duty' : 'Off Duty'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'timesheet', label: 'Timesheet', icon: Clock },
              { id: 'workorders', label: 'Work Orders', icon: FileText },
              { id: 'reports', label: 'Field Reports', icon: Camera }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'timesheet' && renderTimeSheet()}
        {activeTab === 'workorders' && renderWorkOrders()}
        {activeTab === 'reports' && renderReports()}
      </main>
    </div>
  );
};

export default FieldWorkerDashboard;