"use client"
import { CreditCard, Briefcase, DollarSign, BadgeCheck, Phone } from "lucide-react"
import type { UserProfile } from "../../types"

interface ProfileAppProps {
  profile: UserProfile
}

export default function ProfileApp({ profile }: ProfileAppProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-base font-semibold text-white">Profil</h1>
      </div>

      {/* Profil-Header */}
      <div className="p-4 flex flex-col items-center border-b border-gray-800">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-xl mb-3">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-base font-semibold text-white">{profile.name}</h2>
        <div className="flex items-center mt-1">
          <BadgeCheck className="text-blue-400 mr-1" size={12} />
          <p className="text-xs text-gray-400">{profile.id}</p>
        </div>
      </div>

      {/* Profil-Details */}
      <div className="flex-1 overflow-y-auto">
        {/* Fraktion */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center">
            <Briefcase className="text-blue-400 mr-2" size={14} />
            <div>
              <div className="text-xs text-gray-400">Fraktion</div>
              <div className="text-xs font-medium text-white">{profile.faction}</div>
            </div>
          </div>
        </div>

        {/* Rang */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center">
            <BadgeCheck className="text-blue-400 mr-2" size={14} />
            <div>
              <div className="text-xs text-gray-400">Rang</div>
              <div className="text-xs font-medium text-white">{profile.rank}</div>
            </div>
          </div>
        </div>

        {/* Telefonnummer */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center">
            <Phone className="text-blue-400 mr-2" size={14} />
            <div>
              <div className="text-xs text-gray-400">Telefonnummer</div>
              <div className="text-xs font-medium text-white">{profile.phone}</div>
            </div>
          </div>
        </div>

        {/* Finanzen */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-white mb-3">Finanzen</h3>

          <div className="space-y-2">
            {/* Bargeld */}
            <div className="flex items-center p-2 bg-gray-800 rounded-lg">
              <DollarSign className="text-green-500 mr-2" size={14} />
              <div className="flex-1">
                <div className="text-xs text-gray-400">Bargeld</div>
                <div className="text-xs font-medium text-white">{formatCurrency(profile.cash)}</div>
              </div>
            </div>

            {/* Bankkonto */}
            <div className="flex items-center p-2 bg-gray-800 rounded-lg">
              <CreditCard className="text-blue-400 mr-2" size={14} />
              <div className="flex-1">
                <div className="text-xs text-gray-400">Bankkonto</div>
                <div className="text-xs font-medium text-white">{formatCurrency(profile.bank)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
