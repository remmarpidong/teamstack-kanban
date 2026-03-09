// API for AI Agents to manage tasks
// Agents can call these endpoints to add/update tasks

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: Request) {
  const body = await request.json()
  const { action, task, taskId, updates } = body

  try {
    switch (action) {
      case 'create':
        const { data: newTask, error: createError } = await supabase
          .from('tasks')
          .insert(task)
          .select()
          .single()
        
        if (createError) throw createError
        return Response.json({ success: true, task: newTask })

      case 'update':
        const { data: updatedTask, error: updateError } = await supabase
          .from('tasks')
          .update(updates)
          .eq('id', taskId)
          .select()
          .single()
        
        if (updateError) throw updateError
        return Response.json({ success: true, task: updatedTask })

      case 'delete':
        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
        
        if (deleteError) throw deleteError
        return Response.json({ success: true })

      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}

// GET - Fetch all tasks (for polling)
export async function GET() {
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) return Response.json({ error: String(error) }, { status: 500 })
  return Response.json(tasks)
}
