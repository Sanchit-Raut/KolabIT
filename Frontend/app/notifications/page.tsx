"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { notificationApi } from "@/lib/api"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, MessageCircle, Users, Star, Bell, ArrowLeft, Loader2, Trophy } from "lucide-react"
import Link from "next/link"
import type { Notification } from "@/lib/types"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const data = await notificationApi.getNotifications(1, 50)
        if (Array.isArray(data)) {
          setNotifications(data)
        } else if (data?.notifications) {
          setNotifications(data.notifications)
        } else {
          setNotifications([])
        }
      } catch (err) {
        console.error("[v0] Error fetching notifications:", err)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchNotifications()
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
      console.error("[v0] Error marking notification as read:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
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
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      !notif.isRead ? "bg-orange-50 border-orange-200" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>N</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-foreground">{notif.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                            </div>
                            {!notif.isRead && <div className="h-3 w-3 rounded-full bg-orange-500 flex-shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {activeTab === "unread" ? "No unread notifications" : "No notifications yet"}
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
