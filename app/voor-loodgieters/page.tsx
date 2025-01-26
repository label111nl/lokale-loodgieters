import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PlumberInfo from "@/components/PlumberInfo"
import RegistrationForm from "@/components/RegistrationForm"

export default function VoorLoodgietersPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Voor Loodgieters</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <PlumberInfo />
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </>
  )
}

