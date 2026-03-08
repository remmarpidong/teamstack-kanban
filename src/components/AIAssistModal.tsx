'use client'

import { useState } from 'react'
import { X, Send, Sparkles, Loader2, Lightbulb, ArrowRight } from 'lucide-react'
import { Task } from '@/lib/store'

interface AIAssistModalProps {
  isOpen: boolean
  onClose: () => void
  onResponse: (response: string, suggestedTasks?: Task[]) => void
  tasks: Task[]
}

const SUGGESTIONS = [
  "What tasks should I prioritize?",
  "Suggest tasks for this sprint",
  "Find overdue tasks",
  "Summarize my workload",
]

export function AIAssistModal({ isOpen, onClose, onResponse, tasks }: AIAssistModalProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      // Simulate AI response (in production, this would call OpenClaw API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      let response = ''
      const lowerInput = userMessage.toLowerCase()

      if (lowerInput.includes('prioritize') || lowerInput.includes('priority')) {
        const highPriority = tasks.filter(t => t.priority === 'high')
        response = `You have ${highPriority.length} high-priority tasks:\n\n${highPriority.map(t => `• ${t.title} (${t.assignee || 'Unassigned'})`).join('\n')}\n\nI recommend focusing on these first.`
      } else if (lowerInput.includes('suggest') || lowerInput.includes('sprint')) {
        const suggested: Task[] = [
          { id: 'ai-1', title: 'Review PRs pending', priority: 'high', assignee: undefined },
          { id: 'ai-2', title: 'Update documentation', priority: 'medium', assignee: undefined },
          { id: 'ai-3', title: 'Refactor auth module', priority: 'low', assignee: undefined },
        ]
        setSuggestedTasks(suggested)
        response = `Based on your current board, here are some tasks I suggest adding to your backlog:\n\n${suggested.map(t => `• ${t.title} (${t.priority} priority)`).join('\n')}\n\nWould you like me to add these to your board?`
      } else if (lowerInput.includes('overdue')) {
        const today = new Date().toISOString().split('T')[0]
        const overdue = tasks.filter(t => t.dueDate && t.dueDate < today)
        if (overdue.length === 0) {
          response = "Great news! You don't have any overdue tasks."
        } else {
          response = `You have ${overdue.length} overdue tasks:\n\n${overdue.map(t => `• ${t.title} (due: ${t.dueDate})`).join('\n')}`
        }
      } else if (lowerInput.includes('summarize') || lowerInput.includes('workload')) {
        const byStatus = {
          backlog: tasks.filter(t => { const col = tasks.find(() => false); return true; }).length,
          todo: tasks.filter(t => t.assignee === 'Kevin').length,
          inProgress: tasks.filter(t => t.priority === 'high').length,
        }
        response = `Your workload summary:\n\n• ${tasks.length} total tasks\n• ${tasks.filter(t => t.priority === 'high').length} high priority\n• ${tasks.filter(t => t.assignee).length} assigned to you\n\nYou're doing great!`
      } else {
        response = `I understand you're asking about "${userMessage}". \n\nAs your AI assistant, I can help you with:\n• Prioritizing tasks\n• Suggesting tasks for sprints\n• Finding overdue work\n• Summarizing your workload\n\nTry asking one of these!`
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }])
      onResponse(response, suggestedTasks)
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleAddSuggested = () => {
    if (suggestedTasks.length > 0) {
      onResponse('Added suggested tasks to backlog', suggestedTasks)
      setSuggestedTasks([])
      setMessages(prev => [...prev, { role: 'ai', content: 'Added 3 suggested tasks to your backlog!' }])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">AI Assist</h2>
              <p className="text-xs text-gray-500">Powered by OpenClaw</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">How can I help you today?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Tasks */}
        {suggestedTasks.length > 0 && !isLoading && (
          <div className="px-4 pb-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={14} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Suggested Tasks</span>
              </div>
              <div className="space-y-1 mb-2">
                {suggestedTasks.map(task => (
                  <div key={task.id} className="text-sm text-blue-800 dark:text-blue-200">
                    • {task.title} ({task.priority})
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddSuggested}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                Add to Board <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
