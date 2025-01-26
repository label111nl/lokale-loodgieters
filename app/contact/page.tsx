import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-12 text-center">Contact</h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Neem Contact Op</h2>
              <form className="space-y-6">
                <div>
                  <label className="block mb-2">Naam</label>
                  <Input type="text" placeholder="Uw naam" />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <Input type="email" placeholder="Uw email" />
                </div>
                <div>
                  <label className="block mb-2">Bericht</label>
                  <Textarea placeholder="Uw bericht" rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Verstuur
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Telefoon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>24/7 bereikbaar: 0800-LOODGIETER</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>info@lokaleloodgieters.nl</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Adres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Loodgieterstraat 123
                    <br />
                    1234 AB Amsterdam
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

