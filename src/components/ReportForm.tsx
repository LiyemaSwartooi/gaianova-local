"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, AlertTriangle, CheckCircle, XCircle, Circle, AlertCircle, Zap, Shield, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, User, LogOut, MapPin, Flag, FileText, Camera, Navigation, Loader2, BarChart3 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion'
const logo = '/img/Gaianova_logo-removebg-preview.png'

const reportSchema = z.object({
  // Step 1: Reporter Information
  reporterName: z.string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  reporterEmail: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),
  reporterPhone: z.string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?27[0-9]{9}$|^0[0-9]{9}$/, "Please enter a valid South African phone number"),
  
  // Step 2: Location (Most Important)
  municipality: z.string()
    .min(1, "Please select your municipality"),
  ward: z.string()
    .min(1, "Ward number is required")
    .regex(/^[0-9]+$/, "Ward must be a number"),
  location: z.string()
    .min(1, "Specific location is required")
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters"),
  
  // Step 3: Issue Details
  category: z.string()
    .min(1, "Please select an issue type"),
  priority: z.enum(["low", "medium", "high", "emergency"], {
    required_error: "Please select a priority level",
  }),
  title: z.string()
    .min(1, "Issue title is required")
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  description: z.string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  photoUrl: z.string().optional(),
})

type ReportFormData = z.infer<typeof reportSchema>

interface ReportFormProps {
  onBack: () => void;
  onSubmit: (reportData: any) => void;
}

// Priority level icons
const priorityIcons = {
  low: <Circle className="w-4 h-4 text-green-500" />,
  medium: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  high: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  emergency: <Zap className="w-4 h-4 text-red-500" />
}

export default function ReportForm({ onBack, onSubmit }: ReportFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Get user data from localStorage
  const [userData, setUserData] = useState<any>(null)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isProfileMenuOpen && !target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProfileMenuOpen])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    toast.success('Signed out successfully!', {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      duration: 2000,
    })
    
    setTimeout(() => {
      navigate('/access')
    }, 1000)
  }

  // South African Municipalities (Major ones)
  const municipalities = [
    'City of Cape Town',
    'City of Johannesburg', 
    'City of Tshwane (Pretoria)',
    'eThekwini Municipality (Durban)',
    'Ekurhuleni Metropolitan Municipality',
    'Nelson Mandela Bay Municipality (Port Elizabeth)',
    'Buffalo City Metropolitan Municipality (East London)',
    'Mangaung Metropolitan Municipality (Bloemfontein)',
    'Polokwane Local Municipality',
    'Steve Tshwete Local Municipality',
    'Sol Plaatje Local Municipality',
    'Matjhabeng Local Municipality'
  ]

  // Civic Issue Categories
  const categories = [
    'Illegal Dumping',
    'Potholes & Road Damage',
    'Broken Streetlights',
    'Water Issues',
    'Sewage Problems',
    'Waste Collection',
    'Traffic Lights',
    'Public Safety',
    'Parks & Recreation',
    'Graffiti & Vandalism',
    'Stormwater Drainage',
    'Other Civic Issues'
  ]

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
      municipality: "",
      ward: "",
      location: "",
      category: "",
      priority: "medium",
      title: "",
      description: "",
      photoUrl: "",
    },
  })

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      })

      const { latitude, longitude } = position.coords

      // Use reverse geocoding to get address (using a free service)
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        
        if (response.ok) {
          const data = await response.json()
          const address = `${data.locality || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`.replace(/^,\s*|,\s*$/g, '')
          
          // Set the location in the form
          form.setValue("location", address || `${latitude}, ${longitude}`)
          
          toast.success("Location detected successfully!", {
            icon: <Navigation className="w-5 h-5 text-green-500" />,
            duration: 3000,
          })
        } else {
          // Fallback to coordinates if reverse geocoding fails
          form.setValue("location", `${latitude}, ${longitude}`)
          toast.success("Location coordinates detected!", {
            icon: <Navigation className="w-5 h-5 text-green-500" />,
            duration: 3000,
          })
        }
      } catch (geocodeError) {
        // Fallback to coordinates if reverse geocoding fails
        form.setValue("location", `${latitude}, ${longitude}`)
        toast.success("Location coordinates detected!", {
          icon: <Navigation className="w-5 h-5 text-green-500" />,
          duration: 3000,
        })
      }

    } catch (error: any) {
      let errorMessage = "Unable to get your location"
      
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location permissions."
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please check your GPS."
      } else if (error.code === 3) {
        errorMessage = "Location request timeout. Please try again."
      }
      
      toast.error(errorMessage, {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        duration: 5000,
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  const onSubmitForm = async (formData: ReportFormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Validate form data
      const validatedData = reportSchema.parse(formData)
      
      // Create report data
      const reportData = {
        ...validatedData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      }
      
      // Show success message
      toast.success("Civic report submitted successfully! Your municipality will respond soon.", {
        icon: <CheckCircle className="w-5 h-5" />,
        description: "Municipal staff will review your report within 48 hours.",
        duration: 4000,
      })

      // Call parent submit handler
      onSubmit(reportData)
      
      // Reset form
      form.reset()
      setCurrentStep(1)
      
    } catch (error: any) {
      console.error("Report submission error:", error)
      
      let errorMessage = error.message || "An error occurred while submitting your report. Please try again."
      
      if (error.name === "ZodError") {
        errorMessage = "Please check all required fields and try again."
      }
      
      toast.error(errorMessage, {
        icon: <XCircle className="w-5 h-5" />,
        description: "Please review the form and try again.",
        duration: 5000,
      })
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full relative overflow-hidden"
    >
      {/* Animated Background with Emerald Theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-emerald-200/30 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-blue-200/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[500px] lg:h-[500px] bg-purple-200/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Decorative Grid Pattern - More subtle on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:12px_12px] sm:bg-[size:16px_16px] md:bg-[size:20px_20px] lg:bg-[size:24px_24px]" />
      </div>

      {/* User Profile - Full Mobile Optimized */}
      {userData && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 profile-menu">
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 shadow-sm border border-gray-200/50 hover:bg-white/90 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-800 text-right leading-tight">{userData.name}</p>
                <p className="text-xs text-gray-600 capitalize text-right leading-tight">{userData.type}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {/* Dropdown Menu - Mobile Optimized */}
            {isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 py-2 z-30">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userData.name}</p>
                  <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  <p className="text-xs text-emerald-600 capitalize font-medium mt-1">{userData.type}</p>
                </div>
                
                {userData.type === 'citizen' && (
                  <button
                    onClick={() => {
                      if (userData.email) {
                        window.location.href = `/track-reports?email=${encodeURIComponent(userData.email)}`;
                      } else {
                        window.location.href = '/track-reports';
                      }
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Track My Reports
                  </button>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="py-6 sm:py-8 lg:py-12">
            {/* Header - Mobile Optimized */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <img 
                src={logo} 
                alt="Gaianova Local Logo" 
                className="h-12 sm:h-16 lg:h-20 w-auto mx-auto mb-4 sm:mb-6 drop-shadow-lg"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
                Report a Civic Issue
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
                Help improve your community by reporting civic issues to your municipality. Quick, simple, effective.
              </p>
              
              {/* Step Progress Indicator - Fixed Flow */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm mx-auto max-w-md sm:max-w-lg backdrop-blur-sm">
                {/* Progress Bar Container */}
                <div className="relative flex items-center justify-between mb-4">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      currentStep >= 1 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      currentStep >= 2 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      currentStep >= 3 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      3
                    </div>
                  </div>

                  {/* Connecting Lines */}
                  <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between px-5 sm:px-6 -translate-y-1/2">
                    {/* Line 1 to 2 */}
                    <div className={`h-1 rounded-full transition-all duration-300 ${
                      currentStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} style={{width: 'calc(50% - 20px)'}}></div>
                    
                    {/* Line 2 to 3 */}
                    <div className={`h-1 rounded-full transition-all duration-300 ${
                      currentStep >= 3 ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} style={{width: 'calc(50% - 20px)'}}></div>
                  </div>
                </div>

                {/* Step Labels */}
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 font-medium px-1">
                  <span className="text-center w-20">Reporter<br className="sm:hidden" /><span className="hidden sm:inline"> Info</span></span>
                  <span className="text-center w-20">Location</span>
                  <span className="text-center w-20">Issue<br className="sm:hidden" /><span className="hidden sm:inline"> Details</span></span>
                </div>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 sm:space-y-8">
              {/* Step 1: Reporter Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                >
                  <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Your Information</h3>
                    </div>
                    
                                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                       <div className="space-y-3">
                         <label htmlFor="reporterName" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                           Full Name *
                        </label>
                        <input
                           id="reporterName"
                          type="text"
                          placeholder="Enter your full name"
                           className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                             form.formState.errors.reporterName ? "border-red-500 focus:border-red-500" : ""
                           }`}
                           {...form.register("reporterName")}
                         />
                         {form.formState.errors.reporterName && (
                           <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                             <span>{form.formState.errors.reporterName.message}</span>
                          </p>
                        )}
                      </div>

                                             <div className="space-y-3">
                         <label htmlFor="reporterEmail" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Email Address *
                        </label>
                        <input
                           id="reporterEmail"
                          type="email"
                          placeholder="your.email@example.com"
                           className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                             form.formState.errors.reporterEmail ? "border-red-500 focus:border-red-500" : ""
                           }`}
                           {...form.register("reporterEmail")}
                         />
                         {form.formState.errors.reporterEmail && (
                           <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                             <span>{form.formState.errors.reporterEmail.message}</span>
                           </p>
                         )}
                       </div>

                       <div className="space-y-3 lg:col-span-2">
                         <label htmlFor="reporterPhone" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                           Phone Number *
                         </label>
                         <input
                           id="reporterPhone"
                           type="tel"
                           placeholder="e.g., +27123456789 or 0123456789"
                           className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                             form.formState.errors.reporterPhone ? "border-red-500 focus:border-red-500" : ""
                           }`}
                           {...form.register("reporterPhone")}
                         />
                         {form.formState.errors.reporterPhone && (
                           <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                             <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                             <span>{form.formState.errors.reporterPhone.message}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 sm:py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        Next: Location
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                >
                  <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Location Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                      <div className="space-y-3">
                        <label htmlFor="municipality" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Municipality *
                        </label>
                        <select
                          id="municipality"
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg ${
                            form.formState.errors.municipality ? "border-red-500" : ""
                          }`}
                          {...form.register("municipality")}
                        >
                          <option value="">Select your municipality</option>
                          {municipalities.map(municipality => (
                            <option key={municipality} value={municipality}>{municipality}</option>
                          ))}
                        </select>
                        {form.formState.errors.municipality && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.municipality.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="ward" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Ward *
                        </label>
                        <input
                          id="ward"
                          type="text"
                          placeholder="Enter your ward number"
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                            form.formState.errors.ward ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          {...form.register("ward")}
                        />
                        {form.formState.errors.ward && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.ward.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 lg:col-span-2">
                        <label htmlFor="location" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Specific Location *
                        </label>
                        <div className="relative">
                        <input
                          id="location"
                          type="text"
                            placeholder="e.g., Corner of Main St & Oak Ave, Behind Shoprite Mall, 123 Church Street"
                            className={`w-full px-4 sm:px-5 py-4 sm:py-5 pr-32 sm:pr-36 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                            form.formState.errors.location ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          {...form.register("location")}
                        />
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-2 sm:px-4 sm:py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                          >
                            {isGettingLocation ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span className="hidden sm:inline">Getting...</span>
                              </>
                            ) : (
                              <>
                                <Navigation className="w-3 h-3" />
                                <span className="hidden sm:inline">Get Location</span>
                                <span className="sm:hidden">GPS</span>
                              </>
                            )}
                          </button>
                        </div>
                        {form.formState.errors.location && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.location.message}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>Click "Get Location" to automatically detect your current location</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        Next: Issue Details
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Issue Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
                >
                  <div className="px-5 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Issue Details</h3>
                    </div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                        <div className="space-y-3">
                          <label htmlFor="category" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Issue Type *
                        </label>
                        <select
                          id="category"
                            className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg ${
                            form.formState.errors.category ? "border-red-500" : ""
                          }`}
                          {...form.register("category")}
                        >
                            <option value="">Select an issue type</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                        {form.formState.errors.category && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span>{form.formState.errors.category.message}</span>
                          </p>
                        )}
                      </div>

                        <div className="space-y-3">
                          <label htmlFor="priority" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                            Priority Level *
                        </label>
                        <div className="relative">
                          <select
                            id="priority"
                              className={`w-full px-4 sm:px-5 py-4 sm:py-5 pr-12 sm:pr-16 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg ${
                              form.formState.errors.priority ? "border-red-500" : ""
                            }`}
                            {...form.register("priority")}
                          >
                              <option value="low">Low - Can wait a few days</option>
                              <option value="medium">Medium - Needs attention soon</option>
                              <option value="high">High - Urgent, affects many people</option>
                              <option value="emergency">Emergency - Immediate danger</option>
                          </select>
                          {form.watch("priority") && (
                              <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              {priorityIcons[form.watch("priority") as keyof typeof priorityIcons]}
                            </div>
                          )}
                        </div>
                        {form.formState.errors.priority && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span>{form.formState.errors.priority.message}</span>
                          </p>
                        )}
                      </div>
                    </div>

                      <div className="space-y-3">
                        <label htmlFor="title" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Issue Title *
                        </label>
                        <input
                          id="title"
                          type="text"
                          placeholder="Brief description of the issue"
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg placeholder:text-gray-400 ${
                            form.formState.errors.title ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.title.message}</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="description" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Detailed Description *
                        </label>
                        <textarea
                          id="description"
                          rows={5}
                          placeholder="Please provide detailed information about the issue, when it started, how often it occurs, and any other relevant details..."
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 resize-none text-base sm:text-lg placeholder:text-gray-400 leading-relaxed ${
                            form.formState.errors.description ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          {...form.register("description")}
                        />
                        {form.formState.errors.description && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.description.message}</span>
                          </p>
                        )}
                      </div>
              </div>

              {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                </div>
              )}

                    <div className="flex gap-3 sm:gap-4 justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                      </button>

                <button
                  type="submit"
                  disabled={isLoading}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-emerald-500/20 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                            <Send className="w-5 h-5" />
                            <span>Submit Report</span>
                    </>
                  )}
                </button>
                    </div>
              </div>
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 