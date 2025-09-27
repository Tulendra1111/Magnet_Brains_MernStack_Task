import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI } from '../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import PriorityBoard from './PriorityBoard';
import { 
  PlusIcon, 
  ViewColumnsIcon, 
  ListBulletIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    page: 1,
    limit: 10,
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(filters);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => 
      prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      const response = await tasksAPI.updateStatus(taskId, status);
      handleTaskUpdated(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const getPriorityTasks = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.name}! Here's what you need to focus on today.
              </p>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-primary inline-flex items-center px-6 py-3 text-sm font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                viewMode === 'list'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ListBulletIcon className="h-4 w-4 mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                viewMode === 'board'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ViewColumnsIcon className="h-4 w-4 mr-2" />
              Board View
            </button>
          </div>

          <button
            onClick={() => setFilters(prev => ({ ...prev, status: '', priority: '', page: 1 }))}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Clear Filters
          </button>
        </div>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onClose={() => setShowTaskForm(false)}
          />
        )}

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {/* Tasks List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">All Tasks</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {tasks.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">No tasks found. Create your first task!</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onTaskUpdated={handleTaskUpdated}
                      onTaskDeleted={handleTaskDeleted}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.currentPage
                          ? 'text-white bg-primary-600 border border-primary-600'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <PriorityBoard
            tasks={tasks}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
