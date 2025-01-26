import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">Unauthorized Access</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          You do not have permission to view this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

