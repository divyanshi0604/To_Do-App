router.post("/tasks", async (req, res) => {
  try {
    const { text, priority, dueDate } = req.body;
    const task = new Task({
      text,
      priority: priority || "Low",
      dueDate: dueDate || null
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
