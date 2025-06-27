import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { User, Building, LogOut, BarChart3 } from 'lucide-react';
import { Toaster } from 'sonner';
import CivicDashboard from './components/CivicDashboard';
import CitizenDashboard from './components/CitizenDashboard';
import LandingPage from './components/LandingPage';
import ReportForm from './components/ReportForm';
import SuccessPage from './components/SuccessPage';
import AccessPortal from './components/AccessPortal';
import { MaintenanceRequest } from './types';
const logo = '/img/Gaianova_logo-removebg-preview.png';

function App() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<any>(null);
  const navigate = useNavigate();

  // Load sample data on component mount
  useEffect(() => {
    const sampleRequests: MaintenanceRequest[] = [
      {
        id: '1',
        title: 'Illegal Dumping Site Behind Shopping Center',
        description: 'Large amounts of household waste and construction debris have been dumped behind Soweto Mall. The pile is growing daily and attracting rats and flies. Urgent cleanup needed.',
        category: 'illegal-dumping',
        priority: 'high',
        status: 'pending',
        location: 'Behind Soweto Mall, Diepkloof',
        ward: 'Ward 10',
        municipality: 'City of Johannesburg',
        reporterName: 'Sarah Mthembu',
        reporterEmail: 'sarah.mthembu@gmail.com',
        reporterPhone: '+27 82 345 6789',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Multiple Broken Streetlights on Main Road',
        description: 'Five consecutive streetlights along Vilakazi Street are not working, making the area very dark and dangerous at night. This has been an issue for over two weeks.',
        category: 'broken-streetlights',
        priority: 'high',
        status: 'in-progress',
        location: 'Vilakazi Street, Orlando West',
        ward: 'Ward 8',
        municipality: 'City of Johannesburg',
        reporterName: 'Michael Ndaba',
        reporterEmail: 'mndaba@webmail.co.za',
        reporterPhone: '+27 83 456 7890',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Major Water Pipe Burst',
        description: 'Large water pipe has burst on Chris Hani Road causing flooding and water wastage. Many residents in the area are without water supply.',
        category: 'water-issues',
        priority: 'emergency',
        status: 'completed',
        location: 'Chris Hani Road, Alexandra',
        ward: 'Ward 109',
        municipality: 'City of Johannesburg',
        reporterName: 'Emma Khumalo',
        reporterEmail: 'emma.khumalo@gmail.com',
        reporterPhone: '+27 84 567 8901',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: 'Sewage Overflow in Residential Area',
        description: 'Raw sewage is overflowing from manholes on Koma Street. The smell is terrible and poses health risks to the community, especially children.',
        category: 'sewage-spills',
        priority: 'emergency',
        status: 'pending',
        location: 'Koma Street, Tembisa',
        ward: 'Ward 7',
        municipality: 'Ekurhuleni Metro',
        reporterName: 'David Sithole',
        reporterEmail: 'dsithole@outlook.com',
        reporterPhone: '+27 85 678 9012',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        title: 'Dangerous Potholes on Taxi Route',
        description: 'Multiple large potholes on the main taxi route are causing damage to vehicles and making travel dangerous. Some holes are over 30cm deep.',
        category: 'potholes',
        priority: 'high',
        status: 'pending',
        location: 'Main Road between Mamelodi and Pretoria CBD',
        ward: 'Ward 87',
        municipality: 'City of Tshwane',
        reporterName: 'Thabo Molekwa',
        reporterEmail: 'thabo.molekwa@yahoo.com',
        reporterPhone: '+27 86 789 0123',
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
          path="/access" 
          element={
            <AccessPortal 
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
                      <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-30 ring-1 ring-black/5 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="px-5 py-4 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900 mb-1">{userData.name}</p>
                          <p className="text-xs text-gray-500 mb-2">{userData.email}</p>
                          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 capitalize">
                            {userData.type.replace('-', ' ')}
                          </div>
                        </div>
                        
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
}

export default App;