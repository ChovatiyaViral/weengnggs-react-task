import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { fetchUsers } from '../api/userApi'
import useUserStore from '../store/userStore'
import useProjectStore from '../store/projectStore'

export default function Users() {
  const { data: apiUsers = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const { users, setUsers, updateUser, deleteUser } = useUserStore()
  const projects = useProjectStore((s) => s.projects)
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [drawerUser, setDrawerUser] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [inlineEditId, setInlineEditId] = useState(null)
  const [inlineData, setInlineData] = useState({})

  useEffect(() => {
    if (apiUsers.length > 0 && users.length === 0) {
      setUsers(apiUsers)
    }
  }, [apiUsers, users.length, setUsers])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  // Get user IDs that belong to the selected project
  const getUserIdsForProject = (projectId) => {
    if (!projectId) return null
    const project = projects.find((p) => p.id === Number(projectId))
    return project ? project.userId : null
  }

  const filteredUsers = users
    .filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.company.name.toLowerCase().includes(search.toLowerCase())

      const assignedUserId = getUserIdsForProject(projectFilter)
      const matchesProject = !projectFilter || u.id === assignedUserId

      return matchesSearch && matchesProject
    })
    .sort((a, b) => {
      let aVal = sortKey === 'company' ? a.company.name : a[sortKey]
      let bVal = sortKey === 'company' ? b.company.name : b[sortKey]
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
      if (sortDir === 'asc') return aVal < bVal ? -1 : 1
      return aVal > bVal ? -1 : 1
    })

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id)
    deleteUser(id)
    toast.error(`User "${user?.name}" has been deleted!`)
    setDeleteConfirm(null)
  }

  const handleDrawerSave = () => {
    updateUser(drawerUser.id, drawerUser)
    toast.info(`User "${drawerUser.name}" has been updated!`)
    setDrawerUser(null)
  }

  const startInlineEdit = (user) => {
    setInlineEditId(user.id)
    setInlineData({ name: user.name, email: user.email, company: user.company.name })
  }

  const saveInlineEdit = (id) => {
    updateUser(id, { name: inlineData.name, email: inlineData.email, company: { name: inlineData.company } })
    toast.info(`User "${inlineData.name}" has been updated!`)
    setInlineEditId(null)
  }

  if (isLoading) return <div className="loading">Loading users...</div>

  return (
    <div className="users-page">
      <h2>User Management</h2>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortKey === 'email' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('company')} className="sortable">
                Company {sortKey === 'company' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                {inlineEditId === user.id ? (
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
                        value={inlineData.email}
                        onChange={(e) => setInlineData({ ...inlineData, email: e.target.value })}
                        className="inline-input"
                      />
                    </td>
                    <td>
                      <input
                        value={inlineData.company}
                        onChange={(e) => setInlineData({ ...inlineData, company: e.target.value })}
                        className="inline-input"
                      />
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-success" onClick={() => saveInlineEdit(user.id)}>Save</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setInlineEditId(null)}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.company.name}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-primary" onClick={() => startInlineEdit(user)} title="Inline Edit">✏️</button>
                        <button className="btn btn-sm btn-info" onClick={() => setDrawerUser({ ...user })} title="Edit in Drawer">📝</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(user.id)} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && <p className="no-data">No users found.</p>}

      {/* Side Drawer */}
      {drawerUser && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawerUser(null)} />
          <div className="drawer open">
            <div className="drawer-header">
              <h3>Edit User</h3>
              <button className="close-btn" onClick={() => setDrawerUser(null)}>✕</button>
            </div>
            <div className="drawer-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  value={drawerUser.name}
                  onChange={(e) => setDrawerUser({ ...drawerUser, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  value={drawerUser.email}
                  onChange={(e) => setDrawerUser({ ...drawerUser, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  value={drawerUser.company.name}
                  onChange={(e) => setDrawerUser({ ...drawerUser, company: { ...drawerUser.company, name: e.target.value } })}
                />
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
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
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
