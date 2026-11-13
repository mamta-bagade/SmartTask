import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const loadProjects = () => {
    api.get("/projects")
       .then((res) => setProjects(res.data))
       .catch(() => alert("Failed to load projects."));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      setShowModal(false);
      loadProjects();
    } catch (err) {
      alert("Error creating project!");
    }
  };

  
  const handleDeleteProject = async (e, projectId) => {
    e.preventDefault(); 
    if (!window.confirm("Are you sure you want to delete this entire project? All tasks will be lost.")) return;
    
    try {
      await api.delete(`/projects/${projectId}`);
      loadProjects();
    } catch (err) {
      alert("Failed to delete project. You must be the owner.");
    }
  };

    

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Hi, {user?.username} 👋</h2>
        <button onClick={logout} className="btn-logout">Logout</button>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Your Projects ({projects.length})</h3>
        
        {user?.role === "MANAGER"  && (
          <button 
            onClick={() => setShowModal(true)} 
            style={{ background: "#007bff", color: "white", padding: "10px 15px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            + New Project
          </button>
        )}
      </div>
      
      <div className="project-grid" style={{ marginTop: "20px" }}>
        {projects.length === 0 && <p>No projects yet. Contact your manager to add you to a project.</p>}
        
        {projects.map((p) => (
          <Link to={`/projects/${p.id}`} key={p.id} style={{ textDecoration: "none", color: "inherit" }}>
            <div className="project-card" style={{ position: "relative" }}>
              
              
              {p.ownerName === user?.username && (
                <button 
                  onClick={(e) => handleDeleteProject(e, p.id)}
                  style={{ position: "absolute", top: "15px", right: "15px", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "5px", padding: "5px 8px", cursor: "pointer" }}
                  title="Delete Project"
                >
                  🗑️
                </button>
              )}

              <h4 style={{ paddingRight: "30px" }}>{p.name}</h4>
              <p style={{color: "gray", fontSize: "14px"}}>{p.description}</p>
              <small>Created: {p.createdAt}</small>
            </div>
          </Link>
        ))}
      </div>

 
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "10px", width: "400px" }}>
            <h3 style={{ marginTop: 0 }}>Create New Project</h3>
            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                type="text" 
                placeholder="Project Name" 
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
              <textarea 
                placeholder="Description (optional)" 
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                rows="3"
              />
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "10px", background: "#ccc", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}