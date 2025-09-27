import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import TaskForm from './TaskForm';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await tasksAPI.getById(id);
        setTask(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    if (!task) return;
    
    try {
      const response = await tasksAPI.updateStatus(task._id, status);
      setTask(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTask(updatedTask);
    setShowEditForm(false);
  };

  const handleDelete = async () => {
    if (!task) return;
    
    setDeleting(true);
    try {
      await tasksAPI.delete(task._id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested task could not be found.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'Pending';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Overdue
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Task Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Task Details</h2>
          </div>
          
          <div className="px-6 py-4 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Due Date</h3>
                <div className="flex items-center text-gray-900">
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned To</h3>
                <div className="flex items-center text-gray-900">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{task.assignedUser.name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Created By</h3>
                <div className="flex items-center text-gray-900">
                  <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{task.createdBy.name}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Created At</h3>
                <div className="flex items-center text-gray-900">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Update Status</h3>
              <button
                onClick={() => handleStatusUpdate(task.status === 'Pending' ? 'Completed' : 'Pending')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  task.status === 'Completed'
                    ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                    : 'text-green-700 bg-green-100 hover:bg-green-200'
                }`}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {task.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {showEditForm && (
          <TaskForm
            task={task}
            onTaskCreated={handleTaskUpdated}
            onClose={() => setShowEditForm(false)}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
