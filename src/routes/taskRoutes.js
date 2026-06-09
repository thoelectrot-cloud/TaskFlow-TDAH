const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/tasksController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, getTasks);
router.post('/', verifyToken, addTask);
router.put('/:id', verifyToken, updateTask);
router.delete('/:id', verifyToken, deleteTask);

module.exports = router;