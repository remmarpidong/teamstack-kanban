import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface TaskStore {
  columns: Column[]
  setColumns: (columns: Column[]) => void
  addTask: (columnId: string, task: Omit<Task, 'id'>) => void
  updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => void
  deleteTask: (columnId: string, taskId: string) => void
}

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      { id: 't1', title: 'Research AI integration', priority: 'high', assignee: 'Marcus' },
      { id: 't2', title: 'Design mobile layout', priority: 'medium', assignee: 'Elena' },
      { id: 't3', title: 'Set up CI/CD pipeline', priority: 'low', assignee: 'Kevin' },
    ]
  },
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      { id: 't4', title: 'Create user authentication', priority: 'high', assignee: 'Kevin', dueDate: '2026-03-10' },
      { id: 't5', title: 'Design dashboard wireframes', priority: 'medium', assignee: 'Elena' },
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      { id: 't6', title: 'Build Kanban board UI', priority: 'high', assignee: 'Kevin', dueDate: '2026-03-08' },
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: [
      { id: 't7', title: 'Write API tests', priority: 'medium', assignee: 'Priya' },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      { id: 't8', title: 'Project setup', priority: 'low', assignee: 'Kevin' },
      { id: 't9', title: 'Design system tokens', priority: 'medium', assignee: 'Elena' },
    ]
  },
]

export const useTaskStore = create<TaskStore>((set) => ({
  columns: initialColumns,
  setColumns: (columns) => set({ columns }),
  addTask: (columnId, task) => set((state) => {
    const newTask: Task = { ...task, id: `t${Date.now()}` }
    return {
      columns: state.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    }
  }),
  updateTask: (columnId, taskId, updates) => set((state) => ({
    columns: state.columns.map(col =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }
        : col
    )
  })),
  deleteTask: (columnId, taskId) => set((state) => ({
    columns: state.columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
        : col
    )
  })),
}))
