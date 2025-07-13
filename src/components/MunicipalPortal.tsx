import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Home, 
  FileText, 
  Users, 
  CreditCard, 
  Building, 
  Scale, 
  Map, 
  Globe, 
  BookOpen,
  Calendar,
  Share2,
  ExternalLink,
  Download,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Megaphone,
  Zap,
  Droplets,
  Trash2,
  CarIcon as Car,
  Shield,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Eye,
  Heart,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Menu,
  X,
  ArrowLeft,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';
import { SOUTH_AFRICAN_MUNICIPALITIES } from '../data/municipalities';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  type: 'news' | 'event' | 'notice' | 'tender' | 'council-meeting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishDate: string;
  department: string;
  author: string;
  tags: string[];
  attachments?: { name: string; url: string; type: string }[];
  location?: string;
  eventDate?: string;
  deadline?: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
}

interface MunicipalPortalProps {
  userData: any;
  onBack: () => void;
}

const MunicipalPortal: React.FC<MunicipalPortalProps> = ({ userData, onBack }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [notifications, setNotifications] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Get user's municipality
  const userMunicipality = userData?.municipality ? 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === userData.municipality.id) : 
    SOUTH_AFRICAN_MUNICIPALITIES.find(m => m.id === 'sol-plaatje');

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Collapse sidebar on mobile by default
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-profile-dropdown]')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock news data - in real app, this would come from API
  useEffect(() => {
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: `${userMunicipality?.name} - SDBIP 2025-2026`,
        content: 'The Service Delivery and Budget Implementation Plan for the 2025-2026 financial year has been approved by council. This comprehensive plan outlines our commitment to improving service delivery across all municipal departments.',
        excerpt: 'SDBIP 2025-2026 approved by council with focus on improved service delivery.',
        type: 'notice',
        priority: 'high',
        publishDate: '2025-01-01',
        department: 'Municipal Manager',
        author: 'Municipal Manager',
        tags: ['SDBIP', 'Budget', 'Planning', '2025-2026'],
        views: 1250,
        likes: 89,
        comments: 23,
        featured: true
      },
      {
        id: '2',
        title: 'Water Shutdown Notice - Scheduled Maintenance',
        content: 'Planned water supply interruption for routine maintenance of water treatment facilities. Affected areas include Wards 5, 12, and 18. Water tankers will be available at designated points.',
        excerpt: 'Scheduled water maintenance affecting Wards 5, 12, and 18.',
        type: 'notice',
        priority: 'urgent',
        publishDate: '2025-01-08',
        department: 'Infrastructure and Services',
        author: 'Water Services Manager',
        tags: ['Water', 'Maintenance', 'Service Interruption'],
        eventDate: '2025-01-15',
        deadline: '2025-01-15',
        views: 892,
        likes: 45,
        comments: 67,
        featured: true
      },
      {
        id: '3',
        title: 'Community Development Workshop Series',
        content: 'Join us for a series of community development workshops focusing on local economic development, skills training, and entrepreneurship opportunities. Open to all residents.',
        excerpt: 'Community workshops on economic development and skills training.',
        type: 'event',
        priority: 'medium',
        publishDate: '2025-01-05',
        department: 'Community and Social Development Services',
        author: 'Community Development Officer',
        tags: ['Community', 'Development', 'Skills', 'Workshop'],
        location: 'Community Hall, Main Road',
        eventDate: '2025-01-20',
        views: 567,
        likes: 78,
        comments: 34,
        featured: false
      },
      {
        id: '4',
        title: 'Tender Invitation - Road Maintenance Project',
        content: 'Invitation to tender for road maintenance and pothole repair services. Preference will be given to local SMMEs and B-BBEE compliant companies.',
        excerpt: 'Road maintenance tender opportunity for local businesses.',
        type: 'tender',
        priority: 'medium',
        publishDate: '2025-01-03',
        department: 'Infrastructure and Services',
        author: 'SCM Manager',
        tags: ['Tender', 'Roads', 'Maintenance', 'SMME'],
        deadline: '2025-01-25',
        attachments: [
          { name: 'Tender Document.pdf', url: '#', type: 'pdf' },
          { name: 'Technical Specifications.pdf', url: '#', type: 'pdf' }
        ],
        views: 334,
        likes: 12,
        comments: 8,
        featured: false
      },
      {
        id: '5',
        title: 'Ordinary Council Meeting',
        content: 'Regular monthly council meeting to discuss municipal matters, budget items, and community concerns. Public attendance welcome.',
        excerpt: 'Monthly council meeting open to public attendance.',
        type: 'council-meeting',
        priority: 'medium',
        publishDate: '2025-01-02',
        department: 'Municipal Manager',
        author: 'Council Secretary',
        tags: ['Council', 'Meeting', 'Public Participation'],
        location: 'Council Chambers',
        eventDate: '2025-01-24',
        views: 445,
        likes: 23,
        comments: 15,
        featured: false
      }
    ];
    
    setNotifications(mockNews);
    setUnreadCount(mockNews.filter(item => item.priority === 'urgent' || item.featured).length);
  }, [userMunicipality]);

  // Municipal services menu structure
  const municipalServices = [
    {
      id: 'regulatory-reporting',
      label: 'Regulatory Reporting',
      icon: FileText,
      color: 'blue',
      description: 'IDP, SDBIP, Performance Agreements, Policies',
      submenu: [
        'Integrated Development Plan & SDBIP',
        'Performance Agreements', 
        'Policies and By-Laws',
        'Valuations',
        'Loan Agreements'
      ]
    },
    {
      id: 'publications',
      label: 'Publications',
      icon: BookOpen,
      color: 'purple',
      description: 'Municipal publications and documents'
    },
    {
      id: 'residents',
      label: 'Residents',
      icon: Users,
      color: 'green',
      description: 'Resident services and applications',
      submenu: [
        'Water and Electricity Connection',
        'Back To Basics (B2B)',
        'Meter Readings',
        'Update Contact Details',
        'Banking Details',
        'Payment Methods',
        'Customer Care FAQ'
      ]
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: CreditCard,
      color: 'orange',
      description: 'Municipal account services and payments'
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building,
      color: 'red',
      description: 'Municipal department information',
      submenu: userMunicipality?.departments.map(d => d.name) || []
    },
    {
      id: 'council',
      label: 'Council',
      icon: Scale,
      color: 'indigo',
      description: 'Council information and meetings',
      submenu: [
        'Speaker Profile',
        'Councillors Contact Information',
        'Council Meetings',
        'Public Participation'
      ]
    },
    {
      id: 'gis',
      label: 'GIS',
      icon: Map,
      color: 'teal',
      description: 'Geographic Information System'
    },
    {
      id: 'e-services',
      label: 'E-Services',
      icon: Globe,
      color: 'cyan',
      description: 'Online municipal services'
    },
    {
      id: 'library',
      label: 'Library Services',
      icon: BookOpen,
      color: 'pink',
      description: 'Municipal library and information services'
    },
    {
      id: 'call-center',
      label: 'Call Center Management',
      icon: Phone,
      color: 'indigo',
      description: 'Digital call center and report management'
    }
  ];

  // Filter notifications
  const filteredNotifications = notifications.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Share functionality
  const shareNews = async (item: NewsItem, platform: string) => {
    const url = `${window.location.origin}/municipal-portal/news/${item.id}`;
    const text = `${item.title} - ${item.excerpt}`;
    
    try {
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
          break;
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    const icons = {
      news: Megaphone,
      event: Calendar,
      notice: AlertCircle,
      tender: FileText,
      'council-meeting': Scale
    };
    return icons[type as keyof typeof icons] || Info;
  };

  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userMunicipality?.name}</h1>
            <p className="text-emerald-100">{userMunicipality?.province} Province</p>
          </div>
        </div>
        <p className="text-lg leading-relaxed">
          Welcome to your municipal portal. Access services, stay informed with latest news, 
          and engage with your local government.
        </p>
      </div>

      {/* Quick Services Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {municipalServices.slice(0, 8).map(service => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={() => setActiveSection(service.id)}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 group"
            >
              <div className={`w-12 h-12 bg-${service.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 text-${service.color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{service.label}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </button>
          );
        })}
      </div>

      {/* Featured News */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Updates</h2>
          <button
            onClick={() => setActiveSection('news')}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid gap-4">
          {notifications.filter(item => item.featured).slice(0, 3).map(item => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{item.department}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.excerpt}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600 mt-2">Stay informed with the latest municipal news, events, and notices</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="event">Events</option>
            <option value="notice">Notices</option>
            <option value="tender">Tenders</option>
            <option value="council-meeting">Council Meetings</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid gap-6">
        {filteredNotifications.map(item => {
          const TypeIcon = getTypeIcon(item.type);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 capitalize">{item.type.replace('-', ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.department} • {new Date(item.publishDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Share Button */}
                  <div className="relative group">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Share2 className="w-5 h-5" />
                    </button>
                    
                    {/* Share Dropdown */}
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[200px]">
                      <button
                        onClick={() => shareNews(item, 'facebook')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                      >
                        <Facebook className="w-4 h-4" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => shareNews(item, 'twitter')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                      >
                        <Twitter className="w-4 h-4" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => shareNews(item, 'linkedin')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                      >
                        <Linkedin className="w-4 h-4" />
                        Share on LinkedIn
                      </button>
                      <button
                        onClick={() => shareNews(item, 'whatsapp')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Share on WhatsApp
                      </button>
                      <button
                        onClick={() => shareNews(item, 'copy')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h2>
                <p className="text-gray-700 mb-4">{item.content}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Event/Deadline Info */}
                {(item.eventDate || item.deadline) && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                    {item.eventDate && (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Event Date: {new Date(item.eventDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.deadline && (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Location: {item.location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Attachments */}
                {item.attachments && item.attachments.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                    <div className="space-y-2">
                      {item.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {item.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {item.comments}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">By {item.author}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );

  const renderServiceSection = (serviceId: string) => {
    const service = municipalServices.find(s => s.id === serviceId);
    if (!service) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 bg-${service.color}-100 rounded-2xl flex items-center justify-center`}>
              <service.icon className={`w-8 h-8 text-${service.color}-600`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service.label}</h1>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
          
          {service.submenu && (
            <div className="grid gap-4 md:grid-cols-2">
              {service.submenu.map((item, index) => (
                <button
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all text-left"
                >
                  <span className="font-medium text-gray-900">{item}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              This section is under development. Full municipal services integration will be available soon.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarOpen ? (isMobile ? '100%' : '320px') : '0px',
          opacity: sidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        } bg-white border-r border-gray-200 overflow-hidden shadow-lg flex-shrink-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Municipal Portal</h2>
                <p className="text-sm text-gray-600">{userMunicipality?.name}</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

                     {/* Navigation Menu */}
           <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
             {/* Home Button */}
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => {
                 setActiveSection('home');
                 if (isMobile) setSidebarOpen(false);
               }}
               className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                 activeSection === 'home'
                   ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                   : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
               }`}
             >
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                 activeSection === 'home'
                   ? 'bg-white/20' 
                   : 'bg-gray-100 group-hover:bg-emerald-50'
               }`}>
                 <Home className={`w-5 h-5 ${
                   activeSection === 'home'
                     ? 'text-white' 
                     : 'text-emerald-600 group-hover:text-emerald-600'
                 }`} />
               </div>
               <div className="flex-1">
                 <span className="font-semibold text-sm">Home</span>
                 <p className={`text-xs mt-0.5 ${
                   activeSection === 'home' ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                 }`}>
                   Municipal dashboard and overview
                 </p>
               </div>
               {activeSection !== 'home' && (
                 <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
               )}
             </motion.button>

             {municipalServices.map(service => {
              const Icon = service.icon;
              const isActive = activeSection === service.id;
              
              return (
                                 <motion.button
                   key={service.id}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => {
                     if (service.id === 'call-center') {
                       navigate('/call-center');
                     } else {
                       setActiveSection(service.id);
                     }
                     if (isMobile) setSidebarOpen(false);
                   }}
                  className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-emerald-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isActive 
                        ? 'text-white' 
                        : `text-${service.color}-600 group-hover:text-emerald-600`
                    }`} />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{service.label}</span>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                    }`}>
                      {service.description}
                    </p>
                  </div>
                  {!isActive && (
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  )}
                </motion.button>
              );
            })}
            
            {/* News & Updates with notification badge */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveSection('news');
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === 'news'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative ${
                activeSection === 'news'
                  ? 'bg-white/20' 
                  : 'bg-gray-100 group-hover:bg-emerald-50'
              }`}>
                <Megaphone className={`w-5 h-5 ${
                  activeSection === 'news'
                    ? 'text-white' 
                    : 'text-red-600 group-hover:text-emerald-600'
                }`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm">News & Updates</span>
                <p className={`text-xs mt-0.5 ${
                  activeSection === 'news' ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-600'
                }`}>
                  Latest municipal news and announcements
                </p>
              </div>
              {activeSection !== 'news' && (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              )}
            </motion.button>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{userData?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{userData?.type}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                             <div className="flex items-center gap-4">
                 {/* Sidebar Toggle */}
                 <button
                   onClick={() => setSidebarOpen(!sidebarOpen)}
                   className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                 >
                   {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                 </button>
                 
                 {/* Page Title */}
                 {(municipalServices.find(s => s.id === activeSection)?.label || 
                   (activeSection === 'news' ? 'News & Updates' : '')) && (
                   <div>
                     <h1 className="text-xl font-bold text-gray-900">
                       {municipalServices.find(s => s.id === activeSection)?.label || 
                        (activeSection === 'news' ? 'News & Updates' : '')}
                     </h1>
                   </div>
                 )}
               </div>
              
                             {/* Header Actions */}
               <div className="flex items-center gap-3">
                 {/* Notifications */}
                 <button
                   onClick={() => setActiveSection('news')}
                   className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                 >
                   <Bell className="w-5 h-5" />
                   {unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                       {unreadCount > 99 ? '99+' : unreadCount}
                     </span>
                   )}
                 </button>
                 
                 {/* Profile Dropdown */}
                 <div className="relative" data-profile-dropdown>
                   <button
                     onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                     className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors"
                   >
                     <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                       <User className="w-4 h-4 text-emerald-600" />
                     </div>
                     <div className="text-sm hidden sm:block">
                       <p className="font-medium text-gray-900 text-left">{userData?.name}</p>
                       <p className="text-gray-500 capitalize text-left">{userData?.type}</p>
                     </div>
                     <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                       profileDropdownOpen ? 'rotate-180' : ''
                     }`} />
                   </button>

                   {/* Dropdown Menu */}
                   {profileDropdownOpen && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                     >
                       {/* User Info in Dropdown */}
                       <div className="px-4 py-3 border-b border-gray-100">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                             <User className="w-5 h-5 text-emerald-600" />
                           </div>
                           <div>
                             <p className="font-semibold text-gray-900">{userData?.name}</p>
                             <p className="text-sm text-gray-500 capitalize">{userData?.type}</p>
                             <p className="text-xs text-gray-400">{userMunicipality?.name}</p>
                           </div>
                         </div>
                       </div>

                       {/* Menu Items */}
                       <div className="py-2">
                         <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                           <User className="w-4 h-4" />
                           <span className="text-sm">My Profile</span>
                         </button>
                         <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                           <Settings className="w-4 h-4" />
                           <span className="text-sm">Settings</span>
                         </button>
                         <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                           <Bell className="w-4 h-4" />
                           <span className="text-sm">Notifications</span>
                         </button>
                       </div>

                       {/* Logout */}
                       <div className="border-t border-gray-100 py-2">
                         <button
                           onClick={() => {
                             setProfileDropdownOpen(false);
                             onBack();
                           }}
                           className="w-full flex items-center gap-3 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors"
                         >
                           <LogOut className="w-4 h-4" />
                           <span className="text-sm">Logout</span>
                         </button>
                       </div>
                     </motion.div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </header>

                 {/* Main Content */}
         <main className="flex-1 overflow-y-auto">
           <div className="p-4 sm:p-6 lg:p-8">
             <div className="max-w-7xl mx-auto">
               {activeSection === 'home' && renderHome()}
               {activeSection === 'news' && renderNews()}
               {activeSection !== 'home' && activeSection !== 'news' && renderServiceSection(activeSection)}
             </div>
           </div>
         </main>
      </div>
    </div>
  );
};

export default MunicipalPortal; 