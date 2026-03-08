'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Bot, User, Calendar } from 'lucide-react'

// Types
interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

// Initial data
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

function TaskCard({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-2 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={14} />
            </button>
          </div>
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

function Column({ column, tasks }: { column: Column; tasks: Task[] }) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          {column.title}
          <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
        <button className="text-gray-400 hover:text-gray-600">
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
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default function KanbanPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)

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

    setColumns(newColumns)
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
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                E
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                K
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                P
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg">
              <Bot size={16} />
              AI Assist
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="p-6 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4">
            {columns.map(column => (
              <Column key={column.id} column={column} tasks={column.tasks} />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}
