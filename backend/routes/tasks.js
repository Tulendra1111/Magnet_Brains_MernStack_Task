const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, priority, assignedUser } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Regular users can only see their assigned tasks
    if (req.user.role !== 'admin') {
      filter.assignedUser = req.user._id;
    } else if (assignedUser) {
      filter.assignedUser = assignedUser;
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const tasks = await Task.find(filter)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Task.countDocuments(filter);
    
    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Regular users can only view their assigned tasks
    if (req.user.role !== 'admin' && task.assignedUser._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').trim().isLength({ min: 1 }).withMessage('Description is required'),
  body('dueDate').isISO8601().withMessage('Please enter a valid due date'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('assignedUser').isMongoId().withMessage('Please select a valid user')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, priority, assignedUser } = req.body;
    
    // Check if assigned user exists
    const user = await User.findById(assignedUser);
    if (!user) {
      return res.status(400).json({ message: 'Assigned user not found' });
    }
    
    // Regular users can only assign tasks to themselves
    if (req.user.role !== 'admin' && assignedUser !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only assign tasks to yourself' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      assignedUser,
      createdBy: req.user._id
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('Title cannot be empty'),
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Description cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Please enter a valid due date'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('status').optional().isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed'),
  body('assignedUser').optional().isMongoId().withMessage('Please select a valid user')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check permissions
    const isAssignedUser = task.assignedUser.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isAssignedUser && !isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Regular users can only update status and basic fields, not assignedUser
    if (req.user.role !== 'admin' && req.body.assignedUser) {
      delete req.body.assignedUser;
    }
    
    // Check if assigned user exists (if being changed)
    if (req.body.assignedUser) {
      const user = await User.findById(req.body.assignedUser);
      if (!user) {
        return res.status(400).json({ message: 'Assigned user not found' });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedUser', 'name email')
     .populate('createdBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check permissions
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.patch('/:id/status', auth, [
  body('status').isIn(['Pending', 'Completed']).withMessage('Status must be Pending or Completed')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check permissions
    const isAssignedUser = task.assignedUser.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isAssignedUser && !isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = req.body.status;
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email');

    res.json(populatedTask);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks by priority
router.get('/priority/:priority', auth, async (req, res) => {
  try {
    const { priority } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { priority };
    
    // Regular users can only see their assigned tasks
    if (req.user.role !== 'admin') {
      filter.assignedUser = req.user._id;
    }
    
    const tasks = await Task.find(filter)
      .populate('assignedUser', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Task.countDocuments(filter);
    
    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTasks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get tasks by priority error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
