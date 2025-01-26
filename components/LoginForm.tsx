"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase-client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (role: "admin" | "plumber") => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if the user has the correct role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (profileError) throw profileError

      if (profile.role !== role) {
        throw new Error("Unauthorized access")
      }

      // Redirect to the appropriate dashboard
      router.push(role === "admin" ? "/admin/dashboard" : "/plumber/dashboard")
    } catch (error) {
      setError("Invalid login credentials or unauthorized access")
    }
  }

  return (
    <Tabs defaultValue="admin" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="admin">Admin</TabsTrigger>
        <TabsTrigger value="plumber">Loodgieter</TabsTrigger>
      </TabsList>
      <TabsContent value="admin">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Log in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="admin-email">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleLogin("admin")}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="plumber">
        <Card>
          <CardHeader>
            <CardTitle>Loodgieter Login</CardTitle>
            <CardDescription>Log in to access your loodgieter dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="plumber-email">Email</Label>
              <Input id="plumber-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="plumber-password">Password</Label>
              <Input
                id="plumber-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleLogin("plumber")}>Login</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </Tabs>
  )
}

