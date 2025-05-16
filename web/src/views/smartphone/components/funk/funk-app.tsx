"use client"
import { useState, useEffect } from "react"
import { Radio, Mic, Volume2, VolumeX, Star, Check, Edit, Trash2 } from "lucide-react"
import type React from "react"
import { RadioState } from "@shared/enum/RadioState"

interface SavedChannel {
  id: number
  frequency: string
  name: string
}

export default function FunkApp() {
  const [frequency, setFrequency] = useState("")
  const [editingChannelId, setEditingChannelId] = useState<number | null>(null)
  const [editChannelName, setEditChannelName] = useState("")
  const [savedChannels, setSavedChannels] = useState<SavedChannel[]>([
    { id: 1, frequency: "123.45", name: "Polizei Funk" },
    { id: 2, frequency: "456.78", name: "Medic Funk" },
    { id: 3, frequency: "789.01", name: "Mechaniker" },
  ])
  const [isJoined, setIsJoined] = useState(false)
  const [transmitMode, setTransmitMode] = useState<RadioState>(RadioState.NC)
  const [isPushingToTalk, setIsPushingToTalk] = useState(false)

  // Simuliere Push-to-Talk Tastendruck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyV" && transmitMode === RadioState.PTT && isJoined) {
        setIsPushingToTalk(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyV" && transmitMode === RadioState.PTT && isJoined) {
        setIsPushingToTalk(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [transmitMode, isJoined])

  const handleJoin = () => {
    if (frequency.trim()) {
      setIsJoined(true)
      setTransmitMode(RadioState.NC)
    }
  }

  const handleLeave = () => {
    setIsJoined(false)
    setTransmitMode(RadioState.NC)
  }

  const handleSaveChannel = () => {
    if (frequency.trim()) {
      const newChannel: SavedChannel = {
        id: savedChannels.length > 0 ? Math.max(...savedChannels.map((c) => c.id)) + 1 : 1,
        frequency: frequency,
        name: "Unbenannt",
      }
      setSavedChannels([...savedChannels, newChannel])
    }
  }

  const handleSelectSavedChannel = (channel: SavedChannel) => {
    setFrequency(channel.frequency)
    setIsJoined(true)
    setTransmitMode(RadioState.NC)
  }

  const handleDeleteSavedChannel = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedChannels(savedChannels.filter((channel) => channel.id !== id))
  }

  const handleEditChannel = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const channel = savedChannels.find((c) => c.id === id)
    if (channel) {
      setEditingChannelId(id)
      setEditChannelName(channel.name)
    }
  }

  const handleSaveEdit = () => {
    if (editingChannelId !== null) {
      setSavedChannels(
        savedChannels.map((channel) =>
          channel.id === editingChannelId ? { ...channel, name: editChannelName.trim() || "Unbenannt" } : channel,
        ),
      )
      setEditingChannelId(null)
      setEditChannelName("")
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white">Funk</h1>
      </div>

      {/* Frequenz-Eingabe */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Frequenz eingeben (z.B. 123.45)"
            className="flex-1 p-2 text-sm border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
            disabled={isJoined}
          />
          <button
            onClick={handleSaveChannel}
            disabled={!frequency.trim() || isJoined}
            className={`ml-2 p-2 rounded-lg ${
              !frequency.trim() || isJoined ? "bg-gray-700 text-gray-500" : "bg-gray-800 text-blue-400"
            }`}
          >
            <Star size={16} />
          </button>
        </div>

        <button
          onClick={isJoined ? handleLeave : handleJoin}
          disabled={!frequency.trim() && !isJoined}
          className={`w-full py-2 text-sm text-center font-medium rounded-lg ${
            !frequency.trim() && !isJoined
              ? "bg-gray-700 text-gray-400"
              : isJoined
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
          }`}
        >
          {isJoined ? "Verlassen" : "Beitreten"}
        </button>
      </div>

      {/* Übertragungsmodus (nur anzeigen, wenn beigetreten) */}
      {isJoined && (
        <div className="p-3 border-b border-gray-800">
          <h3 className="text-sm font-medium text-white mb-2">Übertragungsmodus</h3>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => setTransmitMode(RadioState.NC)}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg ${
                transmitMode === RadioState.NC
                  ? "bg-blue-600/20 border border-blue-500/50"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <VolumeX size={16} className="text-gray-400" />
              </div>
            </button>

            <button
              onClick={() => setTransmitMode(RadioState.PTT)}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg ${
                transmitMode === RadioState.PTT
                  ? "bg-blue-600/20 border border-blue-500/50"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <Mic
                  size={16}
                  className={
                    transmitMode === RadioState.PTT ? (isPushingToTalk ? "text-green-500" : "text-orange-500") : "text-gray-400"
                  }
                />
              </div>
            </button>

            <button
              onClick={() => setTransmitMode(RadioState.TC)}
              className={`flex-1 flex items-center justify-center p-2 rounded-lg ${
                transmitMode === RadioState.TC
                  ? "bg-blue-600/20 border border-blue-500/50"
                  : "bg-gray-800 border border-gray-700"
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <Volume2 size={16} className={transmitMode === RadioState.TC ? "text-green-500" : "text-gray-400"} />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Gespeicherte Kanäle */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="text-sm font-medium text-white mb-2">Gespeicherte Kanäle</h3>
        {savedChannels.length > 0 ? (
          <div className="space-y-2">
            {savedChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleSelectSavedChannel(channel)}
                className="flex items-center p-2 bg-gray-800 rounded-lg active:bg-gray-700"
              >
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 mr-2">
                  <Radio size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  {editingChannelId === channel.id ? (
                    <div className="flex items-center bg-gray-700 rounded-md overflow-hidden pr-1 max-w-[120px]">
                      <input
                        type="text"
                        value={editChannelName}
                        onChange={(e) => setEditChannelName(e.target.value)}
                        className="w-full p-1 bg-gray-700 text-white outline-none text-xs"
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveEdit()
                        }}
                        className="ml-1 w-5 h-5 flex items-center justify-center bg-blue-500 rounded-full text-white flex-shrink-0"
                      >
                        <Check size={10} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-medium text-white text-sm truncate">{channel.name}</h3>
                  )}
                  <div className="text-xs text-gray-400">{channel.frequency} MHz</div>
                </div>
                <div className="flex ml-1">
                  <button
                    onClick={(e) => handleEditChannel(channel.id, e)}
                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-400 mr-1"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteSavedChannel(channel.id, e)}
                    className="w-6 h-6 flex items-center justify-center text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500">
            <Radio size={24} className="mb-2" />
            <p className="text-sm">Keine gespeicherten Kanäle</p>
          </div>
        )}
      </div>
    </div>
  )
}
