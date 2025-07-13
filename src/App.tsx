import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { User, Building, LogOut, BarChart3, Shield } from 'lucide-react';
import { Toaster } from 'sonner';
import CivicDashboard from './components/CivicDashboard';
import MunicipalDashboard from './components/MunicipalDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import SuccessPage from './components/SuccessPage';
import AccessPortal from './components/AccessPortal';
import MunicipalPortal from './components/MunicipalPortal';
import FieldWorkerDashboard from './components/FieldWorkerDashboard';
import CallCenterDashboard from './components/CallCenterDashboard';
import WardCouncillorDashboard from './components/WardCouncillorDashboard';
import { MaintenanceRequest } from './types';
import { generateEnhancedReferenceNumber, assignDepartment, getExpectedResolutionTime, createCommunicationEntry } from './utils/municipalUtils';
import { SOUTH_AFRICAN_MUNICIPALITIES } from './data/municipalities';
const logo = '/img/Gaianova_logo-removebg-preview.png';

// Utility function to get municipality logo
const getMunicipalityLogo = (municipalityId: string) => {
  const municipality = SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === municipalityId);
  if (municipality?.id === 'sol-plaatje') {
    return '/img/img-Municipality/Sol Plaatje Municipality.png';
  }
  // For other municipalities, you can add their specific logos here
  // Example: if (municipality?.id === 'cape-town-metro') return '/img/img-Municipality/Cape Town Municipality.png';
  
  // Default to shield icon for municipalities without specific logos
  return null;
};

function App() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<any>(null);
  const navigate = useNavigate();

  // Load sample data on component mount
  useEffect(() => {
    const sampleRequests: MaintenanceRequest[] = [
      {
        id: '1',
        referenceNumber: 'SPM-20241201-W07-WA001',
        title: 'Water Pipe Burst on Beaconsfield Main Road',
        description: 'Major water pipe has burst near the traffic circle on Beaconsfield Main Road. Water is flooding the street and affecting several businesses. Residents in the area are without water supply.',
        category: 'water-sanitation',
        subcategory: 'Pipe Burst/Leak',
        priority: 'emergency',
        status: 'in-progress',
        location: 'Beaconsfield Main Road, near Traffic Circle',
        ward: '7',
        municipality: 'Sol Plaatje Local Municipality',
        reporterName: 'John Botha',
        reporterEmail: 'j.botha@email.com',
        reporterPhone: '+27 53 123 4567',
        assignedDepartment: 'water-sanitation',
        assignedTo: 'user1',
        assignedVehicle: 'SPM-W001',
        estimatedResolution: '24-72 hours',
        isValidMunicipalIssue: true,
        qrCode: 'https://solplaatje.gov.za/track/SPM-20241201-W07-WA001',
        communicationLog: [
          createCommunicationEntry('system-update', 'Report received and assigned to Water & Sanitation department', 'System', 'j.botha@email.com'),
          createCommunicationEntry('field-update', 'Technician dispatched to location', 'Municipal Staff', 'j.botha@email.com')
        ],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      {
        id: '2',
        referenceNumber: 'SPM-20241129-W15-RO002',
        title: 'Multiple Potholes on Du Toitspan Road',
        description: 'Several large potholes have developed on Du Toitspan Road between the hospital and the shopping center. These are causing damage to vehicles and creating safety hazards for motorists.',
        category: 'roads-infrastructure',
        subcategory: 'Potholes',
        priority: 'high',
        status: 'pending',
        location: 'Du Toitspan Road, between Hospital and Diamond Pavilion',
        ward: '15',
        municipality: 'Sol Plaatje Local Municipality',
        reporterName: 'Maria van Wyk',
        reporterEmail: 'm.vanwyk@gmail.com',
        reporterPhone: '+27 53 234 5678',
        assignedDepartment: 'roads-infrastructure',
        estimatedResolution: '3-14 days',
        isValidMunicipalIssue: true,
        qrCode: 'https://solplaatje.gov.za/track/SPM-20241129-W15-RO002',
        communicationLog: [
          createCommunicationEntry('system-update', 'Report received and assigned to Roads & Infrastructure department', 'System', 'm.vanwyk@gmail.com')
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        referenceNumber: 'SPM-20241127-W22-WM003',
        title: 'Illegal Dumping at Bloemanda Extension',
        description: 'Large amounts of building rubble and household waste have been dumped in the open field near Bloemanda Extension. This is creating health hazards and attracting pests.',
        category: 'waste-management',
        subcategory: 'Illegal Dumping',
        priority: 'medium',
        status: 'completed',
        location: 'Open field near Bloemanda Extension',
        ward: '22',
        municipality: 'Sol Plaatje Local Municipality',
        reporterName: 'Thomas Mokwena',
        reporterEmail: 't.mokwena@yahoo.com',
        reporterPhone: '+27 53 345 6789',
        assignedDepartment: 'waste-management',
        assignedTo: 'user2',
        assignedVehicle: 'SPM-WM001',
        estimatedResolution: '1-7 days',
        actualResolutionTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        feedbackRating: 4,
        feedbackComments: 'Good response time and thorough cleanup.',
        isValidMunicipalIssue: true,
        qrCode: 'https://solplaatje.gov.za/track/SPM-20241127-W22-WM003',
        communicationLog: [
          createCommunicationEntry('system-update', 'Report received and assigned to Waste Management department', 'System', 't.mokwena@yahoo.com'),
          createCommunicationEntry('field-update', 'Cleanup crew dispatched', 'Municipal Staff', 't.mokwena@yahoo.com'),
          createCommunicationEntry('system-update', 'Cleanup completed successfully', 'System', 't.mokwena@yahoo.com')
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        referenceNumber: 'SPM-20241130-W11-RO004',
        title: 'Broken Streetlights on Cassandra Main Road',
        description: 'Three streetlights are not working on Cassandra Main Road near the school. This creates a safety hazard for pedestrians and children walking to school.',
        category: 'roads-infrastructure',
        subcategory: 'Broken Streetlights',
        priority: 'high',
        status: 'in-progress',
        location: 'Cassandra Main Road, near Cassandra Primary School',
        ward: '11',
        municipality: 'Sol Plaatje Local Municipality',
        reporterName: 'Susan Sehume',
        reporterEmail: 's.sehume@outlook.com',
        reporterPhone: '+27 53 456 7890',
        assignedDepartment: 'roads-infrastructure',
        assignedTo: 'user2',
        estimatedResolution: '3-14 days',
        isValidMunicipalIssue: true,
        qrCode: 'https://solplaatje.gov.za/track/SPM-20241130-W11-RO004',
        communicationLog: [
          createCommunicationEntry('system-update', 'Report received and assigned to Roads & Infrastructure department', 'System', 's.sehume@outlook.com'),
          createCommunicationEntry('field-update', 'Technician inspected lights, ordering replacement parts', 'Municipal Staff', 's.sehume@outlook.com')
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        referenceNumber: 'SPM-20241128-W03-PA005',
        title: 'Damaged Playground Equipment at Galeshewe Park',
        description: 'The swing set at Galeshewe Central Park has broken chains and the slide has sharp edges. This poses a safety risk to children using the playground.',
        category: 'parks-recreation',
        subcategory: 'Playground Equipment',
        priority: 'medium',
        status: 'pending',
        location: 'Galeshewe Central Park, near Community Hall',
        ward: '3',
        municipality: 'Sol Plaatje Local Municipality',
        reporterName: 'Patricia Mothibi',
        reporterEmail: 'p.mothibi@yahoo.com',
        reporterPhone: '+27 53 567 8901',
        assignedDepartment: 'parks-recreation',
        estimatedResolution: '7-30 days',
        isValidMunicipalIssue: true,
        qrCode: 'https://solplaatje.gov.za/track/SPM-20241128-W03-PA005',
        communicationLog: [
          createCommunicationEntry('system-update', 'Report received and assigned to Parks & Recreation department', 'System', 'p.mothibi@yahoo.com')
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setRequests(sampleRequests);
  }, []);

  const handleSubmitRequest = (requestData: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: MaintenanceRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleReportSubmit = (reportData: any) => {
    // Convert the report data to match MaintenanceRequest format
    const newRequest: MaintenanceRequest = {
      id: reportData.id,
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      priority: reportData.priority as 'low' | 'medium' | 'high',
      status: 'pending' as const,
      location: `${reportData.area || reportData.building || ''}, ${reportData.location}`.trim().replace(/^,\s*/, ''),
      ward: reportData.ward,
      municipality: reportData.municipality,
      reporterName: reportData.fullName,
      reporterEmail: reportData.email,
      reporterPhone: reportData.phone,
      createdAt: reportData.createdAt,
      photoUrl: reportData.photoUrl,
      notes: undefined
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setLastSubmittedReport(reportData);
    navigate('/success');
  };

  const handleStatusChange = (id: string, status: MaintenanceRequest['status']) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status, updatedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(prev => prev.filter(request => request.id !== id));
  };

  const handleAssignRequest = (id: string, assignedTo: string, vehicle?: string) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { 
              ...request, 
              assignedTo, 
              assignedVehicle: vehicle,
              status: 'in-progress' as const,
              updatedAt: new Date().toISOString(),
              communicationLog: [
                ...(request.communicationLog || []),
                createCommunicationEntry(
                  'system-update',
                  `Report assigned to staff member. ${vehicle ? `Vehicle ${vehicle} allocated.` : ''}`,
                  'System',
                  request.reporterEmail || request.reporterName
                )
              ]
            }
          : request
      )
    );
  };

  const handleGetStarted = () => {
    navigate('/report');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToApp = () => {
    navigate('/civic-dashboard');
  };

  const handleAccessPortal = () => {
    navigate('/access');
  };

  const handleTrackReports = (citizenEmail?: string) => {
    if (citizenEmail) {
      navigate(`/track-reports?email=${encodeURIComponent(citizenEmail)}`);
    } else {
      navigate('/track-reports');
    }
  };

  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage 
              onGetStarted={handleGetStarted} 
              onViewDashboard={handleGoToApp} 
              onAccessPortal={handleAccessPortal}
              onTrackReports={() => handleTrackReports()}
            />
          } 
        />
        
        <Route 
          path="/report" 
          element={
            <ReportForm 
              onBack={handleBackToHome} 
              onSubmit={handleReportSubmit} 
            />
          } 
        />
        
        <Route 
          path="/success" 
          element={
            <SuccessPage 
              onBack={handleBackToHome} 
              reportData={lastSubmittedReport}
              onTrackReports={handleTrackReports}
            />
          } 
        />
        
        <Route 
          path="/track-reports" 
          element={
            <CitizenDashboard 
              requests={requests}
              citizenEmail={new URLSearchParams(window.location.search).get('email') || undefined}
              onBack={handleBackToHome}
            />
          } 
        />
        
        <Route 
          path="/civic-dashboard" 
          element={<DashboardLayout />}
        />
        
        <Route 
          path="/municipal-dashboard" 
          element={<EnhancedDashboardLayout />}
        />
        
        <Route 
          path="/access" 
          element={
            <AccessPortal 
              onBack={handleBackToHome}
            />
          } 
        />
        
        <Route 
          path="/municipal-portal" 
          element={
            <MunicipalPortal 
              userData={JSON.parse(localStorage.getItem('user') || '{}')}
              onBack={handleBackToHome}
            />
          } 
        />
        
        <Route 
          path="/field-dashboard" 
          element={
            <FieldWorkerDashboard 
              userData={JSON.parse(localStorage.getItem('user') || '{}')}
              onBack={handleBackToHome}
            />
          } 
        />
        
        <Route 
          path="/call-center" 
          element={
            <CallCenterDashboard 
              userData={JSON.parse(localStorage.getItem('user') || '{}')}
              onBack={handleBackToHome}
            />
          } 
        />
        
        <Route 
          path="/ward-councillor" 
          element={
            <WardCouncillorDashboard 
              userData={JSON.parse(localStorage.getItem('user') || '{}')}
              onBack={handleBackToHome}
            />
          } 
        />
      </Routes>
      
      <Toaster richColors position="top-right" />
    </>
  );

  function DashboardLayout() {
    const [userData, setUserData] = useState<any>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
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

    const handleSignOut = () => {
      localStorage.removeItem('user');
      navigate('/access');
    };

          return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
        {/* Header - Civic Dashboard */}
        <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Gaianova Local Logo" 
                    className="h-14 w-auto drop-shadow-lg filter brightness-110"
                  />
                  <div className="absolute -inset-1 bg-white/10 rounded-lg blur-sm -z-10"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-white font-bold text-xl tracking-tight">Civic Reports Dashboard</h1>
                  <p className="text-emerald-100 text-sm font-medium tracking-wide">Municipal Management Portal</p>
                </div>
                <div className="block sm:hidden">
                  <h1 className="text-white font-bold text-lg">Dashboard</h1>
                  <p className="text-emerald-100 text-xs">Municipal Portal</p>
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
                        <p className="text-xs text-emerald-100 capitalize text-right font-medium">{userData.type}</p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center ring-2 ring-white/20">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-[100] ring-1 ring-black/5 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="px-5 py-4 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 mb-1">{userData.name}</p>
                          <p className="text-xs text-gray-500 mb-2">{userData.email}</p>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">
                            {userData.type.replace('-', ' ')}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate('/municipal-portal')}
                          className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                        >
                          <Building className="w-4 h-4 group-hover:text-emerald-600" />
                          <span className="font-medium">Municipal Portal</span>
                        </button>
                        
                        {userData.type === 'citizen' && (
                          <button
                            onClick={() => handleTrackReports(userData.email)}
                            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                          >
                            <BarChart3 className="w-4 h-4 group-hover:text-emerald-600" />
                            <span className="font-medium">Track My Reports</span>
                          </button>
                        )}
                        
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
        </header>



        {/* Main Content - Civic Dashboard */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">Civic Reports Management</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Monitor and manage civic issues reported by citizens in your municipality.</p>
            </div>
          </div>
          
          <CivicDashboard 
            requests={requests} 
            onStatusChange={handleStatusChange}
            onDeleteRequest={handleDeleteRequest}
          />
        </main>

        {/* Footer - Civic Theme */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <img 
                  src={logo} 
                  alt="Gaianova Local Logo" 
                  className="h-8 w-auto"
                />
                <span className="font-medium">© 2024 Gaianova Local - Municipal Dashboard</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Empowering communities through civic engagement • South Africa
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  function EnhancedDashboardLayout() {
    const [userData, setUserData] = useState<any>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
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

    const handleSignOut = () => {
      localStorage.removeItem('user');
      navigate('/access');
    };

    // Get user's municipality info
    const userMunicipality = userData?.municipality ? 
      SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === userData.municipality.id) : 
      SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === 'sol-plaatje'); // Default to Sol Plaatje
    
    const municipalityLogo = userData?.municipality?.id ? getMunicipalityLogo(userData.municipality.id) : null;

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
                      {userMunicipality?.name || 'Sol Plaatje Municipality'}
                    </h1>
                    <p className="text-emerald-100 text-sm sm:text-base font-medium">
                      Advanced Municipal Management System
                    </p>
                    <p className="text-emerald-200 text-xs">
                      {userMunicipality?.province || 'Northern Cape Province'} • 
                      {userMunicipality?.id === 'sol-plaatje' ? ' G20 Partnership Municipality' : ' South African Municipality'}
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
                          <p className="text-xs text-emerald-100 capitalize text-right font-medium">{userData.type}</p>
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
                            onClick={() => navigate('/municipal-portal')}
                            className="w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all duration-200 group"
                          >
                            <Building className="w-4 h-4 group-hover:text-emerald-600" />
                            <span className="font-medium">Municipal Portal</span>
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

        {/* Main Content - Enhanced Municipal Dashboard */}
        <main>
          <MunicipalDashboard 
            requests={requests} 
            onStatusChange={handleStatusChange}
            onDeleteRequest={handleDeleteRequest}
            onAssignRequest={handleAssignRequest}
          />
        </main>
      </div>
    );
  }
}

export default App;