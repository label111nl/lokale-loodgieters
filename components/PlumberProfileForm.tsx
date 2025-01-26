"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "@/hooks/useTranslation"

type PlumberProfile = {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  kvk_number: string
  description: string
}

export function PlumberProfileForm() {
  const { t } = useTranslation()
  const [profile, setProfile] = useState<PlumberProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data, error } = await supabase.from("plumbers").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
      } else {
        setProfile(data)
      }
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from("plumbers").update(profile).eq("id", profile?.id)

    if (error) {
      console.error("Error updating profile:", error)
      toast({
        title: t("profile.updateError.title"),
        description: t("profile.updateError.description"),
        variant: "destructive",
      })
    } else {
      toast({
        title: t("profile.updateSuccess.title"),
        description: t("profile.updateSuccess.description"),
      })
    }

    setLoading(false)
  }

  if (loading) {
    return <div>{t("common.loading")}</div>
  }

  if (!profile) {
    return <div>{t("profile.error")}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.title")}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_name">{t("profile.companyName")}</Label>
            <Input
              id="company_name"
              value={profile.company_name}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="contact_person">{t("profile.contactPerson")}</Label>
            <Input
              id="contact_person"
              value={profile.contact_person}
              onChange={(e) => setProfile({ ...profile, contact_person: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">{t("profile.email")}</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">{t("profile.phone")}</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="address">{t("profile.address")}</Label>
            <Input
              id="address"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="city">{t("profile.city")}</Label>
            <Input id="city" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="postal_code">{t("profile.postalCode")}</Label>
            <Input
              id="postal_code"
              value={profile.postal_code}
              onChange={(e) => setProfile({ ...profile, postal_code: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="kvk_number">{t("profile.kvkNumber")}</Label>
            <Input
              id="kvk_number"
              value={profile.kvk_number}
              onChange={(e) => setProfile({ ...profile, kvk_number: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">{t("profile.description")}</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? t("common.saving") : t("profile.saveProfile")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

