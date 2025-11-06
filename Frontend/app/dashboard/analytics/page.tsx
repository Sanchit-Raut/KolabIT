"use client"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowUp, ArrowDown, TrendingUp, Users, Eye, MessageSquare, Download } from "lucide-react"
import Link from "next/link"

export default function AnalyticsDashboardPage() {
  // Mock data for charts
  const viewsData = [
    { name: "Mon", views: 120, engagement: 65 },
    { name: "Tue", views: 200, engagement: 98 },
    { name: "Wed", views: 150, engagement: 75 },
    { name: "Thu", views: 300, engagement: 130 },
    { name: "Fri", views: 250, engagement: 120 },
    { name: "Sat", views: 280, engagement: 150 },
    { name: "Sun", views: 320, engagement: 180 },
  ]

  const resourceTypeData = [
    { name: "Tutorials", value: 45 },
    { name: "Templates", value: 28 },
    { name: "Guides", value: 18 },
    { name: "Cheat Sheets", value: 9 },
  ]

  const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa"]

  const stats = [
    {
      label: "Total Views",
      value: "2,847",
      change: "+12.5%",
      positive: true,
      icon: Eye,
    },
    {
      label: "Total Downloads",
      value: "1,205",
      change: "+8.2%",
      positive: true,
      icon: Download,
    },
    {
      label: "Engagement Rate",
      value: "4.8%",
      change: "-2.1%",
      positive: false,
      icon: MessageSquare,
    },
    {
      label: "Followers",
      value: "342",
      change: "+5.3%",
      positive: true,
      icon: Users,
    },
  ]

  const topResources = [
    {
      id: 1,
      title: "Complete React.js Tutorial Series",
      type: "Tutorial",
      views: 2847,
      downloads: 1205,
      engagement: 4.9,
    },
    {
      id: 2,
      title: "Machine Learning Algorithms Cheat Sheet",
      type: "Cheat Sheet",
      views: 1876,
      downloads: 892,
      engagement: 4.8,
    },
    {
      id: 3,
      title: "Modern UI Component Library",
      type: "Template",
      views: 1543,
      downloads: 678,
      engagement: 4.7,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your performance and engagement metrics</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <div
                        className={`text-sm mt-2 flex items-center gap-1 ${stat.positive ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Icon className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Views & Engagement Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Views & Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="#fb923c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resource Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resourceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resourceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{resource.type}</Badge>
                      <span>{resource.views.toLocaleString()} views</span>
                      <span>{resource.downloads.toLocaleString()} downloads</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {resource.engagement}/5
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Someone downloaded your tutorial", time: "2 hours ago" },
                { action: "New comment on React.js guide", time: "5 hours ago" },
                { action: "Your project was shared 3 times", time: "1 day ago" },
                { action: "New follower: Alex Johnson", time: "1 day ago" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
