"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { messageApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Loader2, MessageSquare, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  userId: string
  userName: string
  userAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isVerified: boolean
  isLastMessageFromMe: boolean
}

export default function MessagesInboxPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login")
      return
    }
    if (user) {
      fetchConversations()
    }
  }, [user, authLoading])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const messages = await messageApi.getUserMessages()
      
      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>()
      
      if (Array.isArray(messages)) {
        messages.forEach((msg: any) => {
          // Determine the other user in the conversation
          const isFromMe = msg.senderId === user?.id
          const otherUserId = isFromMe ? msg.recipientId : msg.senderId
          const otherUser = isFromMe ? msg.recipient : msg.sender
          
          const existing = conversationMap.get(otherUserId)
          
          if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              userName: `${otherUser.firstName} ${otherUser.lastName}`,
              userAvatar: otherUser.avatar,
              lastMessage: msg.content,
              lastMessageTime: msg.createdAt,
              unreadCount: 0, // TODO: Implement unread count
              isVerified: otherUser.isVerified || false,
              isLastMessageFromMe: isFromMe
            })
          }
        })
      }
      
      // Convert to array and sort by most recent
      const conversationList = Array.from(conversationMap.values()).sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      )
      
      setConversations(conversationList)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
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
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Your conversations with other users</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a conversation by messaging someone from a project or the community
            </p>
            <Button onClick={() => router.push("/projects")}>
              Browse Projects
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.userId}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/messages/${conversation.userId}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.userAvatar} alt={conversation.userName} />
                    <AvatarFallback>
                      {conversation.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{conversation.userName}</h3>
                      {conversation.isVerified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conversation.isLastMessageFromMe ? "Sent" : "Received"} • {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-orange-500 text-white">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
