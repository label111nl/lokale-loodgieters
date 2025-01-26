import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SubscriptionPage } from "@/components/SubscriptionPage"

export default async function PlumberSubscriptionPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login if not authenticated
    return {
      redirect: {
        destination: "/plumber/login",
        permanent: false,
      },
    }
  }

  // Fetch the plumber's current subscription
  const { data: plumber, error } = await supabase
    .from("plumbers")
    .select("id, subscription_type")
    .eq("id", session.user.id)
    .single()

  if (error) {
    console.error("Error fetching plumber data:", error)
    return <div>Er is een fout opgetreden bij het laden van uw abonnementsgegevens.</div>
  }

  return <SubscriptionPage plumberId={plumber.id} currentSubscription={plumber.subscription_type} />
}

