import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;

    const newTask = {
      text,
      priority,
      dueDate,
      completed: false,
    };

    console.log("📌 New Task:", newTask);

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    const savedTask = await res.json();
    setTasks([...tasks, savedTask]);
    setText("");
    setPriority("Low");
    setDueDate("");
  };

  const toggleTask = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t._id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="app">
      <h1>✅ MERN To-Do</h1>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New task"
        />

        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="Low">🟢 Low</option>
          <option value="Medium">🟡 Medium</option>
          <option value="High">🔴 High</option>
        </select>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className={`task ${task.completed ? "completed" : ""}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id, task.completed)}
            />

            <span>{task.text}</span>
            <span className={`priority ${task.priority?.toLowerCase() || "low"}`}>
              {task.priority || "Low"}
            </span>
            <span className="due-date">
              {task.dueDate ? new Date(task.dueDate).toLocaleString() : ""}
            </span>

            <button className="delete-btn" onClick={() => deleteTask(task._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
