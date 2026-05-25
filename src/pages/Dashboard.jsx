import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/userApi'
import useProjectStore from '../store/projectStore'

export default function Dashboard() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  const projects = useProjectStore((s) => s.projects)

  const stats = [
    { label: 'Total Users', value: users.length, icon: '👥', color: '#3b82f6' },
    { label: 'Total Projects', value: projects.length, icon: '📁', color: '#10b981' },
    { label: 'Active Projects', value: projects.filter((p) => p.status === 'In Progress').length, icon: '🔄', color: '#f59e0b' },
    { label: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, icon: '✅', color: '#8b5cf6' },
  ]

  if (isLoading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h3>Recent Users</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.company.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h3>Recent Projects</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>
                      <span className={`badge badge-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
