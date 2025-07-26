import React from 'react';
import { Clock, TrendingUp, Lock, Calendar, Trophy, Crown, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { Prediction } from '../hooks/usePredictions';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

interface PredictionCardProps {
  prediction: Prediction;
  showActions?: boolean;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, showActions = true }) => {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  
  const canViewPremium = user && (profile?.subscription_plan === 'premium' || !prediction.is_premium);
  
  const getResultColor = (result: string) => {
    switch (result) {
      case 'won':
        return 'text-green-600 bg-green-50';
      case 'lost':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPredictionTypeIcon = (type: string) => {
    switch (type) {
      case 'jackpot':
        return <Trophy className="h-4 w-4" />;
      case 'multi':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPredictionTypeBadge = (type: string) => {
    const colors = {
      single: 'bg-blue-100 text-blue-800',
      multi: 'bg-purple-100 text-purple-800',
      jackpot: 'bg-yellow-100 text-yellow-800',
    };
    
    return colors[type as keyof typeof colors] || colors.single;
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          card: 'bg-gray-800 border-gray-700 hover:shadow-xl',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          background: 'bg-gray-700',
          premium: 'bg-gradient-to-r from-orange-600 to-red-600',
        };
      case 'golden':
        return {
          card: 'bg-gradient-card-golden border-golden-400 hover:shadow-golden-lg',
          text: 'text-golden-100',
          textSecondary: 'text-golden-200',
          background: 'bg-gray-700',
          premium: 'bg-gradient-to-r from-golden-600 to-orange-600',
        };
      default:
        return {
          card: 'bg-white border-gray-200 hover:shadow-lg',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          background: 'bg-gray-50',
          premium: 'bg-gradient-to-r from-orange-50 to-orange-100',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`${themeClasses.card} rounded-lg shadow-md border p-6 transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            getPredictionTypeBadge(prediction.prediction_type)
          )}>
            {getPredictionTypeIcon(prediction.prediction_type)}
            <span className="ml-1 capitalize">{prediction.prediction_type}</span>
          </span>
          {prediction.is_premium && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              <Lock className="h-3 w-3 mr-1" />
              {theme === 'golden' ? (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </>
              ) : (
                'Premium'
              )}
            </span>
          )}
        </div>
        <span className={clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getResultColor(prediction.result)
        )}>
          {prediction.result.charAt(0).toUpperCase() + prediction.result.slice(1)}
        </span>
      </div>

      {/* Match Info */}
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
          {prediction.home_team} vs {prediction.away_team}
        </h3>
        <div className={`flex items-center text-sm ${themeClasses.textSecondary} space-x-4`}>
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {format(new Date(prediction.match_date), 'MMM dd, yyyy HH:mm')}
          </span>
          <span className="font-medium">{prediction.league}</span>
        </div>
      </div>

      {/* Prediction Content */}
      {canViewPremium ? (
        <div className="space-y-3">
          <div className={`${themeClasses.background} rounded-lg p-4`}>
            <h4 className={`font-medium ${themeClasses.text} mb-1`}>Prediction</h4>
            <p className={themeClasses.textSecondary}>{prediction.prediction}</p>
          </div>

          {prediction.confidence_score && (
            <div className="flex items-center justify-between">
              <span className={`text-sm ${themeClasses.textSecondary}`}>Confidence</span>
              <span className={clsx('font-semibold', getConfidenceColor(prediction.confidence_score))}>
                {prediction.confidence_score}%
              </span>
            </div>
          )}

          {prediction.reasoning && (
            <div className={`${theme === 'golden' ? 'bg-golden-900 border border-golden-400' : theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg p-4`}>
              <h4 className={`font-medium ${theme === 'golden' ? 'text-golden-200' : theme === 'dark' ? 'text-blue-200' : 'text-blue-900'} mb-1`}>Analysis</h4>
              <p className={`${theme === 'golden' ? 'text-golden-300' : theme === 'dark' ? 'text-blue-300' : 'text-blue-800'} text-sm`}>{prediction.reasoning}</p>
            </div>
          )}

          {prediction.odds && Object.keys(prediction.odds).length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(prediction.odds).map(([bookmaker, odds]) => (
                <div key={bookmaker} className="text-center">
                  <div className={`text-xs ${themeClasses.textSecondary} mb-1`}>{bookmaker}</div>
                  <div className={`font-semibold ${themeClasses.text}`}>{odds}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`${themeClasses.premium} rounded-lg p-6 text-center relative overflow-hidden`}>
          {theme === 'golden' && (
            <div className="absolute inset-0 shimmer"></div>
          )}
          <div className="relative z-10">
            {theme === 'golden' ? (
              <Crown className="h-8 w-8 text-golden-300 mx-auto mb-2" />
            ) : (
              <Lock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            )}
            <h4 className={`font-medium ${theme === 'golden' ? 'text-golden-100' : 'text-orange-900'} mb-1`}>
              {theme === 'golden' ? 'Premium Content' : 'Premium Content'}
            </h4>
            <p className={`${theme === 'golden' ? 'text-golden-200' : 'text-orange-800'} text-sm mb-3`}>
            Subscribe to access detailed predictions and analysis
          </p>
          <button className={`${theme === 'golden' ? 'bg-gradient-golden shadow-golden hover:shadow-golden-lg' : 'bg-orange-600 hover:bg-orange-700'} text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200`}>
            Upgrade to Premium
          </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && canViewPremium && (
        <div className={`mt-4 pt-4 border-t ${theme === 'golden' ? 'border-golden-400' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <button className={`flex items-center text-sm ${themeClasses.textSecondary} ${theme === 'golden' ? 'hover:text-golden-400' : 'hover:text-golden-600'} transition-colors`}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Add to Slip
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className={`text-sm ${themeClasses.textSecondary} hover:text-blue-600 transition-colors`}>
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;