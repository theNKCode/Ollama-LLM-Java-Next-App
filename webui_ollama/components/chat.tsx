'use client'

import { useState, useEffect } from "react"
import { Bot, Send, Plus, Search, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch('http://localhost:8080/ai/messages')
        const data = await response.json()
        console.log(data)  // Check the response structure

        // Adjust based on the actual response structure
        setMessages(data.messages || [])  // Make sure this matches the response format
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    fetchMessages()
  }, []) // Empty dependency array ensures this runs only on mount

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // Send message to API (similar to /ai/generate)
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await response.json()

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])  // Adjust if needed
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }


  return (
      <div className="flex h-screen bg-black text-white">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
          <Button variant="ghost" className="justify-start gap-2 mb-4">
            <Plus className="h-4 w-4" /> New Chat
          </Button>
          <Button variant="ghost" className="justify-start gap-2 mb-4">
            <Menu className="h-4 w-4" /> Workspace
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
            <Input
                placeholder="Search"
                className="pl-8 bg-gray-900 border-gray-800"
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                        "flex items-start gap-4 mb-4",
                        message.role === 'assistant' && "bg-gray-900 p-4 rounded-lg"
                    )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.role === 'assistant' ? "/bot-avatar.png" : "/user-avatar.png"} />
                    <AvatarFallback>{message.role === 'assistant' ? 'AI' : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {message.role === 'assistant' ? 'Assistant' : 'You'}
                    </div>
                    <div className="text-gray-200">{message.content}</div>
                  </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Bot className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={sendMessage} className="relative">
              <Input
                  placeholder="Send a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="pr-10 bg-gray-900 border-gray-800"
              />
              <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
            <div className="text-xs text-gray-400 mt-2 text-center">
              AI may make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
  )
}
