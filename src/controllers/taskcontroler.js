const pool = require('../config/db');
const { taskSchema } = require('../models/taskSchema');

const getAllTasks = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks ORDER BY createdAt DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const validatedData = taskSchema.parse(req.body);
        const { title, description, status, dueDate } = validatedData;
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, status, dueDate) VALUES (?, ?, ?, ?)',
            [title, description || null, status || 'pending', dueDate || null]
        );
        res.status(201).json({ id: result.insertId, ...validatedData });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = taskSchema.parse(req.body);
        const { title, description, status, dueDate } = validatedData;
        const [result] = await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ?, dueDate = ? WHERE id = ?',
            [title, description || null, status || 'pending', dueDate || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ id, ...validatedData });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };