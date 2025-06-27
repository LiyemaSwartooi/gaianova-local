export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: 'illegal-dumping' | 'broken-streetlights' | 'water-issues' | 'sewage-spills' | 'potholes' | 'other';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  location: string;
  ward?: string;
  municipality?: string;
  reporterName: string;
  reporterEmail?: string;
  reporterPhone?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  notes?: string;
  photoUrl?: string;
}

export type UserRole = 'citizen' | 'municipal-staff' | 'ward-councillor';

// Legacy type alias for backward compatibility
export type MaintenanceRequest = CivicReport;