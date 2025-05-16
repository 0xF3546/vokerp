"use client"

import { useState, useEffect } from "react"
import {
  Phone,
  X,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Star,
  Mic,
  MicOff,
  Volume2,
  PhoneIncoming,
} from "lucide-react"
import type { Call } from "../../types"
import { ContactDto } from "@shared/models/ContactDto"

interface CallAppProps {
  calls: Call[]
  contacts: ContactDto[]
  addCall: (call: Omit<Call, "id" | "date">) => void
  getContactById: (id: number) => ContactDto | undefined
  getContactByNumber: (number: string) => ContactDto | undefined
}

export default function CallApp({ calls, contacts, addCall, getContactById, getContactByNumber }: CallAppProps) {
  const [view, setView] = useState<"dialer" | "history" | "favorites" | "calling" | "incoming" | "active">("dialer")
  const [dialNumber, setDialNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentCall, setCurrentCall] = useState<{
    contactId?: number
    number: string
    name?: string
    incoming?: boolean
    duration: number
  } | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Favoriten-Kontakte
  const favoriteContacts = contacts.filter((contact) => contact.pinned)

  // Event-Listener für Anrufe aus anderen Apps
  useEffect(() => {
    const handleStartCall = (event: CustomEvent) => {
      const { contactId, number, name } = event.detail

      setCurrentCall({
        number,
        contactId,
        name: name || number.toString(),
        duration: 0,
      })

      setView("calling")

      // Simuliere einen Anruf nach 3 Sekunden
      setTimeout(() => {
        if (view === "calling") {
          setView("active")
          setCallDuration(0)

          addCall({
            number,
            contactId,
            duration: 0,
            incoming: false,
            missed: false,
          })
        }
      }, 3000)
    }

    window.addEventListener("startCall", handleStartCall as EventListener)

    return () => {
      window.removeEventListener("startCall", handleStartCall as EventListener)
    }
  }, [view, addCall])

  // Timer für Anrufdauer
  useEffect(() => {
    if (view === "active" && !intervalId) {
      const id = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
      setIntervalId(id)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        setIntervalId(null)
      }
    }
  }, [view, intervalId])

  const handleCall = () => {
    if (dialNumber.length > 0) {
      const number = dialNumber
      const contact = getContactByNumber(number)

      setCurrentCall({
        number,
        contactId: contact?.id,
        name: contact?.name || number.toString(),
        duration: 0,
      })

      setView("calling")

      // Simuliere einen Anruf nach 3 Sekunden
      setTimeout(() => {
        if (view === "calling") {
          setView("active")
          setCallDuration(0)

          addCall({
            number,
            contactId: contact?.id,
            duration: 0,
            incoming: false,
            missed: false,
          })
        }
      }, 3000)
    }
  }

  const handleCallContact = (contact: ContactDto) => {
    setCurrentCall({
      number: contact.number,
      contactId: contact.id,
      name: contact.name,
      duration: 0,
    })

    setView("calling")

    // Simuliere einen Anruf nach 3 Sekunden
    setTimeout(() => {
      if (view === "calling") {
        setView("active")
        setCallDuration(0)

        addCall({
          number: contact.number,
          contactId: contact.id,
          duration: 0,
          incoming: false,
          missed: false,
        })
      }
    }, 3000)
  }

  const handleIncomingCall = (contact?: ContactDto, number?: string) => {
    if (!contact && !number) return

    setCurrentCall({
      number: number || contact!.number,
      contactId: contact?.id,
      name: contact?.name || number!.toString(),
      incoming: true,
      duration: 0,
    })

    setView("incoming")
  }

  const handleAcceptCall = () => {
    setView("active")
    setCallDuration(0)

    if (currentCall) {
      addCall({
        number: currentCall.number,
        contactId: currentCall.contactId,
        duration: 0,
        incoming: true,
        missed: false,
      })
    }
  }

  const handleRejectCall = () => {
    if (currentCall) {
      addCall({
        number: currentCall.number,
        contactId: currentCall.contactId,
        duration: 0,
        incoming: true,
        missed: true,
      })
    }

    setCurrentCall(null)
    setView("dialer")
  }

  const handleEndCall = () => {
    if (currentCall && view === "active") {
      // In einer echten App würde hier der Anruf beendet werden
      // und die Dauer in der Anrufliste aktualisiert werden
    }

    setCurrentCall(null)
    setCallDuration(0)
    setIsMuted(false)
    setIsSpeaker(false)
    setView("dialer")
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return ""
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      return `Heute, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    } else if (date >= yesterday) {
      return `Gestern, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Filtern der Anrufliste basierend auf der Suche
  const filteredCalls = calls.filter((call) => {
    const contact = call.contactId ? getContactById(call.contactId) : undefined
    const name = contact ? contact.name : call.number.toString()
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || call.number.toString().includes(searchTerm)
  })

  // Anruf-Screens
  if (view === "calling") {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold text-3xl mb-6">
            {currentCall?.name?.charAt(0).toUpperCase() || "#"}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">{currentCall?.name}</h2>
          <p className="text-gray-400">Anrufen...</p>

          <div className="mt-auto">
            <button
              onClick={handleEndCall}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white"
            >
              <Phone className="rotate-135" size={24} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === "incoming") {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="flex-1 flex flex-col items-center justify-between p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold text-3xl mb-6">
              {currentCall?.name?.charAt(0).toUpperCase() || "#"}
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">{currentCall?.name}</h2>
            <p className="text-gray-400">Eingehender Anruf</p>
          </div>

          <div className="mt-auto flex justify-center gap-8 w-full px-6">
            <button
              onClick={handleRejectCall}
              className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg"
            >
              <X size={24} />
            </button>
            <button
              onClick={handleAcceptCall}
              className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white shadow-lg"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (view === "active") {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold text-3xl mb-6">
            {currentCall?.name?.charAt(0).toUpperCase() || "#"}
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">{currentCall?.name}</h2>
          <p className="text-gray-400">{formatDuration(callDuration)}</p>

          <div className="mt-auto flex justify-between w-full">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                isMuted ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
              }`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={handleEndCall}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center text-white"
            >
              <Phone className="rotate-135" size={24} />
            </button>

            <button
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                isSpeaker ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300"
              }`}
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white">Telefon</h1>

        {/* Test-Button für eingehenden Anruf */}
        <button
          onClick={() => {
            const randomContact = contacts[Math.floor(Math.random() * contacts.length)]
            handleIncomingCall(randomContact)
          }}
          className="text-blue-400 flex items-center"
        >
          <PhoneIncoming size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 bg-gray-900">
        <button
          onClick={() => setView("dialer")}
          className={`flex-1 py-3 text-center font-medium ${
            view === "dialer" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          Tastatur
        </button>
        <button
          onClick={() => setView("favorites")}
          className={`flex-1 py-3 text-center font-medium ${
            view === "favorites" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          Favoriten
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex-1 py-3 text-center font-medium ${
            view === "history" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400"
          }`}
        >
          Anrufliste
        </button>
      </div>

      {view === "dialer" && (
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Nummer-Anzeige */}
          <div className="p-8 flex justify-center">
            <div className="relative">
              <input
                type="text"
                value={dialNumber}
                readOnly
                className="text-3xl text-center w-full bg-transparent outline-none text-white"
                placeholder="Nummer eingeben"
              />
              {dialNumber.length > 0 && (
                <button
                  onClick={() => setDialNumber("")}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Wähltastatur */}
          <div className="flex-1 grid grid-cols-3 gap-2 px-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
              <button
                key={num}
                onClick={() => setDialNumber((prev) => prev + num)}
                className="aspect-square rounded-full bg-gray-800 flex items-center justify-center text-xl font-medium text-white active:bg-gray-700"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Anruf-Button */}
          <div className="p-6 flex justify-center">
            <button
              onClick={handleCall}
              disabled={dialNumber.length === 0}
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                dialNumber.length > 0 ? "bg-green-600 text-white" : "bg-gray-700 text-gray-400"
              }`}
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      )}

      {view === "favorites" && (
        <div className="flex-1 overflow-y-auto bg-gray-900">
          {favoriteContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Star size={48} className="mb-2" />
              <p>Keine Favoriten vorhanden</p>
            </div>
          ) : (
            favoriteContacts.map((contact) => (
              <div key={contact.id} className="flex items-center px-4 py-3 border-b border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold mr-3">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{contact.name}</h3>
                  <p className="text-sm text-gray-400">{contact.number}</p>
                </div>
                <button
                  onClick={() => handleCallContact(contact)}
                  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white"
                >
                  <Phone size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {view === "history" && (
        <div className="flex-1 flex flex-col bg-gray-900">
          {/* Suchleiste */}
          <div className="px-4 pt-2 pb-4">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Suchen..."
                className="bg-transparent w-full outline-none text-sm text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredCalls.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Clock size={48} className="mb-2" />
                <p>Keine Anrufe vorhanden</p>
              </div>
            ) : (
              filteredCalls.map((call) => {
                const contact = call.contactId ? getContactById(call.contactId) : undefined
                const name = contact ? contact.name : call.number.toString()

                return (
                  <div key={call.id} className="flex items-center px-4 py-3 border-b border-gray-800">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        call.missed
                          ? "bg-red-900/50 text-red-400"
                          : call.incoming
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-green-900/50 text-green-400"
                      }`}
                    >
                      {call.incoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`font-medium ${call.missed ? "text-red-400" : "text-white"}`}>{name}</h3>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{formatDate(call.date)}</span>
                        {!call.missed && <span className="ml-2">{formatDuration(call.duration)}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const contact = call.contactId ? getContactById(call.contactId) : undefined
                        if (contact) {
                          handleCallContact(contact)
                        } else {
                          setDialNumber(call.number.toString())
                          handleCall()
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white"
                    >
                      <Phone size={16} />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
