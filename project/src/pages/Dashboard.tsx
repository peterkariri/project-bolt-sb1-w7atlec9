import React from 'react';
import { TrendingUp, Trophy, Calendar, DollarSign, Target, Clock } from 'lucide-react';
import { useTodaysPredictions, usePredictions } from '../hooks/usePredictions';
import { useAuth } from '../contexts/AuthContext';
import PredictionCard from '../components/PredictionCard';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { data: todaysPredictions, isLoading: loadingToday } = useTodaysPredictions();
  const { data: recentPredictions, isLoading: loadingRecent } = usePredictions(undefined, 5);

  const stats = [
    {
      icon: <Target className="h-6 w-6" />,
      label: 'Success Rate',
      value: '78%',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: 'Total Tips',
      value: '156',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: 'ROI',
      value: '+23%',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      label: 'Win Streak',
      value: '5',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <p className="text-green-100 mb-4">
          Ready to check today's winning predictions?
        </p>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(), 'EEEE, MMMM dd, yyyy')}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
            {profile?.subscription_plan === 'premium' ? (
              <>
                <Trophy className="h-4 w-4 mr-1" />
                Premium Member
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-1" />
                Free Member
              </>
            )}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Today's Predictions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Today's Predictions</h2>
          <span className="text-sm text-gray-600">
            {todaysPredictions?.length || 0} tips available
          </span>
        </div>

        {loadingToday ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : todaysPredictions && todaysPredictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions today</h3>
            <p className="text-gray-600">
              Check back later for today's expert predictions
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Predictions</h2>
        
        {loadingRecent ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : recentPredictions && recentPredictions.length > 0 ? (
          <div className="space-y-4">
            {recentPredictions.map((prediction) => (
              <PredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600">
              Start following predictions to see your activity here
            </p>
          </div>
        )}
      </div>

      {/* Upgrade Prompt for Free Users */}
      {profile?.subscription_plan === 'free' && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-orange-100 mb-4">
                Get access to exclusive predictions, detailed analysis, and multi-bet tips
              </p>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>
            <Trophy className="h-16 w-16 text-orange-200" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;