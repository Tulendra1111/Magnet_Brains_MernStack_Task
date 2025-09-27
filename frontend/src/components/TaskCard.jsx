import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const TaskCard = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onStatusUpdate,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      case 'Low':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Completed' 
      ? 'badge-success' 
      : 'badge-warning';
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    onStatusUpdate(task._id, newStatus);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // You would call the delete API here
      onTaskDeleted(task._id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'Pending';

  return (
    <div className="card p-6 hover:shadow-medium transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-4">
              {task.title}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className={`badge ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`badge ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {task.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                Due {formatDate(task.dueDate)}
              </span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{task.assignedUser.name}</span>
            </div>
            {isOverdue && (
              <div className="flex items-center text-red-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span className="font-medium">Overdue</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleStatusToggle}
            className={`btn-secondary text-xs px-3 py-2 ${
              task.status === 'Completed'
                ? 'text-yellow-700 hover:bg-yellow-50'
                : 'text-green-700 hover:bg-green-50'
            }`}
          >
            <CheckIcon className="h-3 w-3 mr-1" />
            {task.status === 'Completed' ? 'Mark Pending' : 'Mark Complete'}
          </button>
          
          <Link
            to={`/task/${task._id}`}
            className="btn-secondary text-xs px-3 py-2"
          >
            <PencilIcon className="h-3 w-3 mr-1" />
            View
          </Link>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>

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
  );
};

export default TaskCard;
