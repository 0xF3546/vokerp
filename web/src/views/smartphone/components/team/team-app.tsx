"use client"
import { useState } from "react"
import type React from "react"

import {
  Phone,
  MessageSquare,
  Shield,
  Heart,
  Users,
  Edit,
  ArrowLeft,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
  UserPlus,
  Settings,
  Briefcase,
} from "lucide-react"
import type { TeamMember } from "../../types"

interface TeamAppProps {
  teamMembers: TeamMember[]
  createChat: (contactId: number) => number
  addCall: (call: any) => void
  setActiveApp: (app: string) => void
}

// Eigene Checkbox-Komponente
function CustomCheckbox({
  checked,
  onChange,
  label,
  id,
}: { checked: boolean; onChange: (checked: boolean) => void; label: string | React.ReactNode; id: string }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${
          checked ? "bg-blue-500" : "bg-gray-800 border border-gray-600"
        }`}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check size={10} className="text-white" />}
      </div>
      <label htmlFor={id} className="ml-2 text-xs text-gray-300 cursor-pointer" onClick={() => onChange(!checked)}>
        {label}
      </label>
    </div>
  )
}

export default function TeamApp({ teamMembers, createChat, addCall, setActiveApp }: TeamAppProps) {
  const [view, setView] = useState<"main" | "detail" | "edit" | "invite" | "settings">("main")
  const [activeTab, setActiveTab] = useState<"all" | "online">("online")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [expandedRanks, setExpandedRanks] = useState<Record<number, boolean>>({})
  const [inviteName, setInviteName] = useState("")
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [editForm, setEditForm] = useState({
    rank: 0,
    isLeader: false,
    isMedic: false,
    hasBank: false,
    hasStorage: false,
    note: "",
  })

  // Annahme: Der aktuelle Benutzer ist Leader (für Demo-Zwecke)
  const isCurrentUserLeader = true

  // Sortiere Teammitglieder nach Rang (absteigend)
  const sortedMembers = [...teamMembers].sort((a, b) => b.rank - a.rank)

  // Filtere Teammitglieder basierend auf aktivem Tab und Suchbegriff
  const filteredMembers = sortedMembers.filter(
    (member) =>
      (activeTab === "online" ? member.online : true) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.rank.toString().includes(searchTerm) ||
        (member.note && member.note.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  // Gruppiere Teammitglieder nach Rang
  const membersByRank: Record<number, TeamMember[]> = {}
  filteredMembers.forEach((member) => {
    if (!membersByRank[member.rank]) {
      membersByRank[member.rank] = []
    }
    membersByRank[member.rank].push(member)
  })

  // Zähle online und alle Mitglieder
  const onlineCount = teamMembers.filter((member) => member.online).length
  const totalCount = teamMembers.length

  const toggleRankExpand = (rank: number) => {
    setExpandedRanks((prev) => ({
      ...prev,
      [rank]: !prev[rank],
    }))
  }

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member)
    setView("detail")
  }

  const handleEditMember = () => {
    if (selectedMember) {
      setEditForm({
        rank: selectedMember.rank,
        isLeader: selectedMember.isLeader,
        isMedic: selectedMember.isMedic,
        hasBank: selectedMember.hasBank || false,
        hasStorage: selectedMember.hasStorage || false,
        note: selectedMember.note || "",
      })
      setView("edit")
    }
  }

  const handleSaveEdit = () => {
    // In einer echten App würde hier die Änderung gespeichert werden
    alert(`Änderungen für ${selectedMember?.name} gespeichert`)
    setView("detail")
  }

  const handleInvite = () => {
    if (inviteName.trim()) {
      // In einer echten App würde hier die Einladung gesendet werden
      alert(`Einladung an ${inviteName} gesendet`)
      setInviteName("")
      setView("main")
    }
  }

  const handleCall = () => {
    if (selectedMember) {
      // Wechsle zur Anruf-App und starte einen Anruf
      setActiveApp("call")
      // Verzögerung, damit die App-Umschaltung abgeschlossen ist
      setTimeout(() => {
        // Hier einen benutzerdefinierten Event auslösen, den die CallApp abfangen kann
        const event = new CustomEvent("startCall", {
          detail: { contactId: selectedMember.id, number: selectedMember.id, name: selectedMember.name },
        })
        window.dispatchEvent(event)
      }, 100)
    }
  }

  // Ändere die handleMessage Funktion, um direkt zum Chat zu navigieren
  const handleMessage = () => {
    if (selectedMember) {
      const chatId = createChat(selectedMember.id)
      setActiveApp("messages")

      // Verzögerung, damit die App-Umschaltung abgeschlossen ist
      setTimeout(() => {
        // Hier einen benutzerdefinierten Event auslösen, den die MessagesApp abfangen kann
        const event = new CustomEvent("openChat", {
          detail: { chatId, contactId: selectedMember.id },
        })
        window.dispatchEvent(event)
      }, 100)
    }
  }

  const handleDeletePrompt = () => {
    setShowConfirmDelete(true)
  }

  const handleConfirmDelete = () => {
    alert(`${selectedMember?.name} wurde aus dem Team entfernt`)
    setShowConfirmDelete(false)
    setView("main")
  }

  const handleCancelDelete = () => {
    setShowConfirmDelete(false)
  }

  if (view === "detail" && selectedMember) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
          <button onClick={() => setView("main")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-semibold text-white">Mitglied</h1>
          {isCurrentUserLeader && (
            <button onClick={handleEditMember} className="text-blue-400 w-8 h-8 flex items-center justify-center">
              <Edit size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profil-Header */}
          <div className="p-4 flex flex-col items-center border-b border-gray-800">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-xl mb-3 z-10">
              {selectedMember.name.charAt(0).toUpperCase()}
              {selectedMember.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-white">{selectedMember.name}</h2>
            <div className="flex items-center mt-2 space-x-2">
              <div className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-300 flex items-center">
                <Briefcase className="w-3 h-3 mr-1" />
                <span>Rang {selectedMember.rank}</span>
              </div>
              {selectedMember.isLeader && (
                <div className="px-2 py-1 rounded-full text-xs bg-red-900/30 text-red-400 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Leader</span>
                </div>
              )}
              {selectedMember.isMedic && (
                <div className="px-2 py-1 rounded-full text-xs bg-red-900/30 text-red-400 flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  <span>Medic</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <span className={selectedMember.online ? "text-green-500" : "text-gray-500"}>
                {selectedMember.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Mitglied-Details */}
          <div className="p-3 space-y-3">
            {selectedMember.note && (
              <div className="flex items-start p-3 bg-gray-800 rounded-lg">
                <Info className="text-blue-400 mr-3 mt-0.5" size={14} />
                <div className="flex-1">
                  <div className="text-xs text-gray-400">Notiz</div>
                  <div className="text-sm font-medium text-white">{selectedMember.note}</div>
                </div>
              </div>
            )}
          </div>

          {/* Aktionen */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-900 mt-2 border-t border-gray-800">
            <button
              onClick={handleMessage}
              className="flex flex-col items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={!selectedMember.online}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  selectedMember.online ? "bg-blue-900/50 text-blue-400" : "bg-gray-700 text-gray-500"
                }`}
              >
                <MessageSquare size={16} />
              </div>
              <span className={`text-xs ${selectedMember.online ? "text-white" : "text-gray-500"}`}>Nachricht</span>
            </button>

            <button
              onClick={handleCall}
              className="flex flex-col items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={!selectedMember.online}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  selectedMember.online ? "bg-green-900/50 text-green-400" : "bg-gray-700 text-gray-500"
                }`}
              >
                <Phone size={16} />
              </div>
              <span className={`text-xs ${selectedMember.online ? "text-white" : "text-gray-500"}`}>Anrufen</span>
            </button>
          </div>

          {/* Löschen Button (nur für Leader) */}
          {isCurrentUserLeader && selectedMember.id !== 1 && (
            <div className="p-3 mt-auto">
              <button
                onClick={handleDeletePrompt}
                className="w-full py-2 text-center text-xs text-red-500 font-medium bg-gray-800 rounded-lg"
              >
                Mitglied entfernen
              </button>
            </div>
          )}
        </div>

        {/* Lösch-Bestätigung */}
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg w-64 overflow-hidden">
              <div className="p-4 text-center">
                <h3 className="text-base font-semibold mb-2 text-white">Mitglied entfernen</h3>
                <p className="text-xs text-gray-300">
                  Möchtest du {selectedMember?.name} wirklich aus dem Team entfernen?
                </p>
              </div>
              <div className="flex border-t border-gray-700">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 p-3 text-xs text-blue-400 font-medium border-r border-gray-700"
                >
                  Abbrechen
                </button>
                <button onClick={handleConfirmDelete} className="flex-1 p-3 text-xs text-red-500 font-medium">
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (view === "edit" && selectedMember) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
          <button onClick={() => setView("detail")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-semibold text-white">Bearbeiten</h1>
          <button onClick={handleSaveEdit} className="text-blue-400 text-xs font-medium">
            Fertig
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold text-base mr-3">
              {selectedMember.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">{selectedMember.name}</h2>
              <p className="text-xs text-gray-400">{selectedMember.online ? "Online" : "Offline"}</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Rang */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Rang</label>
              <input
                type="number"
                min="0"
                max="12"
                value={editForm.rank}
                onChange={(e) => setEditForm({ ...editForm, rank: Number.parseInt(e.target.value) || 0 })}
                className="w-full p-2 text-xs border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            {/* Leader */}
            <CustomCheckbox
              id="isLeader"
              checked={editForm.isLeader}
              onChange={(checked) => setEditForm({ ...editForm, isLeader: checked })}
              label={
                <div className="flex items-center">
                  <span>Leader</span>
                  <Shield size={10} className="ml-1 text-red-400" />
                </div>
              }
            />

            {/* Medic */}
            <CustomCheckbox
              id="isMedic"
              checked={editForm.isMedic}
              onChange={(checked) => setEditForm({ ...editForm, isMedic: checked })}
              label={
                <div className="flex items-center">
                  <span>Medic</span>
                  <Heart size={10} className="ml-1 text-red-400" />
                </div>
              }
            />
            <CustomCheckbox
              id="hasBank"
              checked={editForm.hasBank}
              onChange={(checked) => setEditForm({ ...editForm, hasBank: checked })}
              label="Bank"
            />

            <CustomCheckbox
              id="hasStorage"
              checked={editForm.hasStorage}
              onChange={(checked) => setEditForm({ ...editForm, hasStorage: checked })}
              label="Lager"
            />

            {/* Notiz */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Notiz</label>
              <textarea
                value={editForm.note}
                onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                className="w-full p-2 text-xs border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none min-h-[80px]"
                placeholder="Notiz hinzufügen..."
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === "invite") {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
          <button onClick={() => setView("main")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-semibold text-white">Einladen</h1>
          <div className="w-8 h-8"></div>
        </div>

        <div className="flex-1 p-3">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 mb-3">
              <UserPlus size={18} />
            </div>
            <p className="text-center text-xs text-gray-400">
              Gib den Namen oder die ID des Spielers ein, den du einladen möchtest.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Name oder ID</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Name oder ID eingeben"
                className="w-full p-2 text-xs border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Einladen Button */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleInvite}
            disabled={!inviteName.trim()}
            className={`w-full py-2 text-xs text-center font-medium rounded-lg flex items-center justify-center ${
              inviteName.trim() ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
            }`}
          >
            <UserPlus size={14} className="mr-2" />
            Einladen
          </button>
        </div>
      </div>
    )
  }

  if (view === "settings") {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        {/* Header */}
        <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
          <button onClick={() => setView("main")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-base font-semibold text-white">Einstellungen</h1>
          <div className="w-8 h-8"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-1">Team-Informationen</h3>
              <p className="text-xs text-gray-400">
                Hier kannst du die Informationen deines Teams bearbeiten und verwalten.
              </p>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-1">Motd</h3>
              <p className="text-xs text-gray-400">Setze eine Nachricht des Tages für dein Team.</p>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-1">Berechtigungen</h3>
              <p className="text-xs text-gray-400">Verwalte die Berechtigungen und Rollen deiner Teammitglieder.</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Lager</span>
                  <button className="px-2 py-1 text-xs bg-gray-700 rounded text-gray-300 hover:bg-gray-600">
                    Verwalten
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Bank</span>
                  <button className="px-2 py-1 text-xs bg-gray-700 rounded text-gray-300 hover:bg-gray-600">
                    Verwalten
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-1">Gehälter</h3>
              <p className="text-xs text-gray-400">Lege die Gehälter für verschiedene Ränge in deinem Team fest.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-base font-semibold text-white">Team</h1>
        <div className="flex space-x-2">
          {isCurrentUserLeader && (
            <button
              onClick={() => setView("settings")}
              className="text-blue-400 w-8 h-8 flex items-center justify-center"
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs und Suchleiste */}
      <div className="p-3 space-y-2 bg-gray-900">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("online")}
            className={`flex-1 py-1.5 rounded-md text-xs text-center ${
              activeTab === "online" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Online ({onlineCount})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 rounded-md text-xs text-center ${
              activeTab === "all" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Alle ({totalCount})
          </button>
        </div>

        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Suchen..."
            className="bg-transparent w-full outline-none text-xs text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Team-Liste */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(membersByRank).length > 0 ? (
          Object.keys(membersByRank)
            .map(Number)
            .sort((a, b) => b - a)
            .map((rank) => {
              const isExpanded = expandedRanks[rank] !== false // Default to expanded

              return (
                <div key={rank} className="mb-1">
                  <button
                    onClick={() => toggleRankExpand(rank)}
                    className="w-full sticky top-0 bg-gray-800 px-3 py-2 text-xs font-medium text-white flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1 text-blue-400" />
                      <span>Rang {rank}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div>
                      {membersByRank[rank].map((member) => (
                        <div
                          key={member.id}
                          onClick={() => handleSelectMember(member)}
                          className="flex items-center px-3 py-2 border-b border-gray-800 active:bg-gray-800"
                        >
                          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-semibold mr-2 z-0">
                            {member.name.charAt(0).toUpperCase()}
                            {member.online && (
                              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-gray-900"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="text-xs font-medium text-white">{member.name}</h3>
                              <div className="flex ml-1 space-x-1">
                                {member.isLeader && (
                                  <div className="w-4 h-4 rounded-full bg-red-900/50 flex items-center justify-center text-red-400">
                                    <Shield size={8} />
                                  </div>
                                )}
                                {member.isMedic && (
                                  <div className="w-4 h-4 rounded-full bg-red-900/50 flex items-center justify-center text-red-400">
                                    <Heart size={8} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                              <span className={member.online ? "text-green-500" : "text-gray-500"}>
                                {member.online ? "Online" : "Offline"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <Users size={24} className="mb-2" />
            <p className="text-xs">Keine Teammitglieder gefunden</p>
          </div>
        )}
      </div>

      {/* Einladen Button (nur für Leader) */}
      {isCurrentUserLeader && (
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => setView("invite")}
            className="w-full py-2 text-xs text-center bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center"
          >
            <UserPlus size={14} className="mr-2" />
            Mitglied einladen
          </button>
        </div>
      )}
    </div>
  )
}
