require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Database and Routes
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
});
app.use('/api/', limiter);

// 2. Routes
app.use('/api/auth', authRoutes);
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/api/tasks', taskRoutes);

// 3. Health Check
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'TaskFlow API and Database are Online', timestamp: new Date() });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// 4. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// 5. Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Put this in your server.js/index.js file
app.put('/api/profile', async (req, res) => {
    const { display_name, role, bio } = req.body;
    const userId = req.headers.authorization?.split(' ')[1]; // Quick check for user ID

    try {
        await pool.query(
            'UPDATE users SET display_name = ?, role = ?, bio = ? WHERE id = ?',
            [display_name, role, bio, userId]
        );
        res.status(200).json({ message: "Saved!" });
    } catch (error) {
        res.status(500).json({ error: "Failed" });
    }
});
// Profile Update Route (Fixed)
app.put('/api/profile', async (req, res) => {
    const { first_name, last_name, bio } = req.body;
    
    // 1. Grab the token sent from your frontend
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        // 2. Decode it right here (no missing imports)
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId; 

        // 3. Save to database
        await pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, bio = ? WHERE id = ?',
            [first_name, last_name, bio, userId]
        );
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});
// KANBAN: Update Task Status via Drag-and-Drop
app.put('/api/tasks/:id/status', async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body; // 'pending', 'in-progress', or 'completed'
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded.userId;

        // Update the task status in the database
        await pool.query(
            'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
            [status, taskId, userId]
        );
        
        res.status(200).json({ message: "Task status updated successfully" });
    } catch (error) {
        console.error("Status update error:", error);
        res.status(500).json({ error: "Failed to update task status" });
    }
});