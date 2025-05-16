"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Users,
  MessageSquare,
  PhoneCall,
  Home,
  Car,
  UserCog,
  MapPin,
  Settings,
  User,
  CreditCard,
  Radio,
  Battery,
  Wifi,
  Signal,
} from "lucide-react"
import ContactsApp from "./components/contacts/contact-app"
import CallApp from "./components/call/call-app"
import MessagesApp from "./components/messages/message-app"
import TeamApp from "./components/team/team-app"
import VehiclesApp from "./components/vehicles/vehicle-app"
import GpsApp from "./components/gps/gps-app"
import SettingsApp from "./components/settings/settings-app"
import ProfileApp from "./components/profile/profile-app"
import BankingApp from "./components/banking/banking-app"
import FunkApp from "./components/funk/funk-app"
import type {
  Call,
  Chat,
  Message,
  TeamMember,
  Vehicle,
  AppSettings,
  UserProfile,
  Transaction,
  BankAccount,
} from "./types"
import "./scrollbar.css"
import { fetchNui } from "../../utils/fetchNui"
import { ContactDto } from "@shared/models/ContactDto"

export default function Smartphone() {
  // Aktuelle Zeit
  const [currentTime, setCurrentTime] = useState(new Date())

  // Aktualisiere die Zeit jede Minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Formatiere die Zeit als HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  // App-Status
  const [activeApp, setActiveApp] = useState<string>("home")
  const [previousApp, setPreviousApp] = useState<string>("home")

  // App-Einstellungen
  const [appSettings, setAppSettings] = useState<AppSettings>({
    wallpaper: "gradient-dark",
    ringtone: "default",
    messageSound: "default",
    vibration: true,
    darkMode: true,
  })

  // Benutzerprofil
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Max Mustermann",
    id: "ABC123456",
    faction: "Los Santos Police Department",
    rank: "Officer",
    phone: "555-123456",
    cash: 5420,
    bank: 24680,
  })

  // Bankkonto
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    id: "DE89 3704 0044 0532 0130 00",
    balance: 24680,
    transactions: [
      {
        id: 1,
        date: new Date(Date.now() - 3600000),
        amount: 1500,
        description: "Gehalt",
        sender: "Los Santos Police Department",
        type: "incoming",
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000),
        amount: 250,
        description: "Tankstelle",
        recipient: "24/7",
        type: "outgoing",
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000),
        amount: 500,
        description: "Bargeldeinzahlung",
        type: "deposit",
      },
      {
        id: 4,
        date: new Date(Date.now() - 259200000),
        amount: 1000,
        description: "Bargeldauszahlung",
        type: "withdrawal",
      },
      {
        id: 5,
        date: new Date(Date.now() - 345600000),
        amount: 350,
        description: "Überweisung an John Doe",
        recipient: "John Doe",
        type: "outgoing",
      },
    ],
  })

  const [contacts, setContacts] = useState<ContactDto[]>([
    { id: 1, name: "Max Mustermann", number: "123456789", pinned: true },
    { id: 2, name: "Anna Schmidt", number: "987654321", pinned: false },
    { id: 3, name: "John Doe", number: "555123456", pinned: true },
    { id: 4, name: "Lisa Taylor", number: "444555666", pinned: false },
    { id: 5, name: "Michael Brown", number: "777888999", pinned: true },
  ])

  const [calls, setCalls] = useState<Call[]>([
    { id: 1, contactId: 1, number: "123456789", date: new Date(), duration: 120, incoming: true, missed: false },
    {
      id: 2,
      contactId: 2,
      number: "987654321",
      date: new Date(Date.now() - 86400000),
      duration: 0,
      incoming: false,
      missed: true,
    },
  ])

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      contactId: 1,
      messages: [
        { id: 1, text: "Hallo, wie geht es dir?", sent: false, timestamp: new Date(Date.now() - 3600000) },
        { id: 2, text: "Mir geht es gut, danke!", sent: true, timestamp: new Date(Date.now() - 3500000) },
      ],
    },
    {
      id: 2,
      contactId: 2,
      messages: [{ id: 1, text: "Treffen wir uns morgen?", sent: false, timestamp: new Date(Date.now() - 86400000) }],
    },
  ])

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Max Mustermann",
      rank: 12,
      online: true,
      isLeader: true,
      isMedic: false,
      salary: 5000,
      note: "Gründer",
    },
    { id: 2, name: "Peter Fuchs", rank: 11, online: true, isLeader: true, isMedic: true, salary: 4500 },
    { id: 3, name: "Sarah Johnson", rank: 10, online: false, isLeader: false, isMedic: false, salary: 4000 },
    { id: 4, name: "Michael Brown", rank: 8, online: true, isLeader: false, isMedic: true, salary: 3500 },
    { id: 5, name: "Lisa Taylor", rank: 5, online: true, isLeader: false, isMedic: false, salary: 3000 },
    { id: 6, name: "Johan Fox", rank: 0, online: true, isLeader: false, isMedic: false, salary: 2500 },
  ])

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: "Sultan RS",
      garage: "Legion Square Garage",
      parked: true,
      plate: "SULT4N",
      fuel: 75,
      health: 90,
      type: "Sports",
      note: "Mein Lieblingsauto",
    },
    {
      id: 2,
      name: "Bati 801",
      garage: "Pillbox Hill Garage",
      parked: false,
      plate: "B4T1",
      fuel: 60,
      health: 95,
      type: "Motorcycle",
      note: "Schnelles Motorrad für die Stadt",
    },
    {
      id: 3,
      name: "Zentorno",
      garage: "Vinewood Garage",
      parked: true,
      plate: "ZNTRNO",
      fuel: 85,
      health: 100,
      type: "Super",
    },
  ])

  // Funktionen für Kontakte
  const addContact = (contact: Omit<ContactDto, "id">) => {
    const newContact = {
      ...contact,
      id: contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1,
    }
    setContacts([...contacts, newContact])
  }

  const updateContact = (updatedContact: ContactDto) => {
    setContacts(contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)))
  }

  const deleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const toggleFavorite = (id: number) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, pinned: !contact.pinned } : contact)))
  }

  // Funktionen für Anrufe
  const addCall = (call: Omit<Call, "id" | "date">) => {
    const newCall = {
      ...call,
      id: calls.length > 0 ? Math.max(...calls.map((c) => c.id)) + 1 : 1,
      date: new Date(),
    }
    setCalls([newCall, ...calls])
  }

  // Funktionen für Nachrichten
  const addMessage = (chatId: number, message: Omit<Message, "id" | "timestamp">) => {
    const newMessage = {
      ...message,
      id: Math.max(...(chats.find((c) => c.id === chatId)?.messages.map((m) => m.id) || [0])) + 1,
      timestamp: new Date(),
    }

    setChats(chats.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat)))
  }

  const createChat = (contactId: number) => {
    // Prüfen, ob bereits ein Chat existiert
    const existingChat = chats.find((chat) => chat.contactId === contactId)
    if (existingChat) return existingChat.id

    // Neuen Chat erstellen
    const newChat = {
      id: chats.length > 0 ? Math.max(...chats.map((c) => c.id)) + 1 : 1,
      contactId,
      messages: [],
    }
    setChats([...chats, newChat])
    return newChat.id
  }

  // Hilfsfunktion zum Finden eines Kontakts anhand der ID
  const getContactById = (id: number) => {
    return contacts.find((contact) => contact.id === id)
  }

  // Hilfsfunktion zum Finden eines Kontakts anhand der Nummer
  const getContactByNumber = (number: string) => {
    return contacts.find((contact) => contact.number === number)
  }

  // Fahrzeug-Funktionen
  const locateVehicle = (id: number) => {
    const vehicle = vehicles.find((v) => v.id === id)
    if (vehicle) {
      if (vehicle.parked) {
        alert(`Fahrzeug ${vehicle.name} befindet sich in der ${vehicle.garage}`)
      } else {
        alert(`Fahrzeug ${vehicle.name} wird geortet... Position: Downtown Los Santos`)
      }
    }
  }

  // Einstellungen aktualisieren
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setAppSettings({ ...appSettings, ...newSettings })
  }

  // Profil aktualisieren
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile({ ...userProfile, ...newProfile })
  }

  // Bankkonto-Funktionen
  const updateBalance = (amount: number) => {
    setBankAccount({
      ...bankAccount,
      balance: bankAccount.balance + amount,
    })

    // Auch das Profil aktualisieren
    setUserProfile({
      ...userProfile,
      bank: userProfile.bank + amount,
    })
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    const newTransaction = {
      ...transaction,
      id: bankAccount.transactions.length > 0 ? Math.max(...bankAccount.transactions.map((t) => t.id)) + 1 : 1,
      date: new Date(),
    }

    setBankAccount({
      ...bankAccount,
      transactions: [newTransaction, ...bankAccount.transactions],
    })
  }

  // Hintergrund basierend auf Einstellungen
  const getWallpaperStyle = () => {
    switch (appSettings.wallpaper) {
      case "gradient-dark":
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      case "gradient-blue":
        return "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"
      case "gradient-purple":
        return "bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900"
      case "solid-black":
        return "bg-black"
      default:
        return "bg-gray-900"
    }
  }

  // Füge einen Event-Listener hinzu, um Anrufe zwischen Apps zu koordinieren
  useEffect(() => {
    const handleStartCall = (event: CustomEvent) => {
      // Wechsle zur Anruf-App
      setActiveApp("call")
    }

    window.addEventListener("startCall", handleStartCall as EventListener)

    return () => {
      window.removeEventListener("startCall", handleStartCall as EventListener)
    }
  }, [])

  return (
    <div className="flex items-end justify-end min-h-screen sm:p-6 md:p-8">
      <div className="relative w-[220px] sm:w-[240px] md:w-[260px] h-[440px] sm:h-[480px] md:h-[520px] bg-black rounded-[24px] sm:rounded-[28px] md:rounded-[30px] overflow-hidden shadow-xl border-[2px] sm:border-[3px] border-gray-800">
        {/* Statusleiste */}
        <div className="absolute top-0 left-0 right-0 h-7 sm:h-8 bg-black z-10">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-7 sm:h-8 bg-black rounded-b-3xl"></div>

          {/* Verbesserte Statusleiste mit Akku, WLAN, etc. */}
          <div className="absolute top-0 left-0 right-0 h-7 sm:h-8 px-3 sm:px-4 md:px-5 flex items-center justify-between text-white z-20">
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] sm:text-[11px] font-medium tracking-tight">Voidfone</span>
              <Signal className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white/90" />
            </div>
            {activeApp !== "home" && (
              <div className="absolute left-1/2 transform -translate-x-1/2 text-[11px] sm:text-[12px] font-medium">
                {formattedTime}
              </div>
            )}
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <Wifi className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-white/90" />
              <div className="flex items-center">
                <Battery className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-white/90" />
                <span className="text-[9px] sm:text-[10px] ml-0.5 font-medium">87%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bildschirm */}
        <div className="absolute top-7 sm:top-8 left-0 right-0 bottom-12 sm:bottom-14 bg-gray-900 overflow-hidden">
          {activeApp === "home" && (
            <div className={`h-full ${getWallpaperStyle()} flex flex-col`}>
              {/* Uhrzeit und Datum */}
              <div className="flex flex-col items-center justify-center pt-4 pb-2">
                <div className="text-xl font-semibold text-white">{formattedTime}</div>
                <div className="text-xs text-white/70">
                  {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
                </div>
              </div>

              {/* App-Grid */}
              <div className="flex-1 p-2 sm:p-3 md:p-4 grid grid-cols-3 gap-2 sm:gap-3 content-start">
                <AppIcon
                  icon={<Users />}
                  label="Kontakte"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("contacts")
                  }}
                />
                <AppIcon
                  icon={<PhoneCall />}
                  label="Anrufen"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("call")
                  }}
                />
                <AppIcon
                  icon={<MessageSquare />}
                  label="Nachrichten"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("messages")
                  }}
                />
                <AppIcon
                  icon={<UserCog />}
                  label="Team"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("team")
                  }}
                />
                <AppIcon
                  icon={<Car />}
                  label="Fahrzeuge"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("vehicles")
                  }}
                />
                <AppIcon
                  icon={<MapPin />}
                  label="GPS"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("gps")
                  }}
                />
                <AppIcon
                  icon={<CreditCard />}
                  label="Banking"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("banking")
                  }}
                />
                <AppIcon
                  icon={<Settings />}
                  label="Einstellungen"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("settings")
                  }}
                />
                <AppIcon
                  icon={<User />}
                  label="Profil"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("profile")
                  }}
                />
                <AppIcon
                  icon={<Radio />}
                  label="Funk"
                  onClick={() => {
                    setPreviousApp(activeApp)
                    setActiveApp("funk")
                  }}
                />
              </div>
            </div>
          )}

          {activeApp === "contacts" && (
            <ContactsApp
              contacts={contacts}
              addContact={addContact}
              updateContact={updateContact}
              deleteContact={deleteContact}
              toggleFavorite={toggleFavorite}
              createChat={createChat}
              addCall={addCall}
              setActiveApp={(app) => {
                setPreviousApp(activeApp)
                setActiveApp(app)
              }}
            />
          )}

          {activeApp === "call" && (
            <CallApp
              calls={calls}
              contacts={contacts}
              addCall={addCall}
              getContactById={getContactById}
              getContactByNumber={getContactByNumber}
            />
          )}

          {activeApp === "messages" && (
            <MessagesApp
              chats={chats}
              contacts={contacts}
              addMessage={addMessage}
              getContactById={getContactById}
              createChat={createChat}
            />
          )}

          {activeApp === "team" && (
            <TeamApp
              teamMembers={teamMembers}
              createChat={createChat}
              addCall={addCall}
              setActiveApp={(app) => {
                setPreviousApp(activeApp)
                setActiveApp(app)
              }}
            />
          )}

          {activeApp === "vehicles" && <VehiclesApp vehicles={vehicles} locateVehicle={locateVehicle} />}

          {activeApp === "gps" && <GpsApp />}

          {activeApp === "settings" && <SettingsApp settings={appSettings} updateSettings={updateSettings} />}

          {activeApp === "profile" && <ProfileApp profile={userProfile} />}

          {activeApp === "banking" && (
            <BankingApp account={bankAccount} updateBalance={updateBalance} addTransaction={addTransaction} />
          )}

          {activeApp === "funk" && <FunkApp />}
        </div>

        {/* Navigationsleiste */}
        <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-14 bg-black flex justify-center items-center">
          <button
            onClick={() => {
              setPreviousApp(activeApp)
              setActiveApp("home")
              if (activeApp !== "home") {
                fetchNui("ServerEvent", "Smartphone::Hide");
              }
            }}
            className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
          >
            <Home size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// App-Icon-Design
function AppIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-black/30 active:bg-black/50 transition-all"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center text-white mb-1">
        <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">{icon}</div>
      </div>
      <span className="text-[9px] sm:text-[10px] font-medium text-gray-300">{label}</span>
    </button>
  )
}
