import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-center space-x-4">
        <FunnelIcon className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
        
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={filters.limit}
          onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
