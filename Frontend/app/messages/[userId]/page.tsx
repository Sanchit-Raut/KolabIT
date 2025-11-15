"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { messageApi, userApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Send, ArrowLeft, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { User } from "@/lib/types"

interface Message {
  id: string
  content: string
  senderId: string
  recipientId: string
  createdAt: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  recipient: {
    id: string
    name: string
    avatar?: string
  }
}

export default function MessagesPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const userId = params.userId as string

  console.log("========== MESSAGES PAGE LOADED ==========")
  console.log("Current logged-in user:", user)
  console.log("User ID from auth context:", user?.id)
  console.log("User name:", user?.firstName, user?.lastName)
  console.log("Viewing conversation with userId:", userId)
  console.log("==========================================")

  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login")
      return
    }
    
    if (!user) return // Still loading
    
    // Verify we have the correct logged-in user
    console.log("=== Current Session ===")
    console.log("Logged in as:", user.firstName, user.lastName)
    console.log("My user ID:", user.id)
    console.log("Viewing conversation with:", userId)
    console.log("=====================")
    
    fetchMessages()
    fetchUserProfile()
    
    // Auto-refresh messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages(true) // Silent refresh
    }, 5000)
    
    return () => clearInterval(interval)
  }, [userId, user, authLoading])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      else setRefreshing(true)
      
      const data = await messageApi.getMessagesWith(userId)
      setMessages(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to load messages:", error)
      if (!silent) {
        toast({
          title: "Error",
          description: error.message || "Failed to load messages",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const profile = await userApi.getUserById(userId)
      setOtherUser(profile)
    } catch (error: any) {
      console.error("Failed to load user profile:", error)
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) {
      return
    }

    const messageContent = newMessage.trim()

    try {
      setSending(true)
      
      const messageData: any = await messageApi.sendMessage(userId, messageContent)
      
      if (messageData) {
        // Clear input after successful send
        setNewMessage("")
        
        // Refresh messages to get the updated conversation
        await fetchMessages(true)
        
        // Scroll to bottom to show the new message
        setTimeout(scrollToBottom, 100)
      }
      
      // Focus back on input
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (error: any) {
      console.error("Failed to send message:", error)
      
      // Restore message on error
      setNewMessage(messageContent)
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {otherUser && (
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={otherUser.avatar} alt={`${otherUser.firstName} ${otherUser.lastName}`} />
                <AvatarFallback>{getInitials(otherUser.firstName, otherUser.lastName)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{otherUser.firstName} {otherUser.lastName}</h1>
                {otherUser.bio && (
                  <p className="text-sm text-muted-foreground">{otherUser.bio}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Card className="h-[600px] flex flex-col">
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => {
                  // Determine if this message was sent by the current user
                  const myUserId = user?.id
                  const messageSenderId = message.senderId
                  const isCurrentUser = myUserId && messageSenderId && (messageSenderId === myUserId)
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex w-full ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] min-w-[100px] ${
                          isCurrentUser
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        } rounded-2xl px-4 py-2 shadow-sm break-words`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isCurrentUser
                              ? "text-white/80"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 flex items-center gap-2 bg-background"
          >
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="flex-1"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button 
              type="button"
              onClick={() => fetchMessages(true)}
              disabled={refreshing}
              variant="ghost"
              size="sm"
              className="px-3"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "↻"
              )}
            </Button>
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || sending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Card>
      </main>
    </>
  )
}
