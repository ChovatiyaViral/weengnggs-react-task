import { create } from 'zustand'

const initialProjects = [
  { id: 1, name: 'E-Commerce Platform', description: 'Online shopping platform with payment integration', status: 'In Progress', userId: 1 },
  { id: 2, name: 'Blog CMS', description: 'Content management system for blogging', status: 'Completed', userId: 2 },
  { id: 3, name: 'Task Manager', description: 'Project task tracking application', status: 'Planning', userId: 3 },
  { id: 4, name: 'Chat Application', description: 'Real-time messaging app with WebSocket', status: 'In Progress', userId: 4 },
  { id: 5, name: 'Portfolio Website', description: 'Personal portfolio with project showcase', status: 'Completed', userId: 5 },
]

const useProjectStore = create((set) => ({
  projects: initialProjects,

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, { ...project, id: Date.now() }],
    })),

  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
}))

export default useProjectStore
