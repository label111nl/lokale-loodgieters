import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookies().set({ name, value: "", ...options })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow access to the admin registration page without authentication
  if (req.nextUrl.pathname === "/admin/register") {
    return res
  }

  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      // Redirect to login if there's no session
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // Check if the user has the admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      // Redirect to unauthorized page if the user is not an admin
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}

