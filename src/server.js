require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken'); 

// Database and Routes
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. SECURITY & MIDDLEWARE
// ==========================================
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// Logger to track incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// ==========================================
// 2. BASE ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ==========================================
// 3. CUSTOM INLINE ROUTES
// ==========================================

// A. Profile Update Route 
app.put('/api/profile', async (req, res) => {
    const { first_name, last_name, email, bio } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId; 
        await pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ?, bio = ? WHERE id = ?',
            [first_name, last_name, email, bio, userId]
        );
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// B. Notifications Auto-Save Route 
app.put('/api/notifications', async (req, res) => {
    const { email_notifications, push_notifications, task_reminders, weekly_digest } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        await pool.query(
            'UPDATE users SET email_notifications = ?, push_notifications = ?, task_reminders = ?, weekly_digest = ? WHERE id = ?',
            [email_notifications, push_notifications, task_reminders, weekly_digest, userId]
        );
        res.status(200).json({ message: "Notifications auto-saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notifications" });
    }
});

// C. Fetch Profile Route 
app.get('/api/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        const [rows] = await pool.query(
            'SELECT first_name, last_name, email, bio, email_notifications, push_notifications, task_reminders, weekly_digest FROM users WHERE id = ?',
            [userId]
        );
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

// D. Kanban Status Update Route
app.put('/api/tasks/:id/status', async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body; 
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        await pool.query('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, taskId, userId]);
        res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task status" });
    }
});

// E. Kanban Delete Task Route (NEW 🔥)
app.delete('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;
        await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
        res.status(200).json({ message: "Task deleted permanently" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// ==========================================
// 4. SYSTEM ROUTES & ERROR HANDLING
// ==========================================
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'TaskFlow API and Database are Online', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.use((err, req, res, next) => {
    console.error("Global Error Caught:", err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});