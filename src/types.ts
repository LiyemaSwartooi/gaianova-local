export interface CivicReport {
  id: string;
  referenceNumber?: string;
  title: string;
  description: string;
  category: 'illegal-dumping' | 'broken-streetlights' | 'water-issues' | 'sewage-spills' | 'potholes' | 'other' | 
           'water-sanitation' | 'roads-infrastructure' | 'waste-management' | 'parks-recreation' | 'public-safety' | 'housing' | 'crime-security';
  subcategory?: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'escalated';
  location: string;
  ward?: string;
  municipality?: string;
  reporterName: string;
  reporterEmail?: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  assignedDepartment?: string;
  assignedVehicle?: string;
  notes?: string;
  photoUrl?: string;
  estimatedResolution?: string;
  actualResolutionTime?: string;
  feedbackRating?: number;
  feedbackComments?: string;
  qrCode?: string;
  communicationLog?: CommunicationEntry[];
  isValidMunicipalIssue?: boolean;
}

export interface CommunicationEntry {
  id: string;
  timestamp: string;
  type: 'sms' | 'email' | 'call' | 'system-update' | 'field-update';
  message: string;
  sender: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  ward?: string;
  municipality: string;
  lastLogin?: string;
  isActive: boolean;
  permissions: string[];
  workloadCapacity?: number;
  currentAssignments?: string[];
  performanceMetrics?: UserPerformanceMetrics;
}

export interface UserPerformanceMetrics {
  totalReportsHandled: number;
  averageResolutionTime: number;
  citizenSatisfactionRating: number;
  onTimeCompletion: number;
  escalationRate: number;
}

export interface DepartmentStats {
  id: string;
  name: string;
  totalReports: number;
  pendingReports: number;
  inProgressReports: number;
  completedReports: number;
  averageResolutionTime: number;
  citizenSatisfactionRating: number;
  fleetUtilization: number;
  staffUtilization: number;
}

export interface FleetVehicleWithStatus {
  id: string;
  type: 'truck' | 'van' | 'car' | 'specialized';
  registration: string;
  department: string;
  status: 'available' | 'dispatched' | 'maintenance' | 'out-of-service';
  assignedTo?: string;
  currentLocation?: string;
  assignedReports?: string[];
  lastMaintenance?: string;
  fuelLevel?: number;
  mileage?: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'interactive' | 'document' | 'quiz';
  duration: number;
  targetAudience: UserRole[];
  isRequired: boolean;
  completionRate: number;
}

export interface UserTrainingProgress {
  userId: string;
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'certified';
  progress: number;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  certificateUrl?: string;
}

export type UserRole = 'citizen' | 'municipal-staff' | 'ward-councillor' | 'department-head' | 'fleet-manager' | 'call-center-agent';

// Legacy type alias for backward compatibility
export type MaintenanceRequest = CivicReport;

// Enhanced reporting and analytics types
export interface ReportAnalytics {
  totalReports: number;
  reportsByCategory: { [key: string]: number };
  reportsByWard: { [key: string]: number };
  reportsByStatus: { [key: string]: number };
  reportsByPriority: { [key: string]: number };
  averageResolutionTime: number;
  citizenSatisfactionRating: number;
  trendData: TrendData[];
}

export interface TrendData {
  period: string;
  totalReports: number;
  completedReports: number;
  averageResolutionTime: number;
  citizenSatisfaction: number;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    ward?: string;
    category?: string;
    status?: string;
    department?: string;
  };
  includeImages: boolean;
  includeCommunicationLog: boolean;
}