import { create } from 'zustand'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  column_id?: string
}

export interface Column {
  id: string
  title: string
  position: number
  tasks: Task[]
}

interface TaskStore {
  columns: Column[]
  loading: boolean
  setColumns: (columns: Column[]) => void
  setLoading: (loading: boolean) => void
  fetchData: () => Promise<void>
  addTask: (columnId: string, task: Omit<Task, 'id'>) => Promise<void>
  updateTask: (columnId: string, taskId: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (columnId: string, taskId: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  columns: [],
  loading: true,

  setColumns: (columns) => set({ columns }),
  setLoading: (loading) => set({ loading }),

  fetchData: async () => {
    set({ loading: true })
    try {
      // Fetch columns
      const colsRes = await fetch('/api/columns')
      const columnsData = await colsRes.json()
      
      // Fetch tasks
      const tasksRes = await fetch('/api/tasks')
      const tasksData = await tasksRes.json()
      
      // Organize tasks by column
      const columns = columnsData.map((col: any) => ({
        ...col,
        tasks: tasksData.filter((task: any) => task.column_id === col.id)
      }))
      
      set({ columns, loading: false })
    } catch (error) {
      console.error('Error fetching data:', error)
      set({ loading: false })
    }
  },

  addTask: async (columnId, task) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, column_id: columnId })
      })
      const newTask = await res.json()
      
      set((state) => ({
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      }))
    } catch (error) {
      console.error('Error adding task:', error)
    }
  },

  updateTask: async (columnId, taskId, updates) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      set((state) => ({
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
      }))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  },

  deleteTask: async (columnId, taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      
      set((state) => ({
        columns: state.columns.map(col =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
            : col
        )
      }))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  },
}))
