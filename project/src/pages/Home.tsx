import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Trophy, Users, ArrowRight, Star, CheckCircle, Crown, Sparkles } from 'lucide-react';
import { useTodaysPredictions } from '../hooks/usePredictions';
import PredictionCard from '../components/PredictionCard';
import { useTheme } from '../contexts/ThemeContext';

const Home: React.FC = () => {
  const { data: todaysPredictions, isLoading } = useTodaysPredictions();
  const { theme } = useTheme();

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Expert Analysis',
      description: 'Professional tipsters with proven track records analyze every match',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Verified Results',
      description: 'Transparent tracking of all predictions with detailed performance metrics',
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: 'High Success Rate',
      description: 'Consistently delivering winning predictions across multiple leagues',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'Join thousands of successful bettors sharing strategies and insights',
    },
  ];

  const stats = [
    { label: 'Success Rate', value: '78%' },
    { label: 'Active Users', value: '15K+' },
    { label: 'Daily Tips', value: '25+' },
    { label: 'Leagues Covered', value: '50+' },
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          hero: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white',
          section: 'bg-gray-800',
          card: 'bg-gray-700 border-gray-600',
          text: 'text-white',
          textSecondary: 'text-gray-300',
        };
      case 'golden':
        return {
          hero: 'bg-gradient-to-br from-gray-900 via-yellow-900 to-gray-900 text-golden-100',
          section: 'bg-gray-800',
          card: 'bg-gradient-card-golden border-golden-400 shadow-golden',
          text: 'text-golden-100',
          textSecondary: 'text-golden-200',
        };
      default:
        return {
          hero: 'bg-gradient-to-br from-golden-600 via-golden-700 to-golden-800 text-white',
          section: 'bg-white',
          card: 'bg-white border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${themeClasses.hero} relative overflow-hidden`}>
        {theme === 'golden' && (
          <div className="absolute inset-0 bg-gradient-animated opacity-20"></div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className={`h-16 w-16 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-300'}`} />
                {theme === 'golden' && (
                  <>
                    <div className="absolute inset-0 animate-pulse">
                      <Crown className="h-16 w-16 text-golden-300 opacity-50" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-golden-300 animate-pulse" />
                    <Sparkles className="absolute -bottom-2 -left-2 h-4 w-4 text-golden-400 animate-pulse delay-300" />
                  </>
                )}
              </div>
            </div>
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'golden' ? 'text-golden-100' : ''}`}>
              <span className={theme === 'golden' ? 'bg-gradient-to-r from-golden-300 via-golden-400 to-golden-300 bg-clip-text text-transparent' : ''}>
                Supreme Betting Tips
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${theme === 'golden' ? 'text-golden-200' : 'text-green-100'} max-w-3xl mx-auto`}>
              Your ultimate destination for expert football predictions, detailed analysis, 
              and winning strategies from professional tipsters
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className={`${theme === 'golden' ? 'bg-gradient-golden text-white shadow-golden hover:shadow-golden-lg' : 'bg-white text-golden-600 hover:bg-gray-100'} px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center`}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/predictions"
                className={`border-2 ${theme === 'golden' ? 'border-golden-400 text-golden-400 hover:bg-golden-400 hover:text-gray-900' : 'border-white text-white hover:bg-white hover:text-golden-600'} px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center`}
              >
                View Today's Tips
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${themeClasses.section}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mb-2`}>
                  {stat.value}
                </div>
                <div className={`${themeClasses.textSecondary} font-medium`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Predictions Preview */}
      <section className={`py-16 ${theme === 'golden' ? 'bg-gray-900' : theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>
              Today's Top Predictions
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              See our latest expert predictions and start winning today
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`${themeClasses.card} rounded-lg shadow-md p-6 animate-pulse`}>
                  <div className={`h-4 ${theme === 'golden' ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-4`}></div>
                  <div className={`h-6 ${theme === 'golden' ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-4 ${theme === 'golden' ? 'bg-gray-600' : 'bg-gray-200'} rounded mb-4`}></div>
                  <div className={`h-20 ${theme === 'golden' ? 'bg-gray-600' : 'bg-gray-200'} rounded`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {todaysPredictions?.slice(0, 3).map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} showActions={false} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/predictions"
              className={`${theme === 'golden' ? 'bg-gradient-golden shadow-golden hover:shadow-golden-lg' : 'bg-golden-600 hover:bg-golden-700'} text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center`}
            >
              View All Predictions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${themeClasses.section}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>
              Why Choose Supreme Betting Tips?
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              We provide comprehensive betting analysis with transparency and proven results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`${theme === 'golden' ? 'bg-golden-900 group-hover:bg-golden-800' : 'bg-golden-100 group-hover:bg-golden-200'} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-200 ${theme === 'golden' ? 'shadow-golden' : ''}`}>
                  <div className={`${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'}`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-2`}>
                  {feature.title}
                </h3>
                <p className={themeClasses.textSecondary}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className={`py-16 ${theme === 'golden' ? 'bg-gray-900' : theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>
              Choose Your Plan
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} max-w-2xl mx-auto`}>
              Get access to premium predictions and exclusive analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className={`${themeClasses.card} rounded-lg shadow-md p-8 border`}>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Free</h3>
                <div className={`text-4xl font-bold ${themeClasses.text} mb-1`}>$0</div>
                <div className={themeClasses.textSecondary}>Per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>3 Daily Predictions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Basic Analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Community Access</span>
                </li>
              </ul>
              <Link
                to="/register"
                className={`w-full ${theme === 'golden' ? 'bg-gray-600 text-golden-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} py-3 rounded-lg font-semibold transition-colors block text-center`}
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className={`${themeClasses.card} rounded-lg shadow-md p-8 border-2 ${theme === 'golden' ? 'border-golden-400 shadow-golden-lg' : 'border-golden-500'} relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className={`${theme === 'golden' ? 'bg-gradient-golden' : 'bg-golden-500'} text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg`}>
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Premium</h3>
                <div className={`text-4xl font-bold ${themeClasses.text} mb-1`}>$29</div>
                <div className={themeClasses.textSecondary}>Per month</div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Unlimited Predictions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Detailed Analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Multi-bet & Jackpot Tips</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Odds Comparison</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className={`h-5 w-5 ${theme === 'golden' ? 'text-golden-400' : 'text-golden-600'} mr-3`} />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Link
                to="/subscribe"
                className={`w-full ${theme === 'golden' ? 'bg-gradient-golden shadow-golden hover:shadow-golden-lg' : 'bg-golden-600 hover:bg-golden-700'} text-white py-3 rounded-lg font-semibold transition-all duration-200 block text-center`}
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${theme === 'golden' ? 'bg-gradient-hero' : 'bg-golden-600'} relative overflow-hidden`}>
        {theme === 'golden' && (
          <div className="absolute inset-0 bg-gradient-animated opacity-30"></div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to Start Winning?
          </h2>
          <p className={`text-xl ${theme === 'golden' ? 'text-golden-100' : 'text-green-100'} mb-8 max-w-2xl mx-auto relative z-10`}>
            Join thousands of successful bettors who trust Supreme Betting Tips for their daily predictions
          </p>
          <Link
            to="/register"
            className={`${theme === 'golden' ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-golden-lg' : 'bg-white text-golden-600 hover:bg-gray-100'} px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center relative z-10`}
          >
            Sign Up Now - It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;