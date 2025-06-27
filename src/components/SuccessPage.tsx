import React from 'react';
import { CheckCircle, ArrowLeft, Building, Clock, Mail, Phone, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const logo = '/img/Gaianova_logo-removebg-preview.png'

interface SuccessPageProps {
  onBack: () => void;
  reportData?: any;
  onTrackReports?: (citizenEmail?: string) => void;
}

export default function SuccessPage({ onBack, reportData, onTrackReports }: SuccessPageProps) {
  const navigate = useNavigate();
  const referenceNumber = reportData?.id || 'REF' + Date.now().toString().slice(-6);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base py-2"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={logo} 
                alt="FixNow Logo" 
                className="h-8 sm:h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation - Mobile Optimized */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-orange-600 transition-colors whitespace-nowrap"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-500 whitespace-nowrap">Report Issue</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <span className="text-orange-600 font-medium whitespace-nowrap">Success</span>
          </nav>
        </div>
      </div>

      {/* Success Content - Mobile Optimized */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Report Submitted Successfully!
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-2">
                          Thank you for reporting this civic issue. Your report has been received and will be reviewed by the municipal team.
          </p>

          {/* Reference Number */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              Your Reference Number
            </h3>
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              #{referenceNumber}
            </div>
            <p className="text-sm text-emerald-700">
              Please save this reference number for your records. You can use it to track your request.
            </p>
          </div>

          {/* Report Summary */}
          {reportData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Issue:</span>
                  <p className="text-gray-600">{reportData.title}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <p className="text-gray-600 capitalize">{reportData.category?.replace('-', ' ')}</p>
                </div>
                
                <div>
                                  <span className="font-medium text-gray-700">Municipality:</span>
                <p className="text-gray-600">{reportData.building}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Priority:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    reportData.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                    reportData.priority === 'high' ? 'bg-red-50 text-red-600' :
                    reportData.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {reportData.priority?.charAt(0).toUpperCase() + reportData.priority?.slice(1)}
                  </span>
                </div>
                
                {reportData.room && (
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <p className="text-gray-600">{reportData.room}{reportData.floor && `, ${reportData.floor}`}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              What Happens Next?
            </h3>
            
            <div className="text-left space-y-3 text-sm text-blue-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="font-medium">Acknowledgment</p>
                  <p className="text-blue-600">You'll receive a confirmation email within 15 minutes</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="font-medium">Review & Assignment</p>
                  <p className="text-emerald-600">Our team will review and assign the report to appropriate municipal staff</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="font-medium">Contact & Resolution</p>
                  <p className="text-blue-600">You'll be contacted to schedule repairs and updated on progress</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-700">Email Support</p>
                  <p className="text-gray-600">support@fixnow.co.za</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-700">Phone Support</p>
                  <p className="text-gray-600">+27 (0)11 123 4567</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              For urgent emergencies, please contact municipal emergency services directly or call 107.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
            
            {onTrackReports && (
              <button
                onClick={() => onTrackReports(reportData?.email)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
              >
                <CheckCircle className="w-5 h-5" />
                Track My Reports
              </button>
            )}
            
            <button
              onClick={() => navigate('/report')}
              className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 