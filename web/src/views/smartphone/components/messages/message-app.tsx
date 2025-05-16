"use client"

import { useState, useRef, useEffect } from "react"
import { Send, MapPin, User, MoreVertical, Paperclip, ArrowLeft, Search, Plus, Clock } from "lucide-react"
import type { Chat, Message } from "../../types"
import { ContactDto } from "@shared/models/ContactDto"

interface MessagesAppProps {
  chats: Chat[]
  contacts: ContactDto[]
  addMessage: (chatId: number, message: Omit<Message, "id" | "timestamp">) => void
  getContactById: (id: number) => ContactDto | undefined
  createChat: (contactId: number) => number
}

export default function MessagesApp({ chats, contacts, addMessage, getContactById, createChat }: MessagesAppProps) {
  const [view, setView] = useState<"list" | "chat" | "new">("list")
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Automatisches Scrollen zum Ende der Nachrichten
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChat?.messages])

  // Füge einen Event-Listener hinzu, um direkt zu einem Chat zu navigieren
  useEffect(() => {
    const handleOpenChat = (event: CustomEvent) => {
      const { chatId, contactId } = event.detail
      const chat = chats.find((c) => c.id === chatId)
      if (chat) {
        setSelectedChat(chat)
        setView("chat")
      }
    }

    window.addEventListener("openChat", handleOpenChat as EventListener)

    return () => {
      window.removeEventListener("openChat", handleOpenChat as EventListener)
    }
  }, [chats])

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setView("chat")
    setShowOptions(false)
  }

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim()) {
      addMessage(selectedChat.id, {
        text: newMessage,
        sent: true,
      })
      setNewMessage("")
    }
  }

  const handleSendLocation = () => {
    if (selectedChat) {
      addMessage(selectedChat.id, {
        text: "Mein aktueller Standort",
        sent: true,
        location: { lat: 48.137154, lng: 11.576124 }, // Beispiel-Koordinaten
      })
      setShowOptions(false)
    }
  }

  const handleSendContact = (contactId: number) => {
    if (selectedChat) {
      addMessage(selectedChat.id, {
        text: "Kontakt geteilt",
        sent: true,
        contactId,
      })
      setShowOptions(false)
    }
  }

  const handleNewChat = () => {
    setView("new")
  }

  const handleStartChat = (contactId: number) => {
    const chatId = createChat(contactId)
    const chat = chats.find((c) => c.id === chatId)
    if (chat) {
      setSelectedChat(chat)
      setView("chat")
    }
  }

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      return "Heute"
    } else if (date >= yesterday) {
      return "Gestern"
    } else {
      return date.toLocaleDateString()
    }
  }

  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return null
    return chat.messages[chat.messages.length - 1]
  }

  // Filtern der Chats basierend auf der Suche
  const filteredChats = chats.filter((chat) => {
    const contact = getContactById(chat.contactId)
    const lastMessage = getLastMessage(chat)

    return (
      contact?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lastMessage && lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  // Filtern der Kontakte für neue Chats
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.number.toString().includes(searchTerm),
  )

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        {view === "chat" && (
          <button onClick={() => setView("list")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
        )}

        {view === "new" && (
          <button onClick={() => setView("list")} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <ArrowLeft size={16} />
          </button>
        )}

        <h1 className="text-base font-semibold text-white">
          {view === "list"
            ? "Nachrichten"
            : view === "new"
              ? "Neuer Chat"
              : selectedChat
                ? getContactById(selectedChat.contactId)?.name || "Chat"
                : "Chat"}
        </h1>

        {view === "list" && (
          <button onClick={handleNewChat} className="text-blue-400 w-8 h-8 flex items-center justify-center">
            <Plus size={16} />
          </button>
        )}

        {view === "chat" && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-blue-400 w-8 h-8 flex items-center justify-center"
            >
              <MoreVertical size={16} />
            </button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={handleSendLocation}
                  className="flex items-center w-full p-2 text-left hover:bg-gray-700"
                >
                  <MapPin size={12} className="mr-2 text-red-400" />
                  <span className="text-white text-xs">Standort senden</span>
                </button>
                <button
                  onClick={() => {
                    // Hier würde ein Modal geöffnet werden, um einen Kontakt auszuwählen
                    // Für dieses Beispiel wählen wir einfach den ersten Kontakt
                    if (contacts.length > 0) {
                      handleSendContact(contacts[0].id)
                    }
                  }}
                  className="flex items-center w-full p-2 text-left hover:bg-gray-700"
                >
                  <User size={12} className="mr-2 text-blue-400" />
                  <span className="text-white text-xs">Kontakt senden</span>
                </button>
              </div>
            )}
          </div>
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
                placeholder="Suchen..."
                className="bg-transparent w-full outline-none text-xs text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-900">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Clock size={24} className="mb-2" />
                <p className="text-xs">Keine Nachrichten vorhanden</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const contact = getContactById(chat.contactId)
                const lastMessage = getLastMessage(chat)

                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className="flex items-center px-3 py-2 border-b border-gray-800 active:bg-gray-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold mr-2">
                      {contact ? contact.name.charAt(0).toUpperCase() : "#"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-white">{contact ? contact.name : "Unbekannt"}</h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">{formatTime(lastMessage.timestamp)}</span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-xs text-gray-400 truncate">
                          {lastMessage.sent ? "Du: " : ""}
                          {lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {view === "new" && (
        <>
          {/* Suchleiste */}
          <div className="px-3 pt-2 pb-3">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Kontakt suchen..."
                className="bg-transparent w-full outline-none text-xs text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-900">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <User size={24} className="mb-2" />
                <p className="text-xs">Keine Kontakte gefunden</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartChat(contact.id)}
                  className="flex items-center px-3 py-2 border-b border-gray-800 active:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-semibold mr-2">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-medium text-white">{contact.name}</h3>
                    <p className="text-xs text-gray-400">{contact.number}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {view === "chat" && selectedChat && (
        <>
          {/* Chat-Nachrichten */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-800">
            {selectedChat.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p className="text-xs">Keine Nachrichten vorhanden</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedChat.messages.map((message, index) => {
                  const contact = getContactById(selectedChat.contactId)
                  const prevMessage = index > 0 ? selectedChat.messages[index - 1] : null
                  const showDate = !prevMessage || formatDate(message.timestamp) !== formatDate(prevMessage.timestamp)
                  const isSameAuthor = prevMessage && prevMessage.sent === message.sent
                  const showAuthor = !isSameAuthor || showDate

                  return (
                    <div key={message.id}>
                      {showDate && (
                        <div className="flex justify-center my-2">
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex ${message.sent ? "justify-end" : "justify-start"} ${
                          !showAuthor && !message.sent ? "pl-6" : ""
                        } ${!showAuthor && message.sent ? "pr-6" : ""}`}
                      >
                        {!message.sent && showAuthor && (
                          <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-blue-400 font-semibold mr-1 self-end">
                            {contact ? contact.name.charAt(0).toUpperCase() : "#"}
                          </div>
                        )}

                        <div
                          className={`max-w-[70%] rounded-lg p-2 ${
                            message.sent
                              ? "bg-blue-600 text-white rounded-tr-none"
                              : "bg-gray-700 text-white rounded-tl-none"
                          } ${!showAuthor && !message.sent ? "rounded-tl-lg" : ""} ${
                            !showAuthor && message.sent ? "rounded-tr-lg" : ""
                          }`}
                        >
                          {message.location && (
                            <div className="flex items-center mb-1 text-xs">
                              <MapPin size={12} className={message.sent ? "text-blue-200" : "text-red-400"} />
                              <span className="ml-1">Standort</span>
                            </div>
                          )}

                          {message.contactId && (
                            <div className="flex items-center mb-1 text-xs">
                              <User size={12} className={message.sent ? "text-blue-200" : "text-blue-400"} />
                              <span className="ml-1">{getContactById(message.contactId)?.name || "Kontakt"}</span>
                            </div>
                          )}

                          <p className="text-xs">{message.text}</p>
                          <div
                            className={`text-[10px] text-right mt-1 ${message.sent ? "text-blue-200" : "text-gray-300"}`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Nachrichteneingabe */}
          <div className="p-2 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center">
              <button onClick={() => setShowOptions(!showOptions)} className="p-1.5 text-gray-400">
                <Paperclip size={16} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nachricht"
                className="flex-1 p-1.5 bg-gray-800 rounded-full mx-2 outline-none text-xs text-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-1.5 rounded-full ${newMessage.trim() ? "text-blue-400" : "text-gray-600"}`}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
