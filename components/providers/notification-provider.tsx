"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Notification, Appointment, Profile } from "@/lib/types"
import { addDays, differenceInDays, parseISO, format, isAfter } from "date-fns"

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  deleteAllNotifications: () => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Add this function after the differenceInWeeks helper function
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// Update the NotificationProvider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [lastJournalDate, setLastJournalDate] = useState<Date | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true)
  const notificationCheckRef = useRef<NodeJS.Timeout | null>(null)
  const processedAppointments = useRef<Set<string>>(new Set())

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Load notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("biaia_notification_settings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        setNotificationsEnabled(settings.enabled)
      } catch (e) {
        console.error("Error parsing notification settings", e)
      }
    }
  }, [])

  // Save notification settings to localStorage
  useEffect(() => {
    localStorage.setItem("biaia_notification_settings", JSON.stringify({ enabled: notificationsEnabled }))
  }, [notificationsEnabled])

  // Load user data and generate notifications
  useEffect(() => {
    async function loadUserData() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) return

      const uid = sessionData.session.user.id
      setUserId(uid)

      // Fetch profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", uid).single()

      if (profileData) {
        setProfile(profileData as Profile)
      }

      // Fetch appointments
      const { data: appointmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", uid)
        .order("date", { ascending: true })

      if (appointmentsData) {
        setAppointments(appointmentsData as Appointment[])
      }

      // Fetch last journal entry
      const { data: journalData } = await supabase
        .from("journal_entries")
        .select("date")
        .eq("user_id", uid)
        .order("date", { ascending: false })
        .limit(1)

      if (journalData && journalData.length > 0) {
        setLastJournalDate(new Date(journalData[0].date))
      }
    }

    loadUserData()

    // Set up real-time subscription for appointments
    const appointmentsSubscription = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        async (payload) => {
          // Refresh appointments when there's a change
          if (userId) {
            const { data } = await supabase
              .from("appointments")
              .select("*")
              .eq("user_id", userId)
              .order("date", { ascending: true })

            if (data) {
              setAppointments(data as Appointment[])
            }
          }
        },
      )
      .subscribe()

    return () => {
      appointmentsSubscription.unsubscribe()
    }
  }, [userId])

  // Check for current appointments and send notifications
  useEffect(() => {
    // Only run if notifications are enabled
    if (!notificationsEnabled) {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current)
        notificationCheckRef.current = null
      }
      return
    }

    // Function to check for current appointments
    const checkCurrentAppointments = () => {
      if (!appointments.length) return

      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

      appointments.forEach((appointment) => {
        const appointmentDate = parseISO(appointment.date)

        // Check if appointment is today and time matches current time (within 1 minute)
        if (
          isSameDay(appointmentDate, now) &&
          Math.abs(timeToMinutes(appointment.time) - timeToMinutes(currentTime)) <= 1
        ) {
          // Check if we've already processed this appointment in the last few minutes
          const appointmentKey = `${appointment.id}-${format(now, "yyyy-MM-dd-HH-mm")}`
          if (!processedAppointments.current.has(appointmentKey)) {
            // Mark as processed to avoid duplicate notifications
            processedAppointments.current.add(appointmentKey)

            // Create notification
            const notificationId = `appointment-now-${appointment.id}-${format(now, "yyyy-MM-dd-HH-mm")}`

            // Add to notifications
            const newNotification = {
              id: notificationId,
              title: "Appointment Now",
              description: `Your appointment "${appointment.title}" is now`,
              type: "appointment" as const,
              read: false,
              date: now,
              expiresAt: addDays(now, 1), // Expires after 1 day
            }

            // Update notifications state
            setNotifications((prev) => {
              const updated = [newNotification, ...prev]
              localStorage.setItem("biaia_notifications", JSON.stringify(updated))
              return updated
            })

            // Show browser notification if supported
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("BIAIA Appointment Reminder", {
                body: `Your appointment "${appointment.title}" is now`,
                icon: "/favicon.ico",
              })
            }
          }
        }
      })

      // Clean up processed appointments older than 5 minutes
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      processedAppointments.current = new Set(
        Array.from(processedAppointments.current).filter((key) => {
          const timestamp = key.split("-").slice(-5).join("-")
          return new Date(timestamp) >= fiveMinutesAgo
        }),
      )
    }

    // Request notification permission if needed
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Check immediately and then set interval
    checkCurrentAppointments()
    notificationCheckRef.current = setInterval(checkCurrentAppointments, 60000) // Check every minute

    return () => {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current)
      }
    }
  }, [appointments, notificationsEnabled])

  // Helper function to convert time string to minutes
  function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Generate notifications based on data
  useEffect(() => {
    if (!notificationsEnabled) return

    const newNotifications: Notification[] = []
    const today = new Date()

    // Load saved notifications from localStorage
    const savedNotifications = localStorage.getItem("biaia_notifications")
    let existingNotifications: Notification[] = []

    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        existingNotifications = parsed.map((n: any) => ({
          ...n,
          date: new Date(n.date),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
        }))

        // Filter out expired notifications
        existingNotifications = existingNotifications.filter(
          (n) => !n.expiresAt || isAfter(new Date(n.expiresAt), today),
        )
      } catch (e) {
        console.error("Error parsing saved notifications", e)
      }
    }

    // Generate appointment reminders
    if (appointments.length > 0) {
      appointments.forEach((appointment) => {
        const appointmentDate = parseISO(appointment.date)
        const daysUntil = differenceInDays(appointmentDate, today)

        // Create reminders for upcoming appointments (5, 3, 1 days before)
        if ([5, 3, 1].includes(daysUntil)) {
          const notificationId = `appointment-${appointment.id}-${daysUntil}`

          // Check if this notification already exists
          if (!existingNotifications.some((n) => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              title: "Upcoming Appointment",
              description: `You have "${appointment.title}" in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`,
              type: "appointment",
              read: false,
              date: today,
              expiresAt: appointmentDate, // Expires on the appointment date
            })
          }
        }
      })
    }

    // Generate journal reminder if no entry in the last 24 hours
    if (!lastJournalDate || differenceInDays(today, lastJournalDate) >= 1) {
      const notificationId = `journal-reminder-${format(today, "yyyy-MM-dd")}`

      // Check if this notification already exists
      if (!existingNotifications.some((n) => n.id === notificationId)) {
        newNotifications.push({
          id: notificationId,
          title: "Journal Reminder",
          description: "Don't forget to log your symptoms and mood today",
          type: "reminder",
          read: false,
          date: today,
          expiresAt: addDays(today, 1), // Expires after 1 day
        })
      }
    }

    // Generate weekly pregnancy update notification
    if (profile) {
      const dueDate = parseISO(profile.due_date)
      const pregnancyWeek = Math.min(40, Math.max(1, 40 - differenceInWeeks(dueDate, today)))

      // Create weekly update notification (once per week)
      const weeklyNotificationId = `weekly-update-week-${pregnancyWeek}`

      // Check if this notification already exists
      if (!existingNotifications.some((n) => n.id === weeklyNotificationId)) {
        newNotifications.push({
          id: weeklyNotificationId,
          title: "Weekly Pregnancy Update",
          description: `Week ${pregnancyWeek}: Your baby is continuing to develop!`,
          type: "tip",
          read: false,
          date: today,
          expiresAt: addDays(today, 7), // Expires after 7 days
        })
      }
    }

    // Combine existing and new notifications
    const combinedNotifications = [...existingNotifications, ...newNotifications]

    // Sort by date (newest first)
    combinedNotifications.sort((a, b) => b.date.getTime() - a.date.getTime())

    setNotifications(combinedNotifications)

    // Save to localStorage
    localStorage.setItem("biaia_notifications", JSON.stringify(combinedNotifications))
  }, [appointments, profile, lastJournalDate, notificationsEnabled])

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      )

      // Save to localStorage
      localStorage.setItem("biaia_notifications", JSON.stringify(updated))

      return updated
    })
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((notification) => ({ ...notification, read: true }))

      // Save to localStorage
      localStorage.setItem("biaia_notifications", JSON.stringify(updated))

      return updated
    })
  }

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notification) => notification.id !== id)

      // Save to localStorage
      localStorage.setItem("biaia_notifications", JSON.stringify(updated))

      return updated
    })
  }

  // Delete all notifications
  const deleteAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem("biaia_notifications")
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        notificationsEnabled,
        setNotificationsEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Helper function
function differenceInWeeks(dateLeft: Date, dateRight: Date): number {
  const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
}
