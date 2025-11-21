"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { notificationApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, MessageCircle, Users, Star, Bell, ArrowLeft, Loader2, Trophy } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { Notification } from "@/lib/types"

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response: any = await notificationApi.getNotifications(1, 50)
        // API returns { data: [...], pagination: {...} }
        const notificationsList = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
          ? response 
          : []
        setNotifications(notificationsList)
      } catch (err) {
        console.error("Error fetching notifications:", err)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchNotifications()
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user?.id])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getNotificationIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PROJECT_INVITE":
      case "JOIN_REQUEST":
        return <Users className="h-5 w-5 text-blue-500" />
      case "SKILL_ENDORSEMENT":
        return <Star className="h-5 w-5 text-purple-500" />
      case "BADGE_EARNED":
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case "COMMENT":
      case "REPLY":
        return <MessageCircle className="h-5 w-5 text-green-500" />
      case "LIKE":
        return <Heart className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      searchQuery === "" ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "unread") return !notif.isRead && matchesSearch
    if (activeTab === "read") return notif.isRead && matchesSearch
    return matchesSearch
  })

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId)
      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  const handleNotificationClick = async (notif: Notification) => {
    // Mark as read
    await markAsRead(notif.id)
    
    // Navigate to the appropriate page based on notification type and data
    if (notif.data && typeof notif.data === 'object') {
      const data = notif.data as any
      
      // Check for explicit link first
      if (data.link) {
        router.push(data.link)
        return
      }
      
      // Handle different notification types
      const type = notif.type.toUpperCase()
      
      // Project-related notifications
      if (data.projectId && (
        type === 'JOIN_REQUEST' || 
        type === 'JOIN_REQUEST_RESPONSE' ||
        type === 'PROJECT_INVITE' ||
        type.includes('PROJECT')
      )) {
        router.push(`/projects/${data.projectId}`)
        return
      }
      
      // Resource-related notifications
      if (data.resourceId && type.includes('RESOURCE')) {
        router.push(`/resources/${data.resourceId}`)
        return
      }
      
      // Content reported notifications (for admins)
      if (type === 'CONTENT_REPORTED' && data.contentUrl) {
        router.push(data.contentUrl)
        return
      }
      
      // User profile-related notifications
      if (data.userId && (type === 'SKILL_ENDORSEMENT' || type === 'FOLLOW')) {
        router.push(`/users/${data.userId}`)
        return
      }
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true)
      await notificationApi.markAllAsRead()
      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (err) {
      console.error("Error marking all as read:", err)
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      })
    } finally {
      setMarkingAllRead(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up! 🎉"}
              </p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="default" 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAllRead}
                >
                  {markingAllRead ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Mark All as Read
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && <Badge className="ml-2 bg-orange-500">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            {/* Notifications List */}
            <TabsContent value={activeTab} className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                      !notif.isRead 
                        ? "bg-orange-50/50 border-l-orange-500 border-orange-200 hover:bg-orange-50" 
                        : "border-l-transparent hover:border-l-gray-300"
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${
                          !notif.isRead ? "bg-orange-100" : "bg-gray-100"
                        }`}>
                          {getNotificationIcon(notif.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{notif.title}</h3>
                                {!notif.isRead && (
                                  <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0">
                                    NEW
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <span className="opacity-60">
                                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed border-2">
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "unread" 
                        ? "You're all caught up! Check back later for updates." 
                        : "When you get notifications, they'll show up here."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
