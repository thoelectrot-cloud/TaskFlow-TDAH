const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// 1. Fetch All Tasks
router.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    const [rows] = await pool.query("SELECT * FROM tasks WHERE user_id = ?", [
      userId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// 2. Create a Task (Now includes Category & Due Date)
router.post("/", async (req, res) => {
  const { title, description, assignee, category, due_date } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    // Find your POST route and update the query line to this:
    await pool.query(
      "INSERT INTO tasks (title, description, assignee, category, due_date, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        assignee,
        category || "General",
        due_date || null,
        userId,
        "pending",
      ],
    );
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// 3. Delete Task
router.delete("/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [
      req.params.id,
      decoded.id || decoded.userId,
    ]);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
