require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const taskRoutes = require('./routes/taskRoutes');


const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// 1. Security Headers
app.use(helmet());

// 2. Rate Limiting (Prevent spamming your API)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per window
});
app.use('/api/', limiter);
// ... existing app usage
app.use('/api/tasks', taskRoutes);
// ... other requires
app.use('/api/tasks', taskRoutes);

app.use(cors());
app.use(express.json());

// This line is the bridge! 
app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'TaskFlow API and Database are Online' });
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'API Online', timestamp: new Date() });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});