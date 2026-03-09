'use client'

import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Bot, User, Calendar, LogOut, Sparkles, X, Loader2 } from 'lucide-react'
// Simple version - no auth for now
// import { useSession, signIn, signOut } from 'next-auth/react'
import { TaskModal } from '@/components/TaskModal'
import { AIAssistModal } from '@/components/AIAssistModal'
import { useTaskStore, Task } from '@/lib/store'

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors[priority as keyof typeof colors]}`}>
      {priority}
    </span>
  )
}

function TaskCard({ task, index, onEdit, onDelete }: { task: Task; index: number; onEdit: () => void; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-2 group relative ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 pr-6">{task.title}</h4>
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal size={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                  <button
                    onClick={() => { onEdit(); setShowMenu(false); }}
                    className="w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowMenu(false); }}
                    className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PriorityBadge priority={task.priority} />
              {task.assignee && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={12} /> {task.assignee}
                </span>
              )}
            </div>
            {task.dueDate && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} /> {task.dueDate}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}

function Column({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: { 
  column: { id: string; title: string }; 
  tasks: Task[]; 
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {column.title}
          <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button 
          onClick={onAddTask}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-2 min-h-[500px] ${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default function KanbanPage() {
  // No auth for now - show kanban directly
  // const { data: session, status } = useSession()
  const { columns, loading, setColumns, fetchData, addTask, updateTask, deleteTask } = useTaskStore()
  
  const session = { user: { name: 'Demo User', image: null, email: 'demo@teamstack.ai' } }
  const status = "authenticated"
  
  // Fetch data from Supabase on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeColumnId, setActiveColumnId] = useState('backlog')

  // Real-time polling for updates (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch from API
      // For now, we use the store which persists in memory
      console.log('Polling for updates...')
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newColumns = [...columns]
    const sourceCol = newColumns.find(c => c.id === source.droppableId)
    const destCol = newColumns.find(c => c.id === destination.droppableId)
    if (!sourceCol || !destCol) return

    const [movedTask] = sourceCol.tasks.splice(source.index, 1)
    destCol.tasks.splice(destination.index, 0, movedTask)

// Force rebuild - remove drag and drop temporarily
// setColumns(newColumns)
  }

  const handleAddTask = (columnId: string) => {
    setActiveColumnId(columnId)
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    // Find which column the task is in
    const column = columns.find(c => c.tasks.some(t => t.id === task.id))
    if (column) {
      setActiveColumnId(column.id)
      setEditingTask(task)
      setIsModalOpen(true)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const column = columns.find(c => c.tasks.some(t => t.id === taskId))
    if (column && confirm('Are you sure you want to delete this task?')) {
      deleteTask(column.id, taskId)
    }
  }

  const handleSaveTask = (taskData: Omit<Task, 'id'> & { id?: string }) => {
    if (taskData.id) {
      // Update existing task
      const column = columns.find(c => c.tasks.some(t => t.id === taskData.id))
      if (column) {
        updateTask(column.id, taskData.id, taskData)
      }
    } else {
      // Create new task
      addTask(activeColumnId, taskData)
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleAIResponse = (response: string, suggestedTasks?: Task[]) => {
    // Add suggested tasks to backlog
    if (suggestedTasks && suggestedTasks.length > 0) {
      suggestedTasks.forEach(task => {
        addTask('backlog', task)
      })
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={20} />
          Loading...
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">TeamStack Kanban</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">AI-Powered Kanban Board for Modern Teams</p>
          <button
            onClick={() => console.log('sign in')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Sign in with GitHub
          </button>
          <p className="text-xs text-gray-400 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TeamStack Kanban</h1>
            <span className="text-sm text-gray-500">Sprint 1</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900">
                  {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-lg transition-all"
            >
              <Bot size={16} />
              AI Assist
            </button>
            <button 
              onClick={() => console.log('sign out')}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="p-6 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {columns.map(column => (
              <Column 
                key={column.id} 
                column={column} 
                tasks={column.tasks}
                onAddTask={() => handleAddTask(column.id)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        columnId={activeColumnId}
      />

      {/* AI Assist Modal */}
      <AIAssistModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onResponse={handleAIResponse}
        tasks={columns.flatMap(c => c.tasks)}
      />
    </div>
  )
}
