"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"
import { useNotifications } from "@/components/providers/notification-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LogOut, User, Settings, Sun, Moon, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function TopNav() {
  const pathname = usePathname()
  const { user, signOut } = useSupabaseAuth()
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useIsMobile()

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return "B"
    return user.email.charAt(0).toUpperCase()
  }

  // Get recent notifications (last 5)
  const recentNotifications = notifications.slice(0, 5)

  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.read) {
        markAsRead(notification.id)
      }
    })
  }

  const NavLinks = () => (
    <>
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/tracker"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/tracker" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Tracker
      </Link>
      <Link
        href="/journal"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/journal" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Journal
      </Link>
      <Link
        href="/chat"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/chat" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Chat
      </Link>
      <Link
        href="/appointments"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/appointments" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Appointments
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Show logo on desktop, hide on mobile */}
          {!isMobile && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              {mounted ? (
                theme === "dark" ? (
                  <img
                    src="/biaia-dark.svg"
                    alt="BIAIA Logo"
                    className="h-8 w-auto"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = "/placeholder-logo.png"
                    }}
                  />
                ) : (
                  <img
                    src="/biaia-light.svg"
                    alt="BIAIA Logo"
                    className="h-8 w-auto"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = "/placeholder-logo.png"
                    }}
                  />
                )
              ) : (
                // Fallback logo during SSR to prevent hydration mismatch
                <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              )}
            </Link>
          )}

          {/* Mobile hamburger menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetTitle className="text-left"></SheetTitle>
                <div className="flex flex-col gap-6 py-4">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    {mounted && (
                      <img
                        src={theme === "dark" ? "/biaia-dark.svg" : "/biaia-light.svg"}
                        alt="BIAIA Logo"
                        className="h-8 w-auto"
                      />
                    )}
                  </Link>
                  <nav className="flex flex-col space-y-4">
                    <NavLinks />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Navigation links for desktop */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute left-4 bottom-5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={() => markAllAsRead()} className="text-xs text-muted-foreground hover:text-primary">
                    Mark all as read
                  </button>
                )}
              </div>

              {recentNotifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                <>
                  {recentNotifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex cursor-pointer flex-col items-start p-4 ${!notification.read ? "bg-muted/50" : ""}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex w-full items-start justify-between gap-2">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                    </DropdownMenuItem>
                  ))}
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer justify-center p-2 text-center">
                <Link href="/notifications">View all notifications</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {mounted ? (
              theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )
            ) : (
              // Fallback icon during SSR to prevent hydration mismatch
              <div className="h-5 w-5 rounded-full bg-muted" />
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={user?.email || ""} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.email && <p className="font-medium">{user.email}</p>}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
