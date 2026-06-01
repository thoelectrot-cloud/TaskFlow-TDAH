const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;