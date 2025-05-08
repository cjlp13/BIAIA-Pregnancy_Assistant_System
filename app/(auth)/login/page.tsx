"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    setIsClient(true) // Ensure we're in the client side
    const searchParams = new URLSearchParams(window.location.search)
    const newUser = searchParams.get("newUser") === "true"
    setIsNewUser(newUser)
  }, [])

    // COMMENT NLNG SAYANG RIN. Goods din session minsan
    // useEffect(() => {
    //   const checkSession = async () => {
    //     const { data } = await supabase.auth.getSession()
    //     if (data.session) {
    //       setLoginStatus("Already logged in! Redirecting...")
  
    //       // Check if user has completed onboarding
    //       const { data: profileData, error: profileError } = await supabase
    //         .from("profiles")
    //         .select("*")
    //         .eq("user_id", data.session.user.id)
    //         .single()
  
    //       console.log("Profile data on auto-login:", profileData)
  
    //       if (profileData.onboarding_complete !== true) {
    //         // If no profile exists, there's an error, or onboarding is not complete
    //         console.log("Redirecting to onboarding: profile incomplete or not found")
    //         window.location.href = "/onboarding"
    //       } else {
    //         // User has completed onboarding, go to dashboard
    //         console.log("Redirecting to dashboard: onboarding complete")
    //         window.location.href = "/dashboard"
    //       }
    //     }
    //   }
  
    //   checkSession()
    // }, [])
  

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("you goig here? huh")
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setLoginStatus("Attempting to sign in...")
    setDebugInfo(null)

    try {
      // Sign in directly with Supabase client
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setLoginStatus("Sign in successful! Redirecting...")
      setDebugInfo(
        JSON.stringify({
          user: data.user?.id,
          session: data.session ? "exists" : "null",
        }),
      )

      // Check if user has completed onboarding
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      console.log("Profile data after login:", profileData)

      // Use window.location for a hard redirect
      setTimeout(() => {
        if (profileError || !profileData || profileData.onboarding_complete !== true) {
          // If no profile exists, there's an error, or onboarding is not complete
          console.log("Redirecting to onboarding: profile incomplete or not found")
          window.location.href = "/onboarding"
        } else {
          // User has completed onboarding, go to dashboard
          console.log("Redirecting to dashboard: onboarding complete")
          window.location.href = "/dashboard"
        }
      }, 1000)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in")
      setLoginStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDebug = () => {
    router.push("/debug")
  }

  if (!isClient) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white space-y-4">
        <div className="w-12 h-12 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-pink-500 text-lg font-semibold">
          Just a moment, darling… ♡
        </p>
      </div>
    )
  }
  


  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">BIAIA</CardTitle>
          <CardDescription className="text-center">
            {isNewUser
              ? "Your account has been created! Please sign in to continue."
              : "Enter your email and password to sign in"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loginStatus && (
              <Alert className="bg-blue-50 text-blue-800">
                <AlertDescription>{loginStatus}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="text-xs text-muted-foreground overflow-hidden overflow-ellipsis">Debug: {debugInfo}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <button type="button" onClick={handleDebug} className="text-xs text-muted-foreground hover:underline">
                Troubleshoot Connection
              </button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
