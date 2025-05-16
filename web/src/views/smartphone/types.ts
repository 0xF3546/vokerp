export interface Call {
  id: number
  contactId?: number
  number: string
  date: Date
  duration: number
  incoming: boolean
  missed: boolean
}

export interface Message {
  id: number
  text: string
  sent: boolean
  timestamp: Date
  location?: { lat: number; lng: number }
  contactId?: number
}

export interface Chat {
  id: number
  contactId: number
  messages: Message[]
}

export interface TeamMember {
  id: number
  name: string
  rank: number
  online: boolean
  isLeader: boolean
  isMedic: boolean
  hasBank?: boolean
  hasStorage?: boolean
  salary?: number
  note?: string
}

export interface Vehicle {
  id: number
  name: string
  garage: string
  parked: boolean
  plate: string
  fuel: number
  health: number
  type: string
  note?: string
}

export interface GpsLocation {
  id: number
  name: string
  type: "Garagen" | "Spaß" | "Shops"
  description?: string
}

export interface AppSettings {
  wallpaper: "gradient-dark" | "gradient-blue" | "gradient-purple" | "solid-black"
  ringtone: string
  messageSound: string
  vibration: boolean
  darkMode: boolean
}

export interface UserProfile {
  name: string
  id: string
  faction: string
  rank: string
  phone: string
  cash: number
  bank: number
}

export interface Transaction {
  id: number
  date: Date
  amount: number
  description: string
  recipient?: string
  sender?: string
  type: "incoming" | "outgoing" | "deposit" | "withdrawal"
}

export interface BankAccount {
  id: string
  balance: number
  transactions: Transaction[]
}
