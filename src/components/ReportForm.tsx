"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, AlertTriangle, CheckCircle, XCircle, Circle, AlertCircle, Zap, Shield, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, User, LogOut, MapPin, Flag, FileText, Camera, Navigation, Loader2, BarChart3, Building, Clock, Phone, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { motion } from 'framer-motion'
import { SOUTH_AFRICAN_MUNICIPALITIES, MUNICIPAL_ISSUE_CATEGORIES, getMunicipalityById, getWardsByMunicipality } from '../data/municipalities'
import { validateMunicipalScope, generateEnhancedReferenceNumber, assignDepartment, getExpectedResolutionTime } from '../utils/municipalUtils'
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
    .min(1, "Ward number is required"),
  location: z.string()
    .min(1, "Specific location is required")
    .min(5, "Location must be at least 5 characters")
    .max(200, "Location must be less than 200 characters"),
  
  // Step 3: Issue Details
  category: z.string()
    .min(1, "Please select an issue type"),
  subcategory: z.string().optional(),
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
  images: z.array(z.object({
    id: z.string(),
    url: z.string(),
    fileName: z.string(),
    fileSize: z.number()
  })).optional().default([]),
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

  // State for selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [scopeValidation, setScopeValidation] = useState<{ isValid: boolean; message: string } | null>(null)
  const [uploadedImages, setUploadedImages] = useState<Array<{id: string, url: string, fileName: string, fileSize: number}>>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reporterName: userData?.name || "",
      reporterEmail: userData?.email || "",
      reporterPhone: "",
      municipality: userData?.municipality?.name || "Sol Plaatje Local Municipality",
      ward: "",
      location: "",
      category: "",
      subcategory: "",
      priority: "medium",
      title: "",
      description: "",
      photoUrl: "",
      images: [],
    },
  })

  // Ensure municipality value is set when userData changes
  useEffect(() => {
    const municipalityName = userData?.municipality?.name || 'Sol Plaatje Local Municipality'
    form.setValue("municipality", municipalityName)
  }, [userData, form])

  // Dynamic wards based on user's municipality
  const userMunicipalityId = userData?.municipality?.id || 'sol-plaatje' // Default to Sol Plaatje
  const selectedMunicipalityId = userMunicipalityId

  const wards = getWardsByMunicipality(selectedMunicipalityId).map(ward => ({
    number: ward.number,
    name: `Ward ${ward.number} - ${ward.name}`,
    areas: ward.areas
  }))

  // Enhanced issue categories with municipal validation
  const categories = MUNICIPAL_ISSUE_CATEGORIES.map(cat => ({
    id: cat.id,
    name: cat.name,
    subcategories: cat.subcategories,
    department: cat.department,
    expectedResolution: cat.expectedResolution
  }))

  // Smart form validation for steps
  const isStep1Valid = () => {
    const values = form.getValues()
    const hasName = values.reporterName && values.reporterName.trim() !== ''
    const hasEmail = values.reporterEmail && values.reporterEmail.trim() !== ''
    const hasPhone = values.reporterPhone && values.reporterPhone.trim() !== ''
    return hasName && hasEmail && hasPhone
  }

  const isStep2Valid = () => {
    const values = form.getValues()
    const hasWard = values.ward && values.ward.trim() !== ''
    const hasLocation = values.location && values.location.trim() !== ''
    const hasMunicipality = values.municipality && values.municipality.trim() !== ''
    return hasWard && hasLocation && hasMunicipality
  }

  const isStep3Valid = () => {
    const values = form.getValues()
    const hasCategory = values.category && values.category.trim() !== ''
    const hasPriority = values.priority && values.priority.trim() !== ''
    const hasTitle = values.title && values.title.trim() !== ''
    const hasDescription = values.description && values.description.trim() !== ''
    return hasCategory && hasPriority && hasTitle && hasDescription
  }

  // Progress calculation
  const getFormProgress = () => {
    let progress = 0
    if (isStep1Valid()) progress += 33
    if (isStep2Valid()) progress += 33
    if (isStep3Valid()) progress += 34
    return progress
  }

  const nextStep = async () => {
    // Validate current step before proceeding
    let isValid = false
    
    if (currentStep === 1) {
      const result = await form.trigger(['reporterName', 'reporterEmail', 'reporterPhone'])
      isValid = result && isStep1Valid()
      
      if (isValid) {
        toast.success('Personal information saved!', {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          duration: 2000
        })
      }
    } else if (currentStep === 2) {
      // Ensure municipality is set before validation
      const municipalityName = userData?.municipality?.name || 'Sol Plaatje Local Municipality'
      form.setValue("municipality", municipalityName)
      
      const result = await form.trigger(['ward', 'location'])
      const values = form.getValues()
      
      // More detailed validation for step 2
      const hasWard = values.ward && values.ward.trim() !== ''
      const hasLocation = values.location && values.location.trim() !== ''
      const hasMunicipality = values.municipality && values.municipality.trim() !== ''
      
      isValid = result && hasWard && hasLocation && hasMunicipality
      
      // Debug logging (remove in production)
      console.log('Step 2 validation:', {
        ward: values.ward,
        location: values.location,
        municipality: values.municipality,
        hasWard,
        hasLocation,
        hasMunicipality,
        result,
        isValid
      })
      
      if (isValid) {
        toast.success('Location details saved!', {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          duration: 2000
        })
      } else {
        // More specific error messages
        if (!hasWard) {
          toast.error('Please select your ward', {
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
            duration: 3000
          })
        } else if (!hasLocation) {
          toast.error('Please provide the specific location', {
            icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
            duration: 3000
          })
        }
      }
    }
    
    if (isValid && currentStep < 3) {
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

  // Validate municipal scope when category or description changes
  // Image upload handlers
  const handleImageUpload = async (files: FileList | File[]) => {
    setIsUploading(true)
    const fileArray = Array.from(files)
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`, {
          icon: <XCircle className="w-5 h-5 text-red-500" />
        })
        return false
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`, {
          icon: <XCircle className="w-5 h-5 text-red-500" />
        })
        return false
      }
      
      return true
    })

    // Check total images limit
    if (uploadedImages.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed per report', {
        icon: <XCircle className="w-5 h-5 text-red-500" />
      })
      setIsUploading(false)
      return
    }

    try {
      const newImages = await Promise.all(
        validFiles.map(async (file) => {
          // Create preview URL (in real app, you'd upload to a server)
          const url = URL.createObjectURL(file)
          
          return {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            url,
            fileName: file.name,
            fileSize: file.size
          }
        })
      )
      
      setUploadedImages(prev => [...prev, ...newImages])
      form.setValue('images', [...uploadedImages, ...newImages])
      
      toast.success(`${newImages.length} image(s) uploaded successfully!`, {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      })
      
    } catch (error) {
      toast.error('Failed to upload images. Please try again.', {
        icon: <XCircle className="w-5 h-5 text-red-500" />
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (imageId: string) => {
    const updatedImages = uploadedImages.filter(img => img.id !== imageId)
    setUploadedImages(updatedImages)
    form.setValue('images', updatedImages)
    
    toast.success('Image removed', {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const validateScope = (category: string, description: string) => {
    const isValid = validateMunicipalScope(category, description)
    if (!isValid) {
      const municipalityName = userData?.municipality?.name || 'your municipality'
      setScopeValidation({
        isValid: false,
        message: `This issue appears to be outside ${municipalityName}'s scope. Please contact the appropriate authority or rephrase your report if this is a municipal service issue.`
      })
    } else {
      setScopeValidation(null)
    }
    return isValid
  }

  const onSubmitForm = async (formData: ReportFormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Validate municipal scope first
      const isMunicipalScope = validateScope(formData.category, formData.description)
      if (!isMunicipalScope && scopeValidation && !scopeValidation.isValid) {
        throw new Error(scopeValidation.message)
      }

      // Validate form data
      const validatedData = reportSchema.parse(formData)
      
      // Generate enhanced reference number and QR code
      const { referenceNumber, qrCode } = generateEnhancedReferenceNumber(validatedData.category, validatedData.ward)
      
      // Auto-assign department
      const assignedDepartment = assignDepartment(validatedData.category)
      
      // Get expected resolution timeframe
      const estimatedResolution = getExpectedResolutionTime(validatedData.category, validatedData.priority)
      
      // Create enhanced report data
      const reportData = {
        ...validatedData,
        id: Date.now().toString(),
        referenceNumber,
        qrCode,
        assignedDepartment,
        estimatedResolution,
        isValidMunicipalIssue: true,
        communicationLog: [{
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: 'system-update' as const,
          message: `Report submitted successfully. Reference: ${referenceNumber}. Assigned to ${getMunicipalityById(selectedMunicipalityId)?.departments.find(d => d.id === assignedDepartment)?.name || 'Municipal Department'}. Expected resolution: ${estimatedResolution}.`,
          sender: 'System',
          recipient: validatedData.reporterEmail || validatedData.reporterName,
          status: 'sent' as const
        }],
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      }
      
      // Show enhanced success message
      toast.success(`Report submitted successfully! Reference: ${referenceNumber}`, {
        icon: <CheckCircle className="w-5 h-5" />,
        description: `Assigned to ${getMunicipalityById(selectedMunicipalityId)?.departments.find(d => d.id === assignedDepartment)?.name || 'Municipal Department'}. Expected resolution: ${estimatedResolution}.`,
        duration: 6000,
      })

      // Call parent submit handler
      onSubmit(reportData)
      
      // Reset form and clear images
      form.reset()
      setCurrentStep(1)
      setScopeValidation(null)
      setSelectedCategory('')
      setSelectedSubcategory('')
      setUploadedImages([])
      setIsUploading(false)
      setDragActive(false)
      
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
                
                <button
                  onClick={() => navigate('/municipal-portal')}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors"
                >
                  <Building className="w-4 h-4" />
                  Municipal Portal
                </button>
                
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
              
              {/* Enhanced Progress Indicator */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm mx-auto max-w-md sm:max-w-lg backdrop-blur-sm">
                
                {/* Overall Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Form Progress</span>
                    <span className="text-sm font-bold text-emerald-600">{getFormProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${getFormProgress()}%` }}
                    />
                  </div>
                </div>

                {/* Step Indicator Container */}
                <div className="relative flex items-center justify-between mb-4">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      isStep1Valid() 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : currentStep === 1
                        ? 'bg-blue-500 text-white shadow-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isStep1Valid() ? <CheckCircle className="w-5 h-5" /> : '1'}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      isStep2Valid() 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : currentStep === 2
                        ? 'bg-blue-500 text-white shadow-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isStep2Valid() ? <CheckCircle className="w-5 h-5" /> : '2'}
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all shadow-sm ${
                      isStep3Valid() 
                        ? 'bg-emerald-500 text-white shadow-emerald-200' 
                        : currentStep === 3
                        ? 'bg-blue-500 text-white shadow-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isStep3Valid() ? <CheckCircle className="w-5 h-5" /> : '3'}
                    </div>
                  </div>

                  {/* Connecting Lines */}
                  <div className="absolute top-1/2 left-0 right-0 flex items-center justify-between px-5 sm:px-6 -translate-y-1/2">
                    {/* Line 1 to 2 */}
                    <div className={`h-1 rounded-full transition-all duration-500 ${
                      isStep1Valid() ? 'bg-emerald-500' : 'bg-gray-200'
                    }`} style={{width: 'calc(50% - 20px)'}}></div>
                    
                    {/* Line 2 to 3 */}
                    <div className={`h-1 rounded-full transition-all duration-500 ${
                      isStep2Valid() ? 'bg-emerald-500' : 'bg-gray-200'
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
                      
                      <div className="space-y-3 lg:col-span-2">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-emerald-600" />
                            <span className="font-bold text-emerald-800">Municipality</span>
                          </div>
                          <p className="text-emerald-700 font-medium">
                            {userData?.municipality?.name || 'Sol Plaatje Municipality'} ({userData?.municipality?.province || 'Northern Cape'})
                          </p>
                          <p className="text-sm text-emerald-600 mt-1">
                            Based on your account registration
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="ward" className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Ward *
                        </label>
                        <select
                          id="ward"
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg ${
                            form.formState.errors.ward ? "border-red-500 focus:border-red-500" : ""
                          }`}
                          {...form.register("ward")}
                        >
                          <option value="">Select your ward</option>
                          {wards.map(ward => (
                            <option key={ward.number} value={ward.number}>{ward.name}</option>
                          ))}
                        </select>
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
                    
                    <div className="space-y-8">
                      {/* Municipal Service Type Section */}
                      <div className="space-y-4">
                        <label htmlFor="category" className="block text-base sm:text-lg font-bold text-gray-800">
                          Municipal Service Type *
                        </label>
                        <select
                          id="category"
                          className={`w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg ${
                            form.formState.errors.category ? "border-red-500" : ""
                          }`}
                          {...form.register("category")}
                          onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSelectedSubcategory('');
                            form.setValue('category', e.target.value);
                            form.setValue('subcategory', '');
                            
                            // Validate scope when category changes
                            if (e.target.value && form.getValues('description')) {
                              validateScope(e.target.value, form.getValues('description'));
                            }
                          }}
                        >
                          <option value="">Select a municipal service</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name} - {category.expectedResolution}
                            </option>
                          ))}
                        </select>
                        {form.formState.errors.category && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.category.message}</span>
                          </p>
                        )}
                        
                        {/* Show department info when category is selected */}
                        {selectedCategory && (
                          <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                            <p className="text-sm text-emerald-700 font-medium flex items-center gap-2 mb-1">
                              <Building className="w-4 h-4" />
                              Department: {getMunicipalityById(selectedMunicipalityId)?.departments.find(d => d.id === categories.find(c => c.id === selectedCategory)?.department)?.name || 'Municipal Department'}
                            </p>
                            <p className="text-sm text-emerald-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Expected resolution: {categories.find(c => c.id === selectedCategory)?.expectedResolution}
                            </p>
                          </div>
                        )}

                        {/* Subcategory field - only show when main category is selected */}
                        {selectedCategory && (
                          <div className="space-y-3 mt-4">
                            <label htmlFor="subcategory" className="block text-base sm:text-lg font-bold text-gray-800">
                              Specific Issue
                            </label>
                            <select
                              id="subcategory"
                              className="w-full px-4 sm:px-5 py-4 sm:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md font-medium text-gray-800 text-base sm:text-lg"
                              {...form.register("subcategory")}
                              onChange={(e) => setSelectedSubcategory(e.target.value)}
                            >
                              <option value="">Select specific issue (optional)</option>
                              {categories.find(c => c.id === selectedCategory)?.subcategories.map(subcat => (
                                <option key={subcat} value={subcat}>{subcat}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Priority Level Section */}
                      <div className="space-y-4">
                        <label className="block text-base sm:text-lg font-bold text-gray-800">
                          Priority Level *
                        </label>
                        
                        {/* Visual Priority Cards - Mobile 2x2, Desktop spread */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                          {[
                            { 
                              value: 'low', 
                              label: 'Low Priority', 
                              description: 'Can wait a few days',
                              icon: <Circle className="w-5 h-5 sm:w-6 sm:h-6" />,
                              color: 'border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100',
                              selectedColor: 'border-green-500 bg-green-100 ring-2 ring-green-200'
                            },
                            { 
                              value: 'medium', 
                              label: 'Medium Priority', 
                              description: 'Needs attention soon',
                              icon: <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
                              color: 'border-yellow-200 bg-yellow-50 text-yellow-700 hover:border-yellow-300 hover:bg-yellow-100',
                              selectedColor: 'border-yellow-500 bg-yellow-100 ring-2 ring-yellow-200'
                            },
                            { 
                              value: 'high', 
                              label: 'High Priority', 
                              description: 'Urgent, affects many',
                              icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />,
                              color: 'border-orange-200 bg-orange-50 text-orange-700 hover:border-orange-300 hover:bg-orange-100',
                              selectedColor: 'border-orange-500 bg-orange-100 ring-2 ring-orange-200'
                            },
                            { 
                              value: 'emergency', 
                              label: 'Emergency', 
                              description: 'Immediate danger',
                              icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
                              color: 'border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100',
                              selectedColor: 'border-red-500 bg-red-100 ring-2 ring-red-200'
                            }
                          ].map((priority) => (
                            <button
                              key={priority.value}
                              type="button"
                              onClick={() => {
                                form.setValue('priority', priority.value as any)
                                form.trigger('priority')
                              }}
                              className={`p-3 sm:p-5 lg:p-6 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm hover:shadow-md ${
                                form.watch('priority') === priority.value 
                                  ? priority.selectedColor 
                                  : priority.color
                              }`}
                            >
                              <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/80 shadow-sm">
                                  {priority.icon}
                                </div>
                                <div className="space-y-1">
                                  <span className="font-bold text-sm sm:text-base lg:text-lg block leading-tight">{priority.label}</span>
                                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed">{priority.description}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {/* Hidden input for form validation */}
                        <input type="hidden" {...form.register("priority")} />
                        
                        {form.formState.errors.priority && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.priority.message}</span>
                          </p>
                        )}
                      </div>

                      {/* Issue Title Section */}
                      <div className="space-y-4">
                        <label htmlFor="title" className="block text-base sm:text-lg font-bold text-gray-800">
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

                      {/* Issue Description Section */}
                      <div className="space-y-4">
                        <label htmlFor="description" className="block text-base sm:text-lg font-bold text-gray-800">
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
                          onChange={(e) => {
                            // Validate scope when description changes
                            if (selectedCategory && e.target.value) {
                              validateScope(selectedCategory, e.target.value);
                            }
                          }}
                        />
                        {form.formState.errors.description && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{form.formState.errors.description.message}</span>
                          </p>
                        )}
                        
                        {/* Municipal scope validation warning */}
                        {scopeValidation && !scopeValidation.isValid && (
                          <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-yellow-800 mb-1 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Outside Municipal Scope
                                </p>
                                <p className="text-sm text-yellow-700">
                                  {scopeValidation.message}
                                </p>
                                <div className="mt-2 text-xs text-yellow-600">
                                  <p className="flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    For other issues, contact:
                                  </p>
                                  <p>• Provincial services: 0800 123 456</p>
                                  <p>• National services: 0800 789 123</p>
                                  <p>• Emergency services: 10111</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Image Upload Section */}
                      <div className="space-y-4">
                        <label className="block text-base sm:text-lg font-bold text-gray-800 mb-2">
                          Add Photos (Optional)
                        </label>
                        <p className="text-sm text-gray-600 mb-4">
                          Photos help us understand the issue better and speed up resolution. Maximum 5 images, 10MB each.
                        </p>

                        {/* Drag & Drop Upload Area */}
                        <div
                          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                            dragActive 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-gray-300 hover:border-emerald-400 bg-gray-50'
                          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploading}
                          />
                          
                          <div className="text-center">
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                                <p className="text-emerald-600 font-medium">Uploading images...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-3">
                                <Camera className="w-12 h-12 text-gray-400" />
                                <div>
                                  <p className="text-lg font-medium text-gray-700 mb-1">
                                    Drag & drop images here, or <span className="text-emerald-600 underline">click to browse</span>
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Supports JPG, PNG, GIF • Max 10MB per image
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              Uploaded Images ({uploadedImages.length}/5)
                            </h4>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                              {uploadedImages.map((image) => (
                                <div key={image.id} className="relative group">
                                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                                    <img
                                      src={image.url}
                                      alt={image.fileName}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                  </div>
                                  
                                  {/* Remove button */}
                                  <button
                                    type="button"
                                    onClick={() => removeImage(image.id)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                  
                                  {/* File info */}
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-600 truncate" title={image.fileName}>
                                      {image.fileName}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {(image.fileSize / 1024 / 1024).toFixed(1)}MB
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Quick tips */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-700 font-medium mb-1 flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Photo Tips:
                              </p>
                              <ul className="text-xs text-blue-600 space-y-1">
                                <li>• Take photos from multiple angles</li>
                                <li>• Ensure good lighting for clarity</li>
                                <li>• Include landmarks for location context</li>
                                <li>• Capture the full extent of the issue</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-red-800 text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    {/* Report Summary */}
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                      <h4 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Report Summary
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-emerald-700">
                        <p><span className="font-medium">Category:</span> {categories.find(c => c.id === form.watch('category'))?.name || 'Not selected'}</p>
                        <p><span className="font-medium">Priority:</span> {form.watch('priority')?.charAt(0).toUpperCase() + form.watch('priority')?.slice(1) || 'Not selected'}</p>
                        <p><span className="font-medium">Location:</span> {form.watch('location') || 'Not specified'}</p>
                        {uploadedImages.length > 0 && (
                          <p><span className="font-medium">Images:</span> {uploadedImages.length} photo(s) attached</p>
                        )}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="order-2 sm:order-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading || !isStep3Valid()}
                        className={`flex-1 max-w-md bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-emerald-500/20 flex items-center justify-center gap-3 shadow-lg text-lg ${
                          !isStep3Valid() ? 'cursor-not-allowed opacity-50' : 'hover:shadow-xl'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Submitting Report...</span>
                          </>
                        ) : !isStep3Valid() ? (
                          <>
                            <AlertTriangle className="w-5 h-5" />
                            <span>Complete All Fields</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Submit Report</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    {!isStep3Valid() && (
                      <p className="text-sm text-gray-500 text-center mt-3">
                        Please fill in all required fields to submit your report
                      </p>
                    )}
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