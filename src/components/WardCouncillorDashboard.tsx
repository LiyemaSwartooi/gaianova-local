"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Users, AlertTriangle, MapPin, Building, Shield, 
  Phone, Mail, Calendar, Clock, FileText, Camera, Send,
  CheckCircle, XCircle, AlertCircle, BarChart3, Home,
  UserCheck, Vote, Megaphone, Globe, MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface WardCouncillorDashboardProps {
  userData: any
  onBack: () => void
}

interface CommunityIssue {
  id: string
  title: string
  description: string
  category: 'crime' | 'infrastructure' | 'service-delivery' | 'environmental' | 'community-safety' | 'housing'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'investigating' | 'escalated' | 'resolved'
  location: string
  reportedBy: string
  contactInfo: string
  dateReported: string
  images?: string[]
  witnesses?: string[]
  policeCase?: string
  municipalRef?: string
}

interface WardStats {
  totalResidents: number
  activeIssues: number
  resolvedIssues: number
  upcomingMeetings: number
  pendingCases: number
}

export default function WardCouncillorDashboard({ userData, onBack }: WardCouncillorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [issues, setIssues] = useState<CommunityIssue[]>([])
  const [wardStats, setWardStats] = useState<WardStats>({
    totalResidents: 3247,
    activeIssues: 12,
    resolvedIssues: 156,
    upcomingMeetings: 3,
    pendingCases: 8
  })

  // Load sample issues for the ward
  useEffect(() => {
    const sampleIssues: CommunityIssue[] = [
      {
        id: '1',
        title: 'Cable Theft at Community Center',
        description: 'Copper cables were stolen from the community center last night. The building is now without electricity and the security system is down.',
        category: 'crime',
        priority: 'high',
        status: 'investigating',
        location: 'Galeshewe Community Center, Ward 7',
        reportedBy: 'Mrs. Nomsa Mthembu',
        contactInfo: '+27 53 123 4567',
        dateReported: '2024-12-01T08:30:00Z',
        policeCase: 'CAS-202412010201',
        municipalRef: 'SPM-W07-CR001'
      },
      {
        id: '2',
        title: 'Repeated Break-ins in Extension 4',
        description: 'There have been 5 house break-ins in Extension 4 this month. Residents are requesting increased police patrols and better street lighting.',
        category: 'community-safety',
        priority: 'high',
        status: 'escalated',
        location: 'Extension 4, Ward 7',
        reportedBy: 'Community Patrol Group',
        contactInfo: '+27 53 234 5678',
        dateReported: '2024-11-28T14:15:00Z',
        witnesses: ['John Mokwena', 'Sarah Kgosana', 'Peter van der Merwe']
      },
      {
        id: '3',
        title: 'Vandalism at Primary School',
        description: 'School windows broken and graffiti on walls. School property damaged over the weekend. Principal requests security assistance.',
        category: 'crime',
        priority: 'medium',
        status: 'reported',
        location: 'Galeshewe Primary School, Ward 7',
        reportedBy: 'Mr. Thabo Molefe (Principal)',
        contactInfo: '+27 53 345 6789',
        dateReported: '2024-11-30T07:45:00Z'
      },
      {
        id: '4',
        title: 'Illegal Dumping Behind Shopping Center',
        description: 'Large amount of building rubble and household waste dumped illegally. Creating health hazard and attracting pests.',
        category: 'environmental',
        priority: 'medium',
        status: 'escalated',
        location: 'Behind Galeshewe Shopping Center',
        reportedBy: 'Environmental Health Committee',
        contactInfo: '+27 53 456 7890',
        dateReported: '2024-11-25T16:20:00Z',
        municipalRef: 'SPM-W07-EN002'
      }
    ]
    setIssues(sampleIssues)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crime': return 'bg-red-100 text-red-800 border-red-200'
      case 'community-safety': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'infrastructure': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'service-delivery': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'environmental': return 'bg-green-100 text-green-800 border-green-200'
      case 'housing': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'investigating': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'escalated': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'reported': return <XCircle className="w-5 h-5 text-gray-600" />
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const handleNewReport = () => {
    setIsReportModalOpen(true)
  }

  const handleStatusUpdate = (issueId: string, newStatus: CommunityIssue['status']) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    ))
    toast.success('Issue status updated successfully')
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "emerald" }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mb-1`}>{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  )

  const ReportModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'crime' as CommunityIssue['category'],
      priority: 'medium' as CommunityIssue['priority'],
      location: '',
      reportedBy: '',
      contactInfo: '',
      policeCase: '',
      witnesses: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      
      const newIssue: CommunityIssue = {
        id: Date.now().toString(),
        ...formData,
        status: 'reported',
        dateReported: new Date().toISOString(),
        witnesses: formData.witnesses ? formData.witnesses.split(',').map(w => w.trim()) : undefined
      }

      setIssues(prev => [newIssue, ...prev])
      setWardStats(prev => ({ ...prev, activeIssues: prev.activeIssues + 1 }))
      setIsReportModalOpen(false)
      toast.success('Community issue reported successfully')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'crime',
        priority: 'medium',
        location: '',
        reportedBy: '',
        contactInfo: '',
        policeCase: '',
        witnesses: ''
      })
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Report Community Issue</h3>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Brief description of the issue"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CommunityIssue['category'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="crime">Crime & Security</option>
                  <option value="community-safety">Community Safety</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="service-delivery">Service Delivery</option>
                  <option value="environmental">Environmental</option>
                  <option value="housing">Housing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as CommunityIssue['priority'] }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical/Emergency</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Specific location in the ward"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Detailed description of the issue..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reported By</label>
                <input
                  type="text"
                  required
                  value={formData.reportedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportedBy: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Name of person reporting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                <input
                  type="text"
                  required
                  value={formData.contactInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Phone number or email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Police Case Number (if applicable)</label>
                <input
                  type="text"
                  value={formData.policeCase}
                  onChange={(e) => setFormData(prev => ({ ...prev, policeCase: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="CAS-202412010001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Witnesses (comma separated)</label>
                <input
                  type="text"
                  value={formData.witnesses}
                  onChange={(e) => setFormData(prev => ({ ...prev, witnesses: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="John Doe, Jane Smith"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={onBack}
                  className="p-2 text-emerald-100 hover:text-white hover:bg-emerald-600 rounded-lg transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Ward Councillor Dashboard</h1>
                  <p className="text-emerald-100 text-sm sm:text-base">
                    {userData?.name} • Ward 7 • Sol Plaatje Municipality
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNewReport}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Ward Overview', icon: Home },
              { id: 'issues', label: 'Community Issues', icon: AlertTriangle },
              { id: 'residents', label: 'Resident Services', icon: Users },
              { id: 'meetings', label: 'Meetings & Events', icon: Calendar },
              { id: 'reports', label: 'Ward Reports', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Ward Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                icon={Users}
                title="Ward Residents"
                value={wardStats.totalResidents.toLocaleString()}
                subtitle="Registered voters"
                color="blue"
              />
              <StatCard
                icon={AlertTriangle}
                title="Active Issues"
                value={wardStats.activeIssues}
                subtitle="Requiring attention"
                color="orange"
              />
              <StatCard
                icon={CheckCircle}
                title="Resolved Issues"
                value={wardStats.resolvedIssues}
                subtitle="This year"
                color="green"
              />
              <StatCard
                icon={Calendar}
                title="Meetings"
                value={wardStats.upcomingMeetings}
                subtitle="This month"
                color="purple"
              />
              <StatCard
                icon={Shield}
                title="Pending Cases"
                value={wardStats.pendingCases}
                subtitle="Awaiting action"
                color="red"
              />
            </div>

            {/* Recent Issues Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Recent Community Issues
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {issues.slice(0, 3).map((issue) => (
                    <div key={issue.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getStatusIcon(issue.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{issue.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(issue.category)}`}>
                                {issue.category.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                                {issue.priority.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(issue.dateReported).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab('issues')}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    View all issues →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Community Issues</h2>
              <button
                onClick={handleNewReport}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
              >
                <AlertTriangle className="w-4 h-4" />
                Report New Issue
              </button>
            </div>

            <div className="grid gap-6">
              {issues.map((issue) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(issue.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{issue.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <MapPin className="w-4 h-4" />
                          {issue.location}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(issue.dateReported).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Reported by:</span>
                        <p className="text-gray-600">{issue.reportedBy}</p>
                        <p className="text-gray-500">{issue.contactInfo}</p>
                      </div>
                      {issue.policeCase && (
                        <div>
                          <span className="font-medium text-gray-700">Police Case:</span>
                          <p className="text-gray-600 font-mono">{issue.policeCase}</p>
                        </div>
                      )}
                      {issue.municipalRef && (
                        <div>
                          <span className="font-medium text-gray-700">Municipal Ref:</span>
                          <p className="text-gray-600 font-mono">{issue.municipalRef}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(issue.category)}`}>
                          {issue.category.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Status: {issue.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusUpdate(issue.id, e.target.value as CommunityIssue['status'])}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="reported">Reported</option>
                          <option value="investigating">Investigating</option>
                          <option value="escalated">Escalated</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'residents' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Resident Services</h3>
            <p className="text-gray-600">This section will contain resident service requests and community outreach tools.</p>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Meetings & Events</h3>
            <p className="text-gray-600">This section will contain ward committee meetings and community events.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Ward Reports</h3>
            <p className="text-gray-600">This section will contain ward statistics and progress reports.</p>
          </div>
        )}
      </main>

      {/* Report Modal */}
      {isReportModalOpen && <ReportModal />}
    </div>
  )
} 