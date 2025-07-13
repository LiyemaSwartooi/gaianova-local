"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from 'framer-motion'
import { ArrowLeft, Building, Users, BarChart3, Eye, EyeOff, PartyPopper, XCircle, CheckCircle, AlertCircle, Home, Phone, Settings, UserCog, Truck, Shield } from "lucide-react"
import { toast } from "sonner"
import { SOUTH_AFRICAN_MUNICIPALITIES } from '../data/municipalities'
const logo = '/img/Gaianova_logo-removebg-preview.png'

const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  userType: z.enum(["citizen", "municipal-staff", "ward-councillor", "department-head", "fleet-manager", "call-center-agent"], {
    required_error: "Please select your role",
  }),
})

const signUpSchema = z.object({
  firstName: z.string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens and apostrophes"),
  lastName: z.string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens and apostrophes"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters")
    .toLowerCase(),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain at least one letter and one number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  userType: z.enum(["citizen", "municipal-staff", "ward-councillor", "department-head", "fleet-manager", "call-center-agent"], {
    required_error: "Please select your role",
  }),
  municipality: z.string()
    .min(1, "Please select your municipality"),
  ward: z.string().optional(),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Please enter a valid phone number"),
  startDate: z.string()
    .min(1, "Start date is required"),
  department: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.userType === "citizen" && !data.ward) {
    return false;
  }
  return true;
}, {
  message: "Ward number is required for citizens",
  path: ["ward"],
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

interface AccessPortalProps {
  onBack: () => void
}

export default function AccessPortal({ onBack }: AccessPortalProps) {
  const [activeTab, setActiveTab] = useState("signin")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  // Clean up old localStorage data with invalid enum values
  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.type === 'resident' || userData.type === 'manager' || userData.type === 'technician' || userData.type === 'maintenance-staff' || userData.type === 'security' || userData.type === 'cleaning-staff') {
          // Clear invalid user data
          localStorage.removeItem('user')
        }
      } catch (e) {
        // If JSON parsing fails, clear the data
        localStorage.removeItem('user')
      }
    }
  }, [])

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "citizen",
    },
  })

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "citizen",
      municipality: "",
      ward: "",
      phoneNumber: "",
      startDate: "",
      department: "",
    },
  })

  const onSignIn = async (formData: SignInForm) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call - in real app, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Basic validation - for now, allow any user to sign in
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password")
      }
      
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Create user based on their selection
      const userName = formData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      
      const userData = {
        email: formData.email,
        name: userName,
        type: formData.userType,
        municipality: {
          id: 'sol-plaatje',
          name: 'Sol Plaatje Local Municipality',
          province: 'Northern Cape'
        }
      }
      
      localStorage.setItem('user', JSON.stringify(userData))

      toast.success(`Welcome back, ${userName}! Signing you in...`, {
        icon: <PartyPopper className="w-5 h-5 text-green-500" />,
        duration: 3000,
      })

      // Smart routing based on user role
      setTimeout(() => {
        switch (formData.userType) {
          case "department-head":
          case "fleet-manager":
            // Management level - Municipal Dashboard
            navigate("/municipal-dashboard", { state: { userData } });
            break;
          case "ward-councillor":
            // Ward Councillors - Specialized Ward Dashboard
            navigate("/ward-councillor", { state: { userData } });
            break;
          case "call-center-agent":
            // Call center staff - Call Center Dashboard
            navigate("/call-center", { state: { userData } });
            break;
          case "municipal-staff":
            // Ground workers - Field Worker Dashboard
            navigate("/field-dashboard", { state: { userData } });
            break;
          case "citizen":
          default:
            // Citizens - Public reporting portal
            navigate("/report");
            break;
        }
      }, 1500)
    } catch (error: any) {
      console.error("Sign in error:", error)
      
      let errorMessage = error.message
      
      toast.error(errorMessage, {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        duration: 5000,
      })
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUp = async (formData: SignUpForm) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock validation - check if email already exists
      const existingEmails = ["citizen@example.com", "admin@example.com"]
      if (existingEmails.includes(formData.email)) {
        throw new Error('This email is already registered. Please sign in instead.')
      }



      // Find selected municipality
      const selectedMunicipality = SOUTH_AFRICAN_MUNICIPALITIES.find(
        municipality => municipality.id === formData.municipality
      )

      // Store user data
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        type: formData.userType,
        municipality: {
          id: formData.municipality,
          name: selectedMunicipality?.name || formData.municipality,
          province: selectedMunicipality?.province
        },
        ward: formData.ward
      }))

      toast.success(`Welcome to Gaianova Local, ${formData.firstName}! Your account has been created successfully!`, {
        icon: <PartyPopper className="w-5 h-5 text-green-500" />,
        duration: 4000,
      })

      // Redirect based on user type
      setTimeout(() => {
        if (formData.userType === 'municipal-staff' || formData.userType === 'ward-councillor' || formData.userType === 'department-head' || formData.userType === 'fleet-manager' || formData.userType === 'call-center-agent') {
          // Municipal staff routes
          switch (formData.userType) {
            case "department-head":
            case "fleet-manager":
              navigate('/municipal-dashboard');
              break;
            case "ward-councillor":
              navigate('/ward-councillor');
              break;
            case "call-center-agent":
              navigate('/call-center');
              break;
            case "municipal-staff":
              navigate('/field-dashboard');
              break;
            default:
              navigate('/municipal-dashboard');
              break;
          }
        } else {
          navigate('/report')
        }
      }, 1500)
      
    } catch (error: any) {
      console.error('Signup error:', error)
      
      let errorMessage = error.message || 'An error occurred during sign up. Please try again.'
      
      setError(errorMessage)
      toast.error(errorMessage, {
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-x-hidden min-h-screen"
    >
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-emerald-200/30 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[500px] lg:h-[500px] bg-blue-200/30 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[500px] lg:h-[500px] bg-purple-200/30 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Decorative Grid Pattern - Responsive */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] md:bg-[size:20px_20px] lg:bg-[size:24px_24px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">


        {/* Main Content */}
        <div className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Left Column - Mobile Optimized */}
            <div className="w-full lg:w-1/2 lg:pr-8 mb-4 lg:mb-0">
              <div className="lg:sticky lg:top-20">
                <div className="mb-4 sm:mb-8">
                  <div className="mb-2 sm:mb-4">
                    <img 
                      src={logo} 
                      alt="Gaianova Local Logo" 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    />
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-3">Welcome to Gaianova Local</h1>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Access your civic reporting dashboard to report issues and track municipal responses across South Africa.
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex items-start shadow-sm">
                    <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                      <Building className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Report Civic Issues</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Report illegal dumping, potholes, and other civic problems</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex items-start shadow-sm">
                    <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                      <Users className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Municipal Dashboard</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Track reports and coordinate with ward councillors</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex items-start shadow-sm">
                    <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-4 flex-shrink-0">
                      <BarChart3 className="h-3 w-3 sm:h-5 sm:w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Real-time Tracking</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">Monitor civic issue resolution and community impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Access Portal - Mobile Optimized */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-6 rounded-lg shadow-sm">
                <div className="text-center mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-bold">Civic Access Portal</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Sign in to your account or create a new one</p>
                </div>

                {/* Tabs - Mobile Optimized */}
                <div className="flex mb-3 sm:mb-6 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("signin")}
                    className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === "signin" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`flex-1 py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === "signup" 
                        ? "bg-white text-emerald-600 shadow-sm" 
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Sign In Tab */}
                {activeTab === "signin" && (
                  <div className="space-y-3 sm:space-y-4">
                    <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-3 sm:space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                                                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          signInForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                          {...signInForm.register("email")}
                        />
                        {signInForm.formState.errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {signInForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="userType" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          I am a
                        </label>
                        <select
                          value={signInForm.watch("userType")}
                          onChange={(e) => signInForm.setValue("userType", e.target.value as any)}
                                                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          signInForm.formState.errors.userType ? "border-red-500" : "border-gray-300"
                        }`}
                        >
                          <option value="citizen">Citizen - Report issues & track status</option>
                          <option value="call-center-agent">Call Center Agent - Manage reports & calls</option>
                          <option value="municipal-staff">Municipal Staff - Field worker & technician</option>
                          <option value="ward-councillor">Ward Councillor - Community leader & advocate</option>
                          <option value="department-head">Department Head - Municipal management</option>
                          <option value="fleet-manager">Fleet Manager - Municipal management</option>
                        </select>
                        {signInForm.formState.errors.userType && (
                          <p className="text-red-500 text-xs mt-1">
                            {signInForm.formState.errors.userType.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showSignInPassword ? "text" : "password"}
                            placeholder="••••••••"
                                                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            signInForm.formState.errors.password ? "border-red-500" : "border-gray-300"
                          }`}
                            {...signInForm.register("password")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                          >
                            {showSignInPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {signInForm.formState.errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {signInForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="flex">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("signup")}
                          className="text-emerald-600 hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Sign Up Tab */}
                {activeTab === "signup" && (
                  <div className="space-y-4">
                    <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                      <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                          I am a
                        </label>
                        <select
                          value={signUpForm.watch("userType")}
                          onChange={(e) => signUpForm.setValue("userType", e.target.value as any)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            signUpForm.formState.errors.userType ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="citizen">Citizen - Report issues & track status</option>
                          <option value="call-center-agent">Call Center Agent - Manage reports & calls</option>
                          <option value="municipal-staff">Municipal Staff - Field worker & technician</option>
                          <option value="ward-councillor">Ward Councillor - Community leader & advocate</option>
                          <option value="department-head">Department Head - Municipal management</option>
                          <option value="fleet-manager">Fleet Manager - Municipal management</option>
                        </select>
                        {signUpForm.formState.errors.userType && (
                          <p className="text-red-500 text-xs mt-1">
                            {signUpForm.formState.errors.userType.message}
                          </p>
                        )}

                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            id="firstName"
                            placeholder="Enter your first name"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              signUpForm.formState.errors.firstName ? "border-red-500" : "border-gray-300"
                            }`}
                            {...signUpForm.register("firstName")}
                          />
                          {signUpForm.formState.errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">
                              {signUpForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            id="lastName"
                            placeholder="Enter your last name"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              signUpForm.formState.errors.lastName ? "border-red-500" : "border-gray-300"
                            }`}
                            {...signUpForm.register("lastName")}
                          />
                          {signUpForm.formState.errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">
                              {signUpForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            signUpForm.formState.errors.email ? "border-red-500" : "border-gray-300"
                          }`}
                          {...signUpForm.register("email")}
                        />
                        {signUpForm.formState.errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {signUpForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
                          Municipality
                        </label>
                        <select
                          id="municipality"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                            signUpForm.formState.errors.municipality ? "border-red-500" : "border-gray-300"
                          }`}
                          {...signUpForm.register("municipality")}
                        >
                          <option value="">Select your municipality</option>
                          {SOUTH_AFRICAN_MUNICIPALITIES.map(municipality => (
                            <option key={municipality.id} value={municipality.id}>
                              {municipality.name} ({municipality.province})
                            </option>
                          ))}
                        </select>
                        {signUpForm.formState.errors.municipality && (
                          <p className="text-red-500 text-xs mt-1">
                            {signUpForm.formState.errors.municipality.message}
                          </p>
                        )}
                      </div>

                      {signUpForm.watch("userType") === "citizen" && (
                        <div>
                          <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                            Ward Number
                          </label>
                          <input
                            id="ward"
                            placeholder="e.g., Ward 10, Ward 87, etc."
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              signUpForm.formState.errors.ward ? "border-red-500" : "border-gray-300"
                            }`}
                            {...signUpForm.register("ward")}
                          />
                          {signUpForm.formState.errors.ward && (
                            <p className="text-red-500 text-xs mt-1">
                              {signUpForm.formState.errors.ward.message}
                            </p>
                          )}
                        </div>
                      )}

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showSignUpPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              signUpForm.formState.errors.password ? "border-red-500" : "border-gray-300"
                            }`}
                            {...signUpForm.register("password")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          >
                            {showSignUpPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {signUpForm.formState.errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {signUpForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                              signUpForm.formState.errors.confirmPassword ? "border-red-500" : "border-gray-300"
                            }`}
                            {...signUpForm.register("confirmPassword")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            )}
                          </button>
                        </div>
                        {signUpForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {signUpForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="flex">
                            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("signin")}
                          className="text-emerald-600 hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t mt-8 py-4 px-4 sm:px-6 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-2 sm:gap-4">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                © 2024 Gaianova Local - Civic Reporting Platform. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
                <button className="text-xs sm:text-sm text-gray-600 hover:text-emerald-600 whitespace-nowrap">
                  Privacy Policy
                </button>
                <button className="text-xs sm:text-sm text-gray-600 hover:text-emerald-600 whitespace-nowrap">
                  Terms of Service
                </button>
                <button className="text-xs sm:text-sm text-gray-600 hover:text-emerald-600 whitespace-nowrap">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  )
} 