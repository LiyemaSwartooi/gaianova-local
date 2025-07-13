import { CivicReport, CommunicationEntry, UserProfile, DepartmentStats, ReportAnalytics } from '../types';
import { SOL_PLAATJE_MUNICIPALITY, MUNICIPAL_ISSUE_CATEGORIES, generateReferenceNumber } from '../data/municipalities';

// Validate if issue is within municipal scope
export const validateMunicipalScope = (category: string, description: string): boolean => {
  const nonMunicipalKeywords = [
    'shark', 'sharks', 'ocean', 'marine', 'federal', 'national', 'provincial court',
    'passport', 'visa', 'immigration', 'customs', 'airport security', 'airline',
    'bank fraud', 'credit card', 'insurance claim', 'private property dispute',
    'family court', 'divorce', 'custody', 'estate', 'inheritance'
  ];

  const text = `${category} ${description}`.toLowerCase();
  
  // Check for non-municipal keywords
  const hasNonMunicipalKeyword = nonMunicipalKeywords.some(keyword => 
    text.includes(keyword)
  );

  if (hasNonMunicipalKeyword) {
    return false;
  }

  // Check if category is in municipal scope
  const validCategories = MUNICIPAL_ISSUE_CATEGORIES.map(cat => cat.id);
  const legacyCategories = ['illegal-dumping', 'broken-streetlights', 'water-issues', 'sewage-spills', 'potholes', 'other'];
  
  return validCategories.includes(category) || legacyCategories.includes(category);
};

// Generate enhanced reference number with QR code
export const generateEnhancedReferenceNumber = (category: string, ward: string): { referenceNumber: string; qrCode: string } => {
  const refNumber = generateReferenceNumber(category, ward);
  const qrCode = `https://solplaatje.gov.za/track/${refNumber}`;
  
  return {
    referenceNumber: refNumber,
    qrCode: qrCode
  };
};

  // Auto-assign department based on category
export const assignDepartment = (category: string): string => {
  const categoryMapping: { [key: string]: string } = {
    'water-issues': 'water-sanitation',
    'sewage-spills': 'water-sanitation',
    'water-sanitation': 'water-sanitation',
    'potholes': 'roads-infrastructure',
    'broken-streetlights': 'roads-infrastructure',
    'roads-infrastructure': 'roads-infrastructure',
    'illegal-dumping': 'waste-management',
    'waste-management': 'waste-management',
    'parks-recreation': 'parks-recreation',
    'public-safety': 'public-safety',
    'crime-security': 'public-safety',
    'housing': 'housing',
    'other': 'public-safety' // Default assignment
  };

  return categoryMapping[category] || 'public-safety';
};

// Get expected resolution timeframe
export const getExpectedResolutionTime = (category: string, priority: string): string => {
  const categoryConfig = MUNICIPAL_ISSUE_CATEGORIES.find(cat => cat.id === category);
  
  if (categoryConfig) {
    // For crime-security, adjust based on priority
    if (category === 'crime-security') {
      switch (priority) {
        case 'emergency': return '1-4 hours';
        case 'high': return '4-24 hours';
        case 'medium': return '24-48 hours';
        case 'low': return '2-7 days';
        default: return '24-48 hours';
      }
    }
    return categoryConfig.expectedResolution;
  }

  // Fallback based on priority
  switch (priority) {
    case 'emergency': return '1-4 hours';
    case 'high': return '24-48 hours';
    case 'medium': return '3-7 days';
    case 'low': return '7-30 days';
    default: return '7-14 days';
  }
};

// Create communication entry
export const createCommunicationEntry = (
  type: CommunicationEntry['type'],
  message: string,
  sender: string,
  recipient: string
): CommunicationEntry => {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    type,
    message,
    sender,
    recipient,
    status: 'sent'
  };
};

// Send notification (mock implementation)
export const sendNotification = async (
  type: 'sms' | 'email',
  recipient: string,
  message: string,
  reportId: string
): Promise<boolean> => {
  // Mock implementation - in real app, integrate with SMS/Email service
  console.log(`Sending ${type} to ${recipient}: ${message}`);
  
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock success rate (95%)
  return Math.random() > 0.05;
};

// Calculate user workload
export const calculateUserWorkload = (user: UserProfile, reports: CivicReport[]): number => {
  const userReports = reports.filter(report => 
    report.assignedTo === user.id && 
    ['pending', 'in-progress'].includes(report.status)
  );

  const maxCapacity = user.workloadCapacity || 10;
  return Math.round((userReports.length / maxCapacity) * 100);
};

// Find best available staff member for assignment
export const findBestAssignee = (
  department: string,
  users: UserProfile[],
  reports: CivicReport[]
): UserProfile | null => {
  const departmentStaff = users.filter(user => 
    user.department === department && 
    user.isActive &&
    ['municipal-staff', 'department-head'].includes(user.role)
  );

  if (departmentStaff.length === 0) return null;

  // Sort by workload (ascending) and performance (descending)
  const staffWithWorkload = departmentStaff.map(staff => ({
    ...staff,
    currentWorkload: calculateUserWorkload(staff, reports),
    performanceScore: staff.performanceMetrics?.citizenSatisfactionRating || 0
  }));

  staffWithWorkload.sort((a, b) => {
    // First priority: lower workload
    if (a.currentWorkload !== b.currentWorkload) {
      return a.currentWorkload - b.currentWorkload;
    }
    // Second priority: higher performance
    return b.performanceScore - a.performanceScore;
  });

  return staffWithWorkload[0];
};

// Auto-assign fleet vehicle
export const assignFleetVehicle = (department: string, reportType: string): string | null => {
  const municipality = SOL_PLAATJE_MUNICIPALITY;
  const availableVehicles = municipality.fleetVehicles.filter(vehicle => 
    vehicle.department === department && 
    vehicle.status === 'available'
  );

  if (availableVehicles.length === 0) return null;

  // Prioritize vehicle type based on report type
  const priorityOrder = ['specialized', 'truck', 'van', 'car'];
  
  for (const vehicleType of priorityOrder) {
    const vehicle = availableVehicles.find(v => v.type === vehicleType);
    if (vehicle) return vehicle.id;
  }

  return availableVehicles[0].id;
};

// Calculate department statistics
export const calculateDepartmentStats = (
  departmentId: string,
  reports: CivicReport[]
): DepartmentStats => {
  const departmentReports = reports.filter(report => 
    report.assignedDepartment === departmentId
  );

  const totalReports = departmentReports.length;
  const pendingReports = departmentReports.filter(r => r.status === 'pending').length;
  const inProgressReports = departmentReports.filter(r => r.status === 'in-progress').length;
  const completedReports = departmentReports.filter(r => r.status === 'completed').length;

  // Calculate average resolution time for completed reports
  const completedWithTime = departmentReports.filter(r => 
    r.status === 'completed' && r.actualResolutionTime
  );
  
  const averageResolutionTime = completedWithTime.length > 0
    ? completedWithTime.reduce((sum, report) => {
        const created = new Date(report.createdAt);
        const completed = new Date(report.actualResolutionTime!);
        return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }, 0) / completedWithTime.length
    : 0;

  // Calculate citizen satisfaction
  const reportsWithRating = departmentReports.filter(r => r.feedbackRating);
  const citizenSatisfactionRating = reportsWithRating.length > 0
    ? reportsWithRating.reduce((sum, report) => sum + (report.feedbackRating || 0), 0) / reportsWithRating.length
    : 0;

  // Mock fleet and staff utilization (in real app, calculate from actual data)
  const fleetUtilization = Math.random() * 100;
  const staffUtilization = Math.random() * 100;

  const department = SOL_PLAATJE_MUNICIPALITY.departments.find(d => d.id === departmentId);

  return {
    id: departmentId,
    name: department?.name || 'Unknown Department',
    totalReports,
    pendingReports,
    inProgressReports,
    completedReports,
    averageResolutionTime,
    citizenSatisfactionRating,
    fleetUtilization,
    staffUtilization
  };
};

// Generate comprehensive analytics
export const generateReportAnalytics = (reports: CivicReport[]): ReportAnalytics => {
  const totalReports = reports.length;

  // Reports by category
  const reportsByCategory: { [key: string]: number } = {};
  reports.forEach(report => {
    reportsByCategory[report.category] = (reportsByCategory[report.category] || 0) + 1;
  });

  // Reports by ward
  const reportsByWard: { [key: string]: number } = {};
  reports.forEach(report => {
    if (report.ward) {
      reportsByWard[report.ward] = (reportsByWard[report.ward] || 0) + 1;
    }
  });

  // Reports by status
  const reportsByStatus: { [key: string]: number } = {};
  reports.forEach(report => {
    reportsByStatus[report.status] = (reportsByStatus[report.status] || 0) + 1;
  });

  // Reports by priority
  const reportsByPriority: { [key: string]: number } = {};
  reports.forEach(report => {
    reportsByPriority[report.priority] = (reportsByPriority[report.priority] || 0) + 1;
  });

  // Average resolution time
  const completedReports = reports.filter(r => r.status === 'completed' && r.actualResolutionTime);
  const averageResolutionTime = completedReports.length > 0
    ? completedReports.reduce((sum, report) => {
        const created = new Date(report.createdAt);
        const completed = new Date(report.actualResolutionTime!);
        return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }, 0) / completedReports.length
    : 0;

  // Citizen satisfaction rating
  const reportsWithRating = reports.filter(r => r.feedbackRating);
  const citizenSatisfactionRating = reportsWithRating.length > 0
    ? reportsWithRating.reduce((sum, report) => sum + (report.feedbackRating || 0), 0) / reportsWithRating.length
    : 0;

  // Generate trend data (last 12 months)
  const trendData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const monthReports = reports.filter(report => {
      const reportDate = new Date(report.createdAt);
      return reportDate >= monthStart && reportDate <= monthEnd;
    });

    const monthCompleted = monthReports.filter(r => r.status === 'completed');
    const monthWithRating = monthReports.filter(r => r.feedbackRating);

    trendData.push({
      period: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      totalReports: monthReports.length,
      completedReports: monthCompleted.length,
      averageResolutionTime: monthCompleted.length > 0
        ? monthCompleted.reduce((sum, report) => {
            if (!report.actualResolutionTime) return sum;
            const created = new Date(report.createdAt);
            const completed = new Date(report.actualResolutionTime);
            return sum + (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
          }, 0) / monthCompleted.length
        : 0,
      citizenSatisfaction: monthWithRating.length > 0
        ? monthWithRating.reduce((sum, report) => sum + (report.feedbackRating || 0), 0) / monthWithRating.length
        : 0
    });
  }

  return {
    totalReports,
    reportsByCategory,
    reportsByWard,
    reportsByStatus,
    reportsByPriority,
    averageResolutionTime,
    citizenSatisfactionRating,
    trendData
  };
};

// Export data functionality
export const exportReportsData = async (
  reports: CivicReport[],
  format: 'csv' | 'excel' | 'pdf',
  options: any = {}
): Promise<string> => {
  // Mock implementation - in real app, generate actual files
  console.log(`Exporting ${reports.length} reports as ${format}`);
  
  if (format === 'csv') {
    const headers = [
      'Reference Number', 'Title', 'Category', 'Priority', 'Status', 
      'Ward', 'Reporter Name', 'Created At', 'Assigned Department'
    ];
    
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        report.referenceNumber || report.id,
        `"${report.title}"`,
        report.category,
        report.priority,
        report.status,
        report.ward || '',
        `"${report.reporterName}"`,
        report.createdAt,
        report.assignedDepartment || ''
      ].join(','))
    ].join('\n');
    
    // Create downloadable blob
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `sol-plaatje-reports-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    return url;
  }
  
  // For other formats, return mock URL
  return `mock-export-url-${format}-${Date.now()}`;
}; 