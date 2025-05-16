"use client"
import { ImageIcon, Volume2, Bell, Moon, Check } from "lucide-react"
import type { AppSettings } from "../../types"

interface SettingsAppProps {
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
}

export default function SettingsApp({ settings, updateSettings }: SettingsAppProps) {
  const wallpapers = [
    { id: "gradient-dark", name: "Dunkel (Gradient)" },
    { id: "gradient-blue", name: "Blau (Gradient)" },
    { id: "gradient-purple", name: "Lila (Gradient)" },
    { id: "solid-black", name: "Schwarz" },
  ]

  const ringtones = [
    { id: "default", name: "Standard" },
    { id: "classic", name: "Klassisch" },
    { id: "digital", name: "Digital" },
    { id: "retro", name: "Retro" },
  ]

  const messageSounds = [
    { id: "default", name: "Standard" },
    { id: "subtle", name: "Dezent" },
    { id: "chime", name: "Glocke" },
    { id: "none", name: "Keine" },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-base font-semibold text-white">Einstellungen</h1>
      </div>

      {/* Einstellungen */}
      <div className="flex-1 overflow-y-auto">
        {/* Hintergrundbild */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center mb-3">
            <ImageIcon className="text-blue-400 mr-2" size={14} />
            <h2 className="text-sm font-medium text-white">Hintergrundbild</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => updateSettings({ wallpaper: wallpaper.id as any })}
                className={`relative p-2 rounded-lg ${
                  settings.wallpaper === wallpaper.id ? "border-2 border-blue-500" : "border border-gray-700"
                } ${
                  wallpaper.id === "gradient-dark"
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
                    : wallpaper.id === "gradient-blue"
                      ? "bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900"
                      : wallpaper.id === "gradient-purple"
                        ? "bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900"
                        : "bg-black"
                }`}
              >
                <div className="h-12 mb-1 rounded"></div>
                <div className="text-xs text-white text-center">{wallpaper.name}</div>
                {settings.wallpaper === wallpaper.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Anrufton */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center mb-3">
            <Volume2 className="text-blue-400 mr-2" size={14} />
            <h2 className="text-sm font-medium text-white">Anrufton</h2>
          </div>
          <div className="space-y-2">
            {ringtones.map((ringtone) => (
              <button
                key={ringtone.id}
                onClick={() => updateSettings({ ringtone: ringtone.id })}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.ringtone === ringtone.id
                    ? "bg-blue-600/20 border border-blue-500/50"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <span className="text-xs text-white">{ringtone.name}</span>
                {settings.ringtone === ringtone.id && <Check size={12} className="text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Nachrichtenton */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center mb-3">
            <Bell className="text-blue-400 mr-2" size={14} />
            <h2 className="text-sm font-medium text-white">Nachrichtenton</h2>
          </div>
          <div className="space-y-2">
            {messageSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => updateSettings({ messageSound: sound.id })}
                className={`w-full flex items-center justify-between p-2 rounded-lg ${
                  settings.messageSound === sound.id
                    ? "bg-blue-600/20 border border-blue-500/50"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <span className="text-xs text-white">{sound.name}</span>
                {settings.messageSound === sound.id && <Check size={12} className="text-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Vibration */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="text-blue-400 mr-2" size={14} />
              <h2 className="text-sm font-medium text-white">Vibration</h2>
            </div>
            <button
              onClick={() => updateSettings({ vibration: !settings.vibration })}
              className={`w-10 h-5 rounded-full flex items-center transition-colors duration-300 ${
                settings.vibration ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-0.5"></div>
            </button>
          </div>
        </div>

        {/* Dark Mode */}
        <div className="p-3 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="text-blue-400 mr-2" size={14} />
              <h2 className="text-sm font-medium text-white">Dark Mode</h2>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-10 h-5 rounded-full flex items-center transition-colors duration-300 ${
                settings.darkMode ? "bg-blue-600 justify-end" : "bg-gray-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform mx-0.5"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
