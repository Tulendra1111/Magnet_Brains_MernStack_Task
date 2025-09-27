import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { tasksAPI, usersAPI } from '../services/api';

const TaskForm = ({ onTaskCreated, onClose, task }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    priority: task?.priority || 'Medium',
    assignedUser: task?.assignedUser?._id || '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await usersAPI.getAssignable();
        console.log('Users response:', response.data);
        setUsers(response.data);
        // If editing and no assignedUser set, set to current task's assigned user
        if (task && !formData.assignedUser) {
          setFormData(prev => ({ ...prev, assignedUser: task.assignedUser._id }));
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please refresh the page.');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (task) {
        // Update existing task
        const response = await tasksAPI.update(task._id, formData);
        onTaskCreated(response.data);
      } else {
        // Create new task
        const response = await tasksAPI.create(formData);
        onTaskCreated(response.data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="input-field mt-1"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority *
              </label>
              <select
                name="priority"
                id="priority"
                required
                value={formData.priority}
                onChange={handleChange}
                className="input-field mt-1"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="assignedUser" className="block text-sm font-medium text-gray-700">
              Assign to User *
            </label>
            <select
              name="assignedUser"
              id="assignedUser"
              required
              value={formData.assignedUser}
              onChange={handleChange}
              disabled={usersLoading}
              className="input-field mt-1 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {usersLoading ? 'Loading users...' : 'Select a user'}
              </option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
