import DashboardLayout from "@/components/layouts/DashboardLayout"

export default function PlumberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

