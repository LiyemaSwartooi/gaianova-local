import { useEffect, useState, useCallback } from "react"
import { motion } from 'framer-motion';
import { Settings, Wrench, ChevronRight, BarChart, Users, ChevronLeft, Building, Home, UserCog, CheckCircle, AlertTriangle, Clock, Menu, X, Camera, Cloud, HandHeart, Trash2, Lightbulb, Droplets, ShieldAlert, Construction, Globe } from "lucide-react"
const logo = '/img/Gaianova_logo-removebg-preview.png'

interface LandingPageProps {
  onGetStarted: () => void
  onViewDashboard?: () => void
  onAccessPortal: () => void
  onTrackReports?: () => void
}

export default function LandingPage({ onGetStarted, onViewDashboard, onAccessPortal, onTrackReports }: LandingPageProps) {
  // Hero slideshow state
  const heroImages = [
    "/img/image.png",
    "/img/image copy.png", 
    "/img/images.png"
  ]
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Slideshow auto-advance effect
  useEffect(() => {
    let slideInterval: NodeJS.Timeout

    if (isAutoPlaying) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length)
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (slideInterval) clearInterval(slideInterval)
    }
  }, [isAutoPlaying, heroImages.length])

  // Close mobile menu on scroll or outside click
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('header')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      window.addEventListener('scroll', handleScroll)
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Slide navigation functions
  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    setIsAutoPlaying(false) // Pause auto-play when manually navigating

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }, [heroImages.length])

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    setIsAutoPlaying(false) // Pause auto-play when manually navigating

    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }, [heroImages.length])

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
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
      <div className="relative z-10 min-h-screen w-full bg-transparent">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <img 
                  src={logo} 
                  alt="Gaianova Local Logo" 
                  className="h-12 sm:h-16 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
              {/* Desktop Menu */}
              <button
                onClick={handleLearnMore}
                className="hidden sm:block text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
              >
                Learn More
              </button>

              {onTrackReports && (
                <button
                  onClick={onTrackReports}
                  className="hidden sm:block text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-medium"
                >
                  Track Reports
                </button>
              )}

              <button 
                onClick={onAccessPortal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors duration-200 text-xs sm:text-sm shadow-lg"
              >
                Report Issue
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden text-gray-700 hover:text-emerald-600 transition-colors duration-200 p-1"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-lg mt-4 mx-4">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => {
                  handleLearnMore()
                  setIsMobileMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-md transition-colors duration-200"
              >
                Learn More
              </button>
              {onTrackReports && (
                <button
                  onClick={() => {
                    onTrackReports()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-md transition-colors duration-200"
                >
                  Track Reports
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="overflow-x-hidden pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Column - Text Content */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-10">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                <span className="text-emerald-600">GAIANOVA</span>
                <br className="hidden sm:block" />
                <span className="text-emerald-500">LOCAL</span>
              </h1>

              <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                Making sustainability smarter, faster, and actionable starting now. 
                The civic reporting platform for South Africa where anyone can report civic issues and enable municipalities to resolve them efficiently.
              </p>

              <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div className="flex items-start sm:items-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 sm:mt-0">
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm lg:text-base">Snap a photo, auto-tag location, select category</span>
                </div>

                <div className="flex items-start sm:items-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 sm:mt-0">
                    <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-emerald-500" />
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm lg:text-base">Submit directly to municipal cloud dashboard</span>
                </div>

                <div className="flex items-start sm:items-center">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-emerald-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2 sm:mr-3 mt-0.5 sm:mt-0">
                    <HandHeart className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700 text-xs sm:text-sm lg:text-base">Connect citizens with municipalities for faster resolution</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <button 
                  onClick={onAccessPortal} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors duration-200 flex items-center justify-center"
                >
                  Report Issue <ChevronRight className="ml-1 sm:ml-1.5 lg:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                <button
                  onClick={handleLearnMore}
                  className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-sm sm:text-base transition-colors duration-200 flex items-center justify-center"
                >
                  Learn More{" "}
                  <span className="ml-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-600 text-white rounded-full inline-flex items-center justify-center text-xs">
                    i
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column - Image Slideshow */}
            <div className="w-full lg:w-1/2 relative mt-4 sm:mt-8 lg:mt-0">
              <div className="relative transform lg:-rotate-2 hover:lg:rotate-0 transition-transform duration-300">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-orange-100 rounded-[16px] lg:rounded-[40px] blur-xl opacity-70 -z-10"></div>

                {/* Main image container with white border */}
                <div className="relative bg-white rounded-[12px] lg:rounded-[32px] p-1.5 sm:p-2 lg:p-3 shadow-lg overflow-hidden lg:transform lg:skew-y-1">
                  {/* Image slideshow */}
                                      <div className="rounded-[8px] lg:rounded-[24px] overflow-hidden bg-gradient-to-b from-orange-200 to-orange-100 h-[220px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] relative lg:transform lg:-skew-y-1">
                    {/* Slideshow container */}
                    <div className="absolute inset-0 w-full h-full">
                      {heroImages.map((src, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                        >
                          <img
                            src={src}
                            alt={`Civic Community ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Slideshow navigation */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-2 sm:px-3 lg:px-4 z-10">
                      <button
                        onClick={goToPrevSlide}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={goToNextSlide}
                        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                      </button>
                    </div>

                    {/* Slide indicators */}
                    <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center space-x-2">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentSlide(index)
                            setIsAutoPlaying(false)
                            setTimeout(() => setIsAutoPlaying(true), 10000)
                          }}
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${index === currentSlide ? "bg-emerald-600 w-4 sm:w-6" : "bg-white/70"}`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>

                    {/* Badge in bottom right */}
                                          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-white rounded-lg p-1 sm:p-2 shadow-md md:transform md:-skew-x-2 z-10">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Wrench className="w-3 h-3 text-emerald-600" />
                          </div>
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                          </div>
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Building className="w-3 h-3 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What You Can Report</h2>
              <p className="text-lg text-gray-600">A simple platform to report civic issues and track municipal responses</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Illegal Dumping</h3>
                <p className="text-gray-600">Report trash in public spaces, informal dump sites, and unauthorized waste disposal affecting your community.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Broken Streetlights</h3>
                <p className="text-gray-600">
                  Report non-functioning or damaged public lighting that makes areas unsafe, especially at night.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Droplets className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Water Issues</h3>
                <p className="text-gray-600">Report burst pipes, water outages, low pressure, and other water supply problems in your area.</p>
              </div>
            </div>

            {/* Additional Feature Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldAlert className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sewage Spills</h3>
                <p className="text-gray-600">Report blocked or overflowing sewage systems that pose health risks to your community.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Construction className="w-6 h-6 text-yellow-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dangerous Potholes</h3>
                <p className="text-gray-600">Report road hazards, craters, and poor road maintenance that damage vehicles and endanger lives.</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Municipal Dashboard</h3>
                <p className="text-gray-600">Ward councillors and municipal staff get real-time civic issue maps and tracking tools (R2,500-R10,000/month).</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Make Your Community Better?</h2>
            <p className="text-xl text-emerald-100 mb-8">Join South Africans across townships, suburbs, and cities in reporting civic issues for faster resolution</p>
                          <button
                onClick={onAccessPortal}
                className="bg-white text-emerald-600 hover:bg-gray-100 rounded-full px-8 py-3 text-lg font-semibold transition-colors duration-200 inline-flex items-center"
              >
              Report Civic Issue <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src={logo} 
                  alt="Gaianova Local Logo" 
                  className="h-12 w-auto mr-4"
                />
              </div>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Making sustainability smarter, faster, and actionable starting now. 
                Connecting citizens and municipalities for efficient, transparent civic issue resolution across South Africa.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-emerald-400">Quick Access</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={onAccessPortal} className="text-gray-400 hover:text-emerald-400 transition-colors text-left">
                    Citizen Portal
                  </button>
                </li>
                <li>
                  <button onClick={onAccessPortal} className="text-gray-400 hover:text-emerald-400 transition-colors text-left">
                    Municipal Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={handleLearnMore} className="text-gray-400 hover:text-emerald-400 transition-colors text-left">
                    Report Types
                  </button>
                </li>
                <li>
                  <span className="text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer">Support</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-emerald-400">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></span>
                  South Africa
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></span>
                  Civic Reporting Platform
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></span>
                  info@gaianova.co.za
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></span>
                  +27 (0)11 GAIANOVA
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <img 
                  src={logo} 
                  alt="Gaianova Local Logo" 
                  className="h-8 w-auto mr-3"
                />
                <p className="text-gray-400">
                  © 2024 Gaianova Local - Civic Reporting Platform. All rights reserved.
                </p>
              </div>
              <div className="text-gray-400 text-sm">
                Making sustainability smarter, faster, and actionable for South Africa
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </motion.div>
  )
} 