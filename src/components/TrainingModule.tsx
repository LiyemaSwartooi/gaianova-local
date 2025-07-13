import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Users, Book, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { TrainingModule, UserTrainingProgress } from '../types';

interface TrainingModuleProps {
  module: TrainingModule;
  userProgress?: UserTrainingProgress;
  onStartModule: (moduleId: string) => void;
  onCompleteModule: (moduleId: string, score: number) => void;
}

export default function TrainingModuleComponent({ 
  module, 
  userProgress, 
  onStartModule, 
  onCompleteModule 
}: TrainingModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'certified': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-5 h-5" />;
      case 'interactive': return <Star className="w-5 h-5" />;
      case 'document': return <Book className="w-5 h-5" />;
      case 'quiz': return <Award className="w-5 h-5" />;
      default: return <Book className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              {getTypeIcon(module.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{module.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.duration} minutes
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {module.targetAudience.join(', ')}
                </span>
                {module.isRequired && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    Required
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {userProgress && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(userProgress.status)}`}>
              {userProgress.status === 'not-started' ? 'Not Started' : 
               userProgress.status === 'in-progress' ? 'In Progress' :
               userProgress.status === 'completed' ? 'Completed' : 'Certified'}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {userProgress && userProgress.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900 font-medium">{userProgress.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {userProgress?.status === 'completed' || userProgress?.status === 'certified' ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {userProgress.status === 'certified' ? 'Certified' : 'Completed'}
                </span>
                {userProgress.score && (
                  <span className="text-sm text-gray-500">
                    Score: {userProgress.score}%
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => onStartModule(module.id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                {userProgress?.status === 'in-progress' ? 'Continue' : 'Start Module'}
              </button>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">
              Completion Rate: {Math.round(module.completionRate)}%
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Understand municipal service delivery processes</li>
                  <li>• Learn effective community engagement techniques</li>
                  <li>• Master report handling and resolution procedures</li>
                  <li>• Develop leadership skills for community champions</li>
                </ul>
              </div>
              
              {userProgress?.certificateUrl && (
                <div>
                  <a
                    href={userProgress.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <Award className="w-4 h-4" />
                    Download Certificate
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>
    </motion.div>
  );
}

// Training Dashboard Component
interface TrainingDashboardProps {
  modules: TrainingModule[];
  userProgress: UserTrainingProgress[];
  onStartModule: (moduleId: string) => void;
  onCompleteModule: (moduleId: string, score: number) => void;
}

export function TrainingDashboard({ 
  modules, 
  userProgress, 
  onStartModule, 
  onCompleteModule 
}: TrainingDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'required' | 'completed' | 'in-progress'>('all');

  const filteredModules = modules.filter(module => {
    const progress = userProgress.find(p => p.moduleId === module.id);
    
    switch (filter) {
      case 'required': return module.isRequired;
      case 'completed': return progress?.status === 'completed' || progress?.status === 'certified';
      case 'in-progress': return progress?.status === 'in-progress';
      default: return true;
    }
  });

  const completedCount = userProgress.filter(p => p.status === 'completed' || p.status === 'certified').length;
  const inProgressCount = userProgress.filter(p => p.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Concept Champion Training</h2>
        <p className="text-emerald-100">Develop your skills to become an effective community champion</p>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{modules.length}</div>
            <div className="text-emerald-100 text-sm">Total Modules</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedCount}</div>
            <div className="text-emerald-100 text-sm">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <div className="text-emerald-100 text-sm">In Progress</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All Modules' },
          { key: 'required', label: 'Required' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' }
        ].map(filterOption => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterOption.key
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredModules.map(module => {
          const progress = userProgress.find(p => p.moduleId === module.id);
          return (
            <TrainingModuleComponent
              key={module.id}
              module={module}
              userProgress={progress}
              onStartModule={onStartModule}
              onCompleteModule={onCompleteModule}
            />
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Book className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No modules found</h3>
          <p className="text-gray-500">Try adjusting your filter to see more modules.</p>
        </div>
      )}
    </div>
  );
} 