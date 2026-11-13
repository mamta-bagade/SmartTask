import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const COLUMNS = [
  { key: "TODO", label: "To Do", color: "#f59e0b" },
  { key: "IN_PROGRESS", label: "Doing", color: "#3b82f6" },
  { key: "DONE", label: "Done", color: "#10b981" },
];

export default function ProjectBoard() {
  const { id } = useParams();
  const { user } = useAuth(); // Current logged-in user

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  
  // Task states
  const [title, setTitle] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");

  const loadData = async () => {
    try {
      const pRes = await api.get(`/projects`);
      const currentProject = pRes.data.find((p) => p.id === Number(id));
      if (currentProject) setProject(currentProject);

      const tRes = await api.get(`/tasks?projectId=${id}`);
      setTasks(tRes.data);

      const mRes = await api.get(`/projects/${id}/members`);
      setMembers(mRes.data);
    } catch (err) {
      console.log("Error loading data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await api.post("/tasks", { 
      title, 
      projectId: Number(id), 
      status: "TODO",
      assignedToId: assignedToId ? Number(assignedToId) : null
    });
    setTitle("");
    setAssignedToId("");
    loadData();
  };

  const moveTask = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    loadData();
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    await api.delete(`/tasks/${taskId}`);
    loadData();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail("");
      loadData();
    } catch (err) {
      setMemberError(err.response?.data?.error || "Failed to add member. User must be registered first.");
    }
  };

  if (!project) return <h3 style={{ padding: "30px" }}>Loading...</h3>;

 
  const isManager = project.ownerName === user?.username;

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#3b82f6", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "5px" }}>
        ← Back to Dashboard
      </Link>
      
      <div style={{ marginTop: "20px", marginBottom: "30px", borderBottom: "2px solid #e5e7eb", paddingBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>📁 {project.name}</h1>
          <p style={{ color: "#6b7280", marginTop: "5px" }}>{project.description}</p>
        </div>
        
        
        {isManager && (
          <button 
            onClick={() => setShowMemberModal(true)}
            style={{ background: "#10b981", color: "white", padding: "10px 15px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
          >
            👥 Add Member
          </button>
        )}
      </div>

      
      {isManager && (
        <form onSubmit={addTask} style={{ marginBottom: "30px", display: "flex", gap: "10px", background: "white", padding: "15px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: "12px", flex: "2", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
          />
          
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            style={{ padding: "12px", flex: "1", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none", background: "#f9fafb" }}
          >
            <option value="">Assign to... (Optional)</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.username}</option>
            ))}
          </select>

          <button type="submit" style={{ padding: "12px 25px", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            + Add
          </button>
        </form>
      )}

     
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {COLUMNS.map((col) => (
          <div key={col.key} style={{ flex: 1, background: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", minHeight: "400px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: 0, marginBottom: "20px", color: "#374151" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: col.color, display: "inline-block" }}></span>
              {col.label}
              <span style={{ background: "#e5e7eb", padding: "2px 8px", borderRadius: "12px", fontSize: "14px" }}>
                {tasks.filter((t) => t.status === col.key).length}
              </span>
            </h3>
            
            {tasks
              .filter((t) => t.status === col.key)
              .map((task) => (
                <div key={task.id} style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", borderLeft: `4px solid ${col.color}` }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>{task.title}</h4>
                  
                  {task.assignedToName && (
                    <span style={{ display: "inline-block", background: "#e0e7ff", color: "#4338ca", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", marginBottom: "10px", fontWeight: "bold" }}>
                      👤 {task.assignedToName}
                    </span>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <select
                      value={task.status}
                      onChange={(e) => moveTask(task.id, e.target.value)}
                      style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #d1d5db", background: "#f9fafb" }}
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                    
                    
                    {isManager && (
                      <button onClick={() => deleteTask(task.id)} style={{ padding: "8px 12px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer" }}>🗑️</button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {showMemberModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "400px" }}>
            <h3 style={{ marginTop: 0 }}>👥 Add Team Member</h3>
            <p style={{ fontSize: "14px", color: "gray" }}>Member cha registered email taka.</p>
            {memberError && <p style={{ color: "red", fontSize: "14px" }}>{memberError}</p>}
            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                type="email" 
                placeholder="member@email.com" 
                className="input-field"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)} 
                required 
              />
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowMemberModal(false)} style={{ padding: "10px", background: "#ccc", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px", background: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}