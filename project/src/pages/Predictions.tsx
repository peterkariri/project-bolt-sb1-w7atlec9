import React, { useState } from 'react';
import { Calendar, Filter, TrendingUp, Trophy, Clock } from 'lucide-react';
import { usePredictions } from '../hooks/usePredictions';
import PredictionCard from '../components/PredictionCard';
import { format } from 'date-fns';

const Predictions: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('today');

  const { data: predictions, isLoading } = usePredictions(
    selectedType === 'all' ? undefined : selectedType
  );

  const predictionTypes = [
    { value: 'all', label: 'All Tips', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'single', label: 'Single Bets', icon: <Clock className="h-4 w-4" /> },
    { value: 'multi', label: 'Multi-Bets', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'jackpot', label: 'Jackpot', icon: <Trophy className="h-4 w-4" /> },
  ];

  const dateFilters = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This Week' },
    { value: 'all', label: 'All Time' },
  ];

  const filteredPredictions = predictions?.filter(prediction => {
    if (selectedDate === 'today') {
      const today = new Date();
      const predictionDate = new Date(prediction.match_date);
      return predictionDate.toDateString() === today.toDateString();
    }
    if (selectedDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const predictionDate = new Date(prediction.match_date);
      return predictionDate.toDateString() === tomorrow.toDateString();
    }
    if (selectedDate === 'week') {
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const predictionDate = new Date(prediction.match_date);
      return predictionDate >= today && predictionDate <= weekFromNow;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expert Predictions</h1>
        <p className="text-gray-600">
          Professional analysis and winning tips from our expert tipsters
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Prediction Type Filter */}
          <div className="flex flex-wrap gap-2">
            {predictionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.icon}
                <span className="ml-2">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
            >
              {dateFilters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredPredictions?.length || 0} predictions found
            </h2>
            <p className="text-sm text-gray-600">
              Showing {selectedType === 'all' ? 'all types' : selectedType} for {selectedDate}
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Updated {format(new Date(), 'HH:mm')}</span>
          </div>
        </div>
      </div>

      {/* Predictions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredPredictions && filteredPredictions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPredictions.map((prediction) => (
            <PredictionCard key={prediction.id} prediction={prediction} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No predictions found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or check back later for new predictions
          </p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedDate('today');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Predictions;