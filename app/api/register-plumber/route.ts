import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const plumberData = await req.json()

  // Create a new user account
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email: plumberData.email,
    password: plumberData.password, // Ensure this is securely handled
  })

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 })
  }

  // Add the plumber data to the plumbers table
  const { data, error } = await supabase.from("plumbers").insert([
    {
      ...plumberData,
      id: userData.user?.id,
    },
  ])

  if (error) {
    // If there's an error, delete the created user account
    await supabase.auth.admin.deleteUser(userData.user?.id!)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, plumberId: data[0].id })
}

