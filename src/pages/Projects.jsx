import { useState } from 'react'
import { toast } from 'react-toastify'
import useProjectStore from '../store/projectStore'

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore()
  const [form, setForm] = useState({ name: '', description: '', status: 'Planning' })
  const [drawerProject, setDrawerProject] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [inlineEditId, setInlineEditId] = useState(null)
  const [inlineData, setInlineData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim()) return
    addProject(form)
    toast.success(`Project "${form.name}" has been added!`)
    setForm({ name: '', description: '', status: 'Planning' })
  }

  const handleDelete = (id) => {
    const project = projects.find((p) => p.id === id)
    deleteProject(id)
    toast.error(`Project "${project?.name}" has been deleted!`)
    setDeleteConfirm(null)
  }

  const handleDrawerSave = () => {
    updateProject(drawerProject.id, drawerProject)
    toast.info(`Project "${drawerProject.name}" has been updated!`)
    setDrawerProject(null)
  }

  const startInlineEdit = (project) => {
    setInlineEditId(project.id)
    setInlineData({ name: project.name, description: project.description, status: project.status })
  }

  const saveInlineEdit = (id) => {
    updateProject(id, inlineData)
    toast.info(`Project "${inlineData.name}" has been updated!`)
    setInlineEditId(null)
  }

  return (
    <div className="projects-page">
      <h2>Project Management</h2>

      {/* Add Project Form */}
      <div className="card form-card">
        <h3>Create New Project</h3>
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="proj-name">Project Name</label>
              <input
                id="proj-name"
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj-status">Status</label>
              <select
                id="proj-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="proj-desc">Description</label>
            <textarea
              id="proj-desc"
              placeholder="Enter project description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Project</button>
        </form>
      </div>

      {/* Projects List */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                {inlineEditId === project.id ? (
                  <>
                    <td>
                      <input
                        value={inlineData.name}
                        onChange={(e) => setInlineData({ ...inlineData, name: e.target.value })}
                        className="inline-input"
                      />
                    </td>
                    <td>
                      <input
                        value={inlineData.description}
                        onChange={(e) => setInlineData({ ...inlineData, description: e.target.value })}
                        className="inline-input"
                      />
                    </td>
                    <td>
                      <select
                        value={inlineData.status}
                        onChange={(e) => setInlineData({ ...inlineData, status: e.target.value })}
                        className="inline-input"
                      >
                        <option>Planning</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-success" onClick={() => saveInlineEdit(project.id)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setInlineEditId(null)}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{project.name}</td>
                    <td>{project.description}</td>
                    <td>
                      <span className={`badge badge-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-primary" onClick={() => startInlineEdit(project)} title="Inline Edit">✏️</button>
                        <button className="btn btn-sm btn-info" onClick={() => setDrawerProject({ ...project })} title="Edit in Drawer">📝</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(project.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {projects.length === 0 && <p className="no-data">No projects yet. Create one above.</p>}

      {/* Side Drawer */}
      {drawerProject && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerProject(null)} />
          <div className="drawer open">
            <div className="drawer-header">
              <h3>Edit Project</h3>
              <button className="close-btn" onClick={() => setDrawerProject(null)}>✕</button>
            </div>
            <div className="drawer-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={drawerProject.name}
                  onChange={(e) => setDrawerProject({ ...drawerProject, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={drawerProject.description}
                  onChange={(e) => setDrawerProject({ ...drawerProject, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={drawerProject.status}
                  onChange={(e) => setDrawerProject({ ...drawerProject, status: e.target.value })}
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleDrawerSave}>Save Changes</button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
