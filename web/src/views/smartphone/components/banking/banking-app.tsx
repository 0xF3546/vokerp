"use client"
import { useState } from "react"
import { CreditCard, DollarSign, ArrowDown, ArrowUp, Plus, ArrowLeft, Send, Clock, Search } from "lucide-react"
import { BankDto } from "@shared/models/BankDto"
import { TransactionDto } from "@shared/models/TransactionDto"

interface BankingAppProps {
  account: BankDto
  updateBalance: (amount: number) => void
  addTransaction: (transaction: Omit<TransactionDto, "id" | "date">) => void
}

export default function BankingApp({ account, updateBalance, addTransaction }: BankingAppProps) {
  const [view, setView] = useState<"main" | "transfer" | "history">("main")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferRecipient, setTransferRecipient] = useState("")
  const [transferDescription, setTransferDescription] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
  }

  // Format date
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
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
    }
  }

  const handleTransfer = () => {
    const amount = Number.parseFloat(transferAmount)
    if (isNaN(amount) || amount <= 0 || amount > account.bank) {
      alert("Ungültiger Betrag")
      return
    }

    if (!transferRecipient.trim()) {
      alert("Bitte Empfänger angeben")
      return
    }

    // Transaktion durchführen
    updateBalance(-amount)
    addTransaction({
      amount,
      reason: transferDescription || `Überweisung an ${transferRecipient}`,
      type: "outgoing",
    })

    // Zurücksetzen
    setTransferAmount("")
    setTransferRecipient("")
    setTransferDescription("")
    setView("main")

    alert(`${formatCurrency(amount)} erfolgreich an ${transferRecipient} überwiesen`)
  }

  // Filtern der Transaktionen für die Suche
  const filteredTransactions = account.transactions.filter(
    (transaction) =>
      transaction.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(transaction.amount).includes(searchTerm),
  )

  // Gruppieren der Transaktionen nach Datum
  const groupTransactionsByDate = (transactions: TransactionDto[]) => {
    const groups: Record<string, TransactionDto[]> = {}

    transactions.forEach((transaction) => {
      const dateKey = new Date(transaction.date).toLocaleDateString("de-DE")
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(transaction)
    })

    return groups
  }

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  // Icon und Farbe basierend auf Transaktionstyp
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return <ArrowDown className="text-green-500" size={16} />
      case "outgoing":
        return <ArrowUp className="text-red-500" size={16} />
      case "deposit":
        return <Plus className="text-blue-500" size={16} />
      case "withdrawal":
        return <ArrowUp className="text-orange-500" size={16} />
      default:
        return <Clock className="text-gray-500" size={16} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-800">
        {view !== "main" ? (
          <button onClick={() => setView("main")} className="text-blue-400 font-medium flex items-center text-sm">
            <ArrowLeft size={16} className="mr-1" />
            Zurück
          </button>
        ) : (
          <h1 className="text-lg font-semibold text-white">Banking</h1>
        )}

        {view === "main" && (
          <button onClick={() => setView("history")} className="text-blue-400">
            <Clock size={18} />
          </button>
        )}

        {view === "history" && <h1 className="text-lg font-semibold text-white">Transaktionen</h1>}
        {view === "transfer" && <h1 className="text-lg font-semibold text-white">Überweisung</h1>}
      </div>

      {view === "main" && (
        <div className="flex-1 overflow-y-auto">
          {/* Kontostand */}
          <div className="p-4 flex flex-col items-center border-b border-gray-800">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white mb-3">
              <CreditCard size={20} />
            </div>
            <div className="text-xs text-gray-400 mb-1">Kontostand</div>
            <div className="text-xl font-bold text-white">{formatCurrency(account.bank)}</div>
            <div className="text-xs text-gray-500 mt-1">Konto-Nr. soon</div>
          </div>

          {/* Aktionen */}
          <div className="p-3">
            <h2 className="text-sm font-medium text-white mb-3">Aktionen</h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setView("transfer")}
                className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 mr-3">
                  <Send size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white text-xs">Überweisung</div>
                  <div className="text-xs text-gray-400">Geld an andere Konten senden</div>
                </div>
              </button>
            </div>
          </div>

          {/* Letzte Transaktionen */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-white">Letzte Transaktionen</h2>
              <button onClick={() => setView("history")} className="text-xs text-blue-400">
                Alle anzeigen
              </button>
            </div>

            <div className="space-y-2">
              {account.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center p-2 bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-xs truncate">{transaction.reason}</div>
                    <div className="text-xs text-gray-400">{formatDate(new Date(transaction.date))}</div>
                  </div>
                  <div
                    className={`font-medium text-xs ${
                      transaction.type === "incoming" || transaction.type === "deposit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "incoming" || transaction.type === "deposit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}

              {account.transactions.length === 0 && (
                <div className="text-center text-gray-500 py-4 text-xs">Keine Transaktionen vorhanden</div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "transfer" && (
        <div className="flex-1 flex flex-col">
          <div className="p-3 sm:p-4 flex-1">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Empfänger</label>
                <input
                  type="text"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  placeholder="Name oder Konto-Nr."
                  className="w-full p-2 sm:p-3 text-xs sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Betrag</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                    <DollarSign size={14} className="sm:size-16 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    max={account.bank.toString()}
                    className="w-full p-2 sm:p-3 pl-8 sm:pl-10 text-xs sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">
                  Verfügbar: {formatCurrency(account.bank)}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Verwendungszweck
                </label>
                <input
                  type="text"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-2 sm:p-3 text-xs sm:text-sm border border-gray-700 bg-gray-800 text-white rounded-lg focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Überweisen Button */}
          <div className="p-3 sm:p-4 border-t border-gray-800">
            <button
              onClick={handleTransfer}
              disabled={!transferAmount || Number.parseFloat(transferAmount) <= 0 || !transferRecipient.trim()}
              className={`w-full py-2 sm:py-3 text-center text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center ${
                transferAmount && Number.parseFloat(transferAmount) > 0 && transferRecipient.trim()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              <Send size={16} className="mr-2" />
              Überweisen
            </button>
          </div>
        </div>
      )}

      {view === "history" && (
        <div className="flex-1 flex flex-col">
          {/* Suchleiste */}
          <div className="px-3 sm:px-4 pt-2 pb-3 sm:pb-4">
            <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
              <Search size={14} className="sm:size-16 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Transaktionen durchsuchen..."
                className="bg-transparent w-full outline-none text-xs sm:text-sm text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Transaktionsliste */}
          <div className="flex-1 overflow-y-auto">
            {Object.keys(groupedTransactions).length > 0 ? (
              Object.entries(groupedTransactions)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, transactions]) => (
                  <div key={date} className="mb-3 sm:mb-4">
                    <div className="sticky top-0 bg-gray-800 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-white">
                      {new Date(date).toLocaleDateString("de-DE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-800"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center mr-2 sm:mr-3">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-xs sm:text-sm truncate">
                            {transaction.reason}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Clock size={10} className="sm:size-12 mr-1" />
                            {new Date(transaction.date).toLocaleTimeString("de-DE", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div
                          className={`font-medium text-xs sm:text-sm ${
                            transaction.type === "incoming" || transaction.type === "deposit"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "incoming" || transaction.type === "deposit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Clock size={24} className="sm:size-32 mb-2" />
                <p className="text-sm">Keine Transaktionen gefunden</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
