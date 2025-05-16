"use client"

import { useState } from "react"
import { Plus, Star, Search, Phone, MessageSquare, MapPin, ArrowLeft, Check, Edit } from "lucide-react"
import type { Call } from "../../types"
import { ContactDto } from "@shared/models/ContactDto"

interface ContactsAppProps {
  contacts: ContactDto[]
  addContact: (contact: Omit<ContactDto, "id">) => void
  updateContact: (contact: ContactDto) => void
  deleteContact: (id: number) => void
  toggleFavorite: (id: number) => void
  createChat: (contactId: number) => void
  addCall: (call: Omit<Call, "id" | "date">) => void
  setActiveApp: (app: string) => void
}

// Eigene Checkbox-Komponente
function CustomCheckbox({
  checked,
  onChange,
  label,
  id,
}: { checked: boolean; onChange: (checked: boolean) => void; label: string; id: string }) {
  return (
    <div className="flex items-center">
      <div
        className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer ${checked ? "bg-blue-500" : "bg-gray-800 border border-gray-600"}`}
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

export default function ContactsApp({
  contacts,
  addContact,
  updateContact,
  deleteContact,
  toggleFavorite,
  createChat,
  addCall,
  setActiveApp,
}: ContactsAppProps) {
  const [view, setView] = useState<"list" | "detail" | "edit" | "add">("list")
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editForm, setEditForm] = useState<Omit<ContactDto, "id">>({
    name: "",
    number: "0",
    pinned: false,
  })

  // Sortiere Kontakte: Favoriten zuerst, dann alphabetisch
  const sortedContacts = [...contacts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return a.name.localeCompare(b.name)
  })

  const filteredContacts = sortedContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.number.toString().includes(searchTerm),
  )

  const handleSelectContact = (contact: ContactDto) => {
    setSelectedContact(contact)
    setView("detail")
  }

  const handleAddNew = () => {
    setEditForm({
      name: "",
      number: "0",
      pinned: false,
    })
    setView("add")
  }

  const handleEditContact = () => {
    if (selectedContact) {
      setEditForm({
        name: selectedContact.name,
        number: selectedContact.number,
        pinned: selectedContact.pinned,
      })
      setView("edit")
    }
  }

  const handleDeletePrompt = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (selectedContact) {
      deleteContact(selectedContact.id)
      setShowDeleteConfirm(false)
      setView("list")
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  const handleSaveContact = () => {
    if (view === "add") {
      addContact(editForm)
      setView("list")
    } else if (view === "edit" && selectedContact) {
      updateContact({
        ...editForm,
        id: selectedContact.id,
      })
      setSelectedContact({
        ...editForm,
        id: selectedContact.id,
      })
      setView("detail")
    }
  }

  // Ändere die handleCall Funktion, um die neue Anruffunktionalität zu nutzen
  const handleCall = () => {
    if (selectedContact) {
      // Wechsle zur Anruf-App und starte einen Anruf
      setActiveApp("call")
      // Verzögerung, damit die App-Umschaltung abgeschlossen ist
      setTimeout(() => {
        // Hier einen benutzerdefinierten Event auslösen, den die CallApp abfangen kann
        const event = new CustomEvent("startCall", {
          detail: { contactId: selectedContact.id, number: selectedContact.number, name: selectedContact.name },
        })
        window.dispatchEvent(event)
      }, 100)
    }
  }

  // Ändere die handleMessage Funktion, um direkt zum Chat zu navigieren
  const handleMessage = () => {
    if (selectedContact) {
      const chatId = createChat(selectedContact.id)
      setActiveApp("messages")

      // Verzögerung, damit die App-Umschaltung abgeschlossen ist
      setTimeout(() => {
        // Hier einen benutzerdefinierten Event auslösen, den die MessagesApp abfangen kann
        const event = new CustomEvent("openChat", {
          detail: { chatId, contactId: selectedContact.id },
        })
        window.dispatchEvent(event)
      }, 100)
    }
  }

  const handleSendLocation = () => {
    if (selectedContact) {
      // In einer echten App würde hier der Standort gesendet werden
      alert(`Standort an ${selectedContact.name} gesendet`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        {view !== "list" ? (
          <button
            onClick={() => (view === "detail" ? setView("list") : setView(selectedContact ? "detail" : "list"))}
            className="text-blue-400 w-8 h-8 flex items-center justify-center"
          >
            <ArrowLeft size={16} />
          </button>
        ) : (
          <h1 className="text-base font-semibold text-white">Kontakte</h1>
        )}

        {view === "list" && (
          <button onClick={handleAddNew} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <Plus size={16} />
          </button>
        )}

        {view === "detail" && (
          <button onClick={handleEditContact} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <Edit size={16} />
          </button>
        )}

        {(view === "edit" || view === "add") && (
          <button onClick={handleSaveContact} className="text-blue-400 text-xs font-medium">
            Fertig
          </button>
        )}
      </div>

      {view === "list" && (
        <>
          {/* Suchleiste */}
          <div className="px-3 pt-2 pb-3">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Suchen"
                className="bg-transparent w-full outline-none text-xs text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Kontaktliste */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className="flex items-center px-3 py-2 border-b border-gray-800 active:bg-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold mr-2">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-medium text-white">{contact.name}</h3>
                  <p className="text-xs text-gray-400">{contact.number}</p>
                </div>
                {contact.pinned && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
              </div>
            ))}
          </div>
        </>
      )}

      {view === "detail" && selectedContact && (
        <div className="flex-1 flex flex-col">
          {/* Kontaktdetails */}
          <div className="flex flex-col items-center p-4 bg-gray-900">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold text-xl mb-2">
              {selectedContact.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-base font-semibold text-white">{selectedContact.name}</h2>
            <p className="text-xs text-gray-400 mt-1">{selectedContact.number}</p>
            <button
              onClick={() => toggleFavorite(selectedContact.id)}
              className="mt-2 flex items-center text-xs text-gray-400"
            >
              <Star
                size={14}
                className={`mr-1 ${selectedContact.pinned ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
              />
              {selectedContact.pinned ? "Favorit entfernen" : "Als Favorit markieren"}
            </button>
          </div>

          {/* Aktionen */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-gray-900 mt-2 border-t border-b border-gray-800">
            <button onClick={handleMessage} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mb-1">
                <MessageSquare size={16} />
              </div>
              <span className="text-xs text-gray-400">Nachricht</span>
            </button>

            <button onClick={handleCall} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mb-1">
                <Phone size={16} />
              </div>
              <span className="text-xs text-gray-400">Anrufen</span>
            </button>

            <button onClick={handleSendLocation} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 mb-1">
                <MapPin size={16} />
              </div>
              <span className="text-xs text-gray-400">Standort</span>
            </button>
          </div>

          {/* Löschen Button */}
          <div className="mt-auto p-3">
            <button
              onClick={handleDeletePrompt}
              className="w-full py-2 text-xs text-center text-red-500 font-medium bg-gray-800 rounded-lg"
            >
              Kontakt löschen
            </button>
          </div>
        </div>
      )}

      {(view === "edit" || view === "add") && (
        <div className="flex-1 p-3 bg-gray-900">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 text-xs border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Nummer</label>
              <input
                type="number"
                value={editForm.number || ""}
                onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                className="w-full p-2 text-xs border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            <CustomCheckbox
              id="favorite"
              checked={editForm.pinned}
              onChange={(checked) => setEditForm({ ...editForm, pinned: checked })}
              label="Als Favorit markieren"
            />
          </div>
        </div>
      )}

      {/* Lösch-Bestätigung */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-64 overflow-hidden">
            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold mb-2 text-white">Kontakt löschen</h3>
              <p className="text-xs text-gray-300">
                Möchtest du den Kontakt "{selectedContact?.name}" wirklich löschen?
              </p>
            </div>
            <div className="flex border-t border-gray-700">
              <button
                onClick={handleCancelDelete}
                className="flex-1 p-2 text-xs text-blue-400 font-medium border-r border-gray-700"
              >
                Abbrechen
              </button>
              <button onClick={handleConfirmDelete} className="flex-1 p-2 text-xs text-red-500 font-medium">
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
