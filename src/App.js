import { useEffect, useState } from "react";
import { useRef } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const inputRef = useRef();
  const [filter, setFilter] = useState("all");
  const [isEditing , setIsEditing] = useState(false);
  const [editingId , setEditingId] = useState(null);

  useEffect(() => {
    const tasksget = localStorage.getItem("tasks");
    if (tasksget) {
      setTasks(JSON.parse(tasksget));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addNewTasks() {
    const text = inputRef.current.value.trim();
 if (!text) {
      alert("Please enter a task");
      return ;
    }

    if(isEditing){
      setTasks(tasks.map((task) => {
        if(task.id == editingId){
          return { ...task, value:text}
        }
        return task;
      }))
      inputRef.current.value = "";
      setIsEditing(false);
      setEditingId(null);
      return
    }else{
    const newtask = {
      id: Date.now(),
      value: text,
      done: false,
    };
    setTasks([...tasks, newtask]);
  }
   
    inputRef.current.value = "";
  }
  const ToggleVisibility = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id == id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id != id));
  };
  const filteredTasks = tasks.filter((task) => {
    if (filter == "completed") return task.done;
    if (filter === "pending") return !task.done;
    return true;
  });

  ////////////////////////////////////////
  return (
    <div>
      <div className="navbar">
        <h1 className="heading">Todo List</h1>
        <div className="filter-options">
          <button className="filter-all" onClick={() => setFilter("all")}>
            All
          </button>
          <button
            className="filter-completed"
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className="filter-pending"
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
        </div>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter your task..."
          ref={inputRef}
        ></input>
        <button className="add-task" onClick={addNewTasks}>
          {isEditing ? "Update" : "Add Task"}
        </button>
      </div>
      <div className="task-container">
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item"
            
            onDoubleClick={() => { inputRef.current.value = task.value;
                setIsEditing(true);
                setEditingId(task.id);

              } }>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => ToggleVisibility(task.id)}
              />
              <span
                style={{ textDecoration: task.done ? "line-through" : "none" }}
              className = "text-task" >
                {task.value}
              </span>
              <span>
                <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default App;
