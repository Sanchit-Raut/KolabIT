"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Heart, MessageCircle, Users, Star, Bell, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "comment",
      title: "New comment on your post",
      message: 'Sarah Chen commented on "Looking for React.js Study Group"',
      author: { name: "Sarah Chen", avatar: "/female-student-creative.jpg" },
      timestamp: "2 hours ago",
      read: false,
      link: "/community/2",
    },
    {
      id: 2,
      type: "like",
      title: "Someone liked your post",
      message: '5 people liked your post "Campus Food Delivery App"',
      author: { name: "Project Liked", avatar: "/placeholder.svg" },
      timestamp: "4 hours ago",
      read: false,
      link: "/projects/1",
    },
    {
      id: 3,
      type: "follow",
      title: "New follower",
      message: "David Kumar started following you",
      author: { name: "David Kumar", avatar: "/asian-male-student-developer.jpg" },
      timestamp: "6 hours ago",
      read: false,
      link: "/profile/3",
    },
    {
      id: 4,
      type: "project_update",
      title: "Project update",
      message: 'You were added to "AI Study Buddy Platform" project',
      author: { name: "Michael Chen", avatar: "/placeholder.svg" },
      timestamp: "1 day ago",
      read: true,
      link: "/projects/2",
    },
    {
      id: 5,
      type: "resource",
      title: "New resource shared",
      message: 'Emma Rodriguez shared "Complete React.js Tutorial Series"',
      author: { name: "Emma Rodriguez", avatar: "/smiling-female-student.png" },
      timestamp: "1 day ago",
      read: true,
      link: "/resources/1",
    },
    {
      id: 6,
      type: "message",
      title: "New direct message",
      message: "You have a new message from Alex Thompson",
      author: { name: "Alex Thompson", avatar: "/male-student-confident.jpg" },
      timestamp: "2 days ago",
      read: true,
      link: "/messages/4",
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />
      case "follow":
        return <Users className="h-5 w-5 text-green-500" />
      case "project_update":
        return <Star className="h-5 w-5 text-purple-500" />
      case "resource":
        return <Star className="h-5 w-5 text-orange-500" />
      case "message":
        return <MessageCircle className="h-5 w-5 text-indigo-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      searchQuery === "" ||
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "unread") return !notif.read && matchesSearch
    if (activeTab === "read") return notif.read && matchesSearch
    return matchesSearch
  })

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
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
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

        {/* Tabs */}
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
          {["all", "unread", "read"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <Link key={notif.id} href={notif.link}>
                    <Card
                      className={`hover:shadow-md transition-shadow cursor-pointer ${
                        !notif.read ? "bg-orange-50 border-orange-200" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={notif.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{notif.author.name[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-foreground">{notif.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notif.message}</p>
                              </div>
                              {!notif.read && <div className="h-3 w-3 rounded-full bg-orange-500 flex-shrink-0 mt-1" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                          </div>

                          <div className="flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {tab === "unread" ? "No unread notifications" : "No notifications yet"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
