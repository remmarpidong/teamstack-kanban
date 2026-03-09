import { cookies } from 'next/headers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getColumns() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return []
  }
  
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/columns?select=*&order=position`, {
      headers: { 
        'apikey': supabaseKey, 
        'Authorization': `Bearer ${supabaseKey}` 
      },
      cache: 'no-store'
    })
    return await res.json()
  } catch (e) {
    console.error('Error:', e)
    return []
  }
}

async function getTasks() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return []
  }
  
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/tasks?select=*`, {
      headers: { 
        'apikey': supabaseKey, 
        'Authorization': `Bearer ${supabaseKey}` 
      },
      cache: 'no-store'
    })
    return await res.json()
  } catch (e) {
    console.error('Error:', e)
    return []
  }
}

export default async function KanbanPage() {
  const columnsData = await getColumns()
  const tasksData = await getTasks()
  
  // Group tasks by column
  const columns = columnsData.map((col: any) => ({
    ...col,
    tasks: tasksData.filter((task: any) => task.column_id === col.id)
  }))
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <h1 className="text-2xl font-bold mb-6">TeamStack Kanban</h1>
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((col: any) => (
          <div key={col.id} className="flex-shrink-0 w-72 bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold mb-3">{col.title}</h3>
            <div className="space-y-2">
              {col.tasks.map((task: any) => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                  <p className="font-medium">{task.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {col.tasks.length === 0 && (
                <p className="text-gray-400 text-sm">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
