import { LoginForm } from "@/components/LoginForm"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}

