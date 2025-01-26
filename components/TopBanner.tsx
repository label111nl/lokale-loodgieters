import { Clock, Zap, Award, PiggyBank } from "lucide-react"

export default function TopBanner() {
  return (
    <div className="w-full bg-[#0051FF] text-white">
      <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
        <div className="flex items-center gap-2 px-4 py-2">
          <Clock className="h-4 w-4" />
          <span>24/7 Beschikbaar</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2">
          <Zap className="h-4 w-4" />
          <span>Snelle Service</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2">
          <Award className="h-4 w-4" />
          <span>Gecertificeerde Loodgieters</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2">
          <PiggyBank className="h-4 w-4" />
          <span>Transparante Prijzen</span>
        </div>
      </div>
    </div>
  )
}

