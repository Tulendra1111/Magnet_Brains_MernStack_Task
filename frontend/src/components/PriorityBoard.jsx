import React from 'react';
import TaskCard from './TaskCard';

const PriorityBoard = ({
  tasks,
  onTaskUpdated,
  onTaskDeleted,
  onStatusUpdate,
}) => {
  const getPriorityTasks = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-red-200 bg-red-50';
      case 'Medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'Low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityTitleColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-800';
      case 'Medium':
        return 'text-yellow-800';
      case 'Low':
        return 'text-green-800';
      default:
        return 'text-gray-800';
    }
  };

  const priorities = [
    { key: 'Low', label: 'Low Priority' },
    { key: 'Medium', label: 'Medium Priority' },
    { key: 'High', label: 'High Priority' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {priorities.map(({ key, label }) => {
        const priorityTasks = getPriorityTasks(key);
        
        return (
          <div
            key={key}
            className={`rounded-lg border-2 ${getPriorityColor(key)}`}
          >
            <div className="p-4 border-b border-current border-opacity-20">
              <h3 className={`text-lg font-semibold ${getPriorityTitleColor(key)}`}>
                {label}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {priorityTasks.length} task{priorityTasks.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-4 space-y-4 min-h-[400px]">
              {priorityTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No tasks in this priority</p>
                </div>
              ) : (
                priorityTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {task.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                      <div>Assigned to: {task.assignedUser.name}</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onStatusUpdate(task._id, task.status === 'Pending' ? 'Completed' : 'Pending')}
                        className={`flex-1 text-xs px-3 py-1 rounded-md font-medium ${
                          task.status === 'Completed'
                            ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {task.status === 'Completed' ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                      
                      <button
                        onClick={() => onTaskDeleted(task._id)}
                        className="text-xs px-3 py-1 text-red-700 bg-red-100 hover:bg-red-200 rounded-md font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriorityBoard;
