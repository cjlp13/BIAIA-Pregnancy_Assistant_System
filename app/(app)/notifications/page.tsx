"use client"
import { useNotifications } from "@/components/providers/notification-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check, Trash2, AlertTriangle, Calendar, MessageSquare, Info } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useNotifications()

  // Group notifications by date
  const groupedNotifications: Record<string, typeof notifications> = {}

  notifications.forEach((notification) => {
    const dateStr = format(new Date(notification.date), "yyyy-MM-dd")
    if (!groupedNotifications[dateStr]) {
      groupedNotifications[dateStr] = []
    }
    groupedNotifications[dateStr].push(notification)
  })

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5" />
      case "message":
        return <MessageSquare className="h-5 w-5" />
      case "reminder":
        return <AlertTriangle className="h-5 w-5" />
      case "tip":
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Get badge color based on notification type
  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case "appointment":
        return "default"
      case "message":
        return "secondary"
      case "reminder":
        return "destructive"
      case "tip":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "No new notifications"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2">
            <Switch
              id="notifications-toggle"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <Label htmlFor="notifications-toggle">
              {notificationsEnabled ? "Notifications On" : "Notifications Off"}
            </Label>
          </div>
          {notifications.length > 0 && (
            <>
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
              <Button variant="outline" onClick={deleteAllNotifications}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>

      {!notificationsEnabled && (
        <Alert className="mb-6">
          <AlertDescription>
            Notifications are currently disabled. Enable them in settings to receive appointment reminders and updates.
          </AlertDescription>
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Notifications</h2>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any notifications yet. They'll appear here when you have upcoming appointments or updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => (
            <Card key={dateStr}>
              <CardHeader className="pb-3">
                <CardTitle>{format(new Date(dateStr), "MMMM d, yyyy")}</CardTitle>
                <CardDescription>
                  {groupedNotifications[dateStr].length} notification
                  {groupedNotifications[dateStr].length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupedNotifications[dateStr].map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        !notification.read ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center">
                          <h3 className="font-medium">{notification.title}</h3>
                          <Badge variant={getNotificationBadgeVariant(notification.type)} className="ml-2">
                            {notification.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8"
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notification.date), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
