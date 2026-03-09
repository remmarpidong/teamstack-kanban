'use client'

import { useState, useEffect } from 'react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Task {
  id: string
  title: string
  column_id: string
  priority: string
}

interface Column {
  id: string
  title: string
}

export default function Home() {
  const [columns, setColumns] = useState<Column[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      const [colsRes, tasksRes] = await Promise.all([
        fetch('/api/columns'),
        fetch('/api/tasks')
      ])
      const colsData = await colsRes.json()
      const tasksData = await tasksRes.json()
      setColumns(colsData)
      setTasks(tasksData)
    } catch (e) {
      console.error('Error:', e)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch + poll every 10 seconds
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Real-time every 10s
    return () => clearInterval(interval)
  }, [])

  const getTasksForColumn = (columnId: string) => 
    tasks.filter(t => t.column_id === columnId)

  const priorityColor = (p: string) => {
    if (p === 'high') return { bg: '#fee2e2', color: '#991b1b' }
    if (p === 'medium') return { bg: '#fef3c7', color: '#92400e' }
    return { bg: '#f3f4f6', color: '#374151' }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>TeamStack Kanban</h1>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>🔄 Auto-refreshes every 10s</span>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        {columns.map((col) => (
          <div key={col.id} style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px', minWidth: '250px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>{col.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {getTasksForColumn(col.id).map((task) => {
                const colors = priorityColor(task.priority)
                return (
                  <div key={task.id} style={{ background: 'white', padding: '12px', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '500' }}>{task.title}</p>
                    <span style={{ fontSize: '12px', background: colors.bg, color: colors.color, padding: '2px 8px', borderRadius: '4px' }}>
                      {task.priority}
                    </span>
                  </div>
                )
              })}
              {getTasksForColumn(col.id).length === 0 && (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
