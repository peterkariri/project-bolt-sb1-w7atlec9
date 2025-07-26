import React, { useState } from 'react';
import { Plus, Users, TrendingUp, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePredictions, useCreatePrediction } from '../hooks/usePredictions';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const predictionSchema = yup.object({
  league: yup.string().required('League is required'),
  home_team: yup.string().required('Home team is required'),
  away_team: yup.string().required('Away team is required'),
  prediction_type: yup.string().oneOf(['single', 'multi', 'jackpot']).required(),
  prediction: yup.string().required('Prediction is required'),
  confidence_score: yup.number().min(0).max(100).required('Confidence score is required'),
  match_date: yup.string().required('Match date is required'),
  is_premium: yup.boolean().required(),
  reasoning: yup.string().optional(),
});

type PredictionFormData = yup.InferType<typeof predictionSchema>;

const AdminPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('predictions');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { data: predictions, isLoading } = usePredictions();
  const createPrediction = useCreatePrediction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PredictionFormData>({
    resolver: yupResolver(predictionSchema),
    defaultValues: {
      prediction_type: 'single',
      is_premium: false,
      confidence_score: 75,
    },
  });

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const onSubmit = async (data: PredictionFormData) => {
    try {
      await createPrediction.mutateAsync({
        ...data,
        created_by: user?.id || null,
        odds: {},
        result: 'pending',
      });
      reset();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating prediction:', error);
    }
  };

  const tabs = [
    { id: 'predictions', name: 'Predictions', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'users', name: 'Users', icon: <Users className="h-5 w-5" /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%' },
    { label: 'Active Predictions', value: '45', change: '+8%' },
    { label: 'Success Rate', value: '78%', change: '+3%' },
    { label: 'Premium Subscribers', value: '156', change: '+15%' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage predictions, users, and platform settings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Predictions Tab */}
          {activeTab === 'predictions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Manage Predictions</h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prediction
                </button>
              </div>

              {/* Add Prediction Form */}
              {showAddForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Prediction</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League
                      </label>
                      <input
                        {...register('league')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., Premier League"
                      />
                      {errors.league && (
                        <p className="mt-1 text-sm text-red-600">{errors.league.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prediction Type
                      </label>
                      <select
                        {...register('prediction_type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="single">Single Bet</option>
                        <option value="multi">Multi-Bet</option>
                        <option value="jackpot">Jackpot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Team
                      </label>
                      <input
                        {...register('home_team')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Home team name"
                      />
                      {errors.home_team && (
                        <p className="mt-1 text-sm text-red-600">{errors.home_team.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Away Team
                      </label>
                      <input
                        {...register('away_team')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Away team name"
                      />
                      {errors.away_team && (
                        <p className="mt-1 text-sm text-red-600">{errors.away_team.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Date & Time
                      </label>
                      <input
                        {...register('match_date')}
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                      {errors.match_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.match_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confidence Score (%)
                      </label>
                      <input
                        {...register('confidence_score', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="75"
                      />
                      {errors.confidence_score && (
                        <p className="mt-1 text-sm text-red-600">{errors.confidence_score.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prediction
                    </label>
                    <input
                      {...register('prediction')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Home Win, Over 2.5 Goals"
                    />
                    {errors.prediction && (
                      <p className="mt-1 text-sm text-red-600">{errors.prediction.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reasoning (Optional)
                    </label>
                    <textarea
                      {...register('reasoning')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      placeholder="Explain your reasoning for this prediction..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      {...register('is_premium')}
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Premium tip (requires subscription)
                    </label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={createPrediction.isPending}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {createPrediction.isPending ? 'Adding...' : 'Add Prediction'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Predictions List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading predictions...</p>
                  </div>
                ) : predictions && predictions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Match
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prediction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {predictions.slice(0, 10).map((prediction) => (
                          <tr key={prediction.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {prediction.home_team} vs {prediction.away_team}
                                </div>
                                <div className="text-sm text-gray-500">{prediction.league}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prediction.prediction}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {prediction.prediction_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {prediction.confidence_score}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                prediction.is_premium 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {prediction.is_premium ? 'Premium' : 'Free'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                prediction.result === 'won' 
                                  ? 'bg-green-100 text-green-800'
                                  : prediction.result === 'lost'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {prediction.result}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
                    <p className="text-gray-600">Start by adding your first prediction</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs placeholders */}
          {activeTab === 'users' && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">User management features coming soon</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Detailed analytics and reporting features coming soon</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Settings</h3>
              <p className="text-gray-600">System configuration options coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;