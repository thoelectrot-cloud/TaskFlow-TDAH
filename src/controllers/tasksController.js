const pool = require('../config/db');

const getTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.userId]);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const addTask = async (req, res) => {
    const { title, description, assignee } = req.body; // Capture the name
    try {
        // Save the name into the assignee column
        const [result] = await pool.query(
            'INSERT INTO tasks (user_id, title, description, assignee) VALUES (?, ?, ?, ?)', 
            [req.userId, title, description, assignee]
        );
        res.status(201).json({ id: result.insertId, title, description, assignee });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
};

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, id, req.userId]);
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.userId]);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };