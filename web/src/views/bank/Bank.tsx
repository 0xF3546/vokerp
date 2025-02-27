"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowRightCircle,
  Clock,
  DollarSign,
  ChevronDown,
  Search,
  User,
  CreditCard,
  X,
} from "lucide-react"
import { BankDto } from "@shared/models/BankDto"
import { TransactionDto } from "@shared/models/TransactionDto"
import { fetchNui } from "../../utils/fetchNui"

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}

// Utility function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function BankMenu() {
  const [account, setAccount] = useState<BankDto>()
  const [visibleTransactions, setVisibleTransactions] = useState<number>(20)
  const [activeTab, setActiveTab] = useState<"transactions" | "withdraw" | "deposit" | "transfer">("transactions")
  const [withdrawAmount, setWithdrawAmount] = useState<string>("")
  const [depositAmount, setDepositAmount] = useState<string>("")
  const [transferAmount, setTransferAmount] = useState<string>("")
  const [transferTarget, setTransferTarget] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const load = async () => {
        const response = JSON.parse(await fetchNui("Bank::Load"))
        setAccount(response)
    }

    load();
  }, [])

  // Filter transactions based on search query
  const filteredTransactions = account.transactions.filter(
    (transaction) =>
      transaction.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatCurrency(transaction.amount).includes(searchQuery),
  )

  // Handle withdraw
  const handleWithdraw = () => {
    const amount = Number.parseInt(withdrawAmount)
    if (isNaN(amount) || amount <= 0 || amount > account.bank) return

    fetchNui("Bank::Withdraw", { amount }).then((response: any) => {
      if (response.success) {
        setAccount((prev) => ({
          ...prev,
          bank: prev.bank - amount,
          cash: prev.cash + amount,
        }))
        setWithdrawAmount("")
      }
    })
  }

  // Handle deposit
  const handleDeposit = () => {
    const amount = Number.parseInt(depositAmount)
    if (isNaN(amount) || amount <= 0 || amount > account.cash) return

    fetchNui("Bank::Deposit", { amount }).then((response: any) => {
      if (response.success) {
        setAccount((prev) => ({
          ...prev,
          bank: prev.bank + amount,
          cash: prev.cash - amount,
        }))
        setDepositAmount("")
      }
    })
  }

  // Handle transfer
  const handleTransfer = () => {
    const amount = Number.parseInt(transferAmount)
    if (isNaN(amount) || amount <= 0 || amount > account.bank || !transferTarget) return

    fetchNui("Bank::Transfer", { amount, target: transferTarget }).then((response: any) => {
      if (response.success) {
        setAccount((prev) => ({
          ...prev,
          bank: prev.bank - amount,
        }))
        setTransferAmount("")
        setTransferTarget("")
      }
    })
  }

  // Set max amount for withdraw
  const setMaxWithdraw = () => {
    setWithdrawAmount(account.bank.toString())
  }

  // Set max amount for deposit
  const setMaxDeposit = () => {
    setDepositAmount(account.cash.toString())
  }

  // Load more transactions
  const loadMoreTransactions = () => {
    setVisibleTransactions((prev) => Math.min(prev + 20, account.transactions.length))
  }

  // Close the menu
  const closeMenu = () => {
    fetchNui("Bank::Close")
  }

  // Render transaction item
  const renderTransactionItem = (transaction: TransactionDto) => {
    const isDeposit = transaction.type === "deposit"
    const isWithdraw = transaction.type === "withdraw"
    const isTransfer = transaction.type === "transfer"

    return (
      <div
        key={transaction.id}
        className="flex items-center gap-4 p-3 bg-black/40 rounded-lg border border-white/5 hover:bg-black/60 transition-colors"
      >
        <div
          className={`p-2 rounded-full ${
            isDeposit
              ? "bg-green-500/20 text-green-500"
              : isWithdraw
                ? "bg-red-500/20 text-red-500"
                : "bg-blue-500/20 text-blue-500"
          }`}
        >
          {isDeposit && <ArrowDownCircle className="w-5 h-5" />}
          {isWithdraw && <ArrowUpCircle className="w-5 h-5" />}
          {isTransfer && <ArrowRightCircle className="w-5 h-5" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-white font-medium">{transaction.reason}</span>
            <span
              className={`font-semibold ${
                isDeposit ? "text-green-500" : isWithdraw || isTransfer ? "text-red-500" : "text-white"
              }`}
            >
              {isDeposit ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-white/50 text-sm">
              <Clock className="w-3 h-3" />
              <span>{formatDate(transaction.date)}</span>
            </div>
            {isTransfer && (
              <div className="flex items-center gap-1 text-white/50 text-sm">
                <User className="w-3 h-3" />
                <span>{transaction.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-[1000px] bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600/20 rounded-xl">
                <CreditCard className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{account.user}</h2>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white/50 text-sm">Kontostand</p>
                <p className="text-2xl font-semibold text-white">{formatCurrency(account.bank)}</p>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg bg-black/40 text-white/70 hover:bg-black/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
              activeTab === "transactions" ? "text-red-500 border-b-2 border-red-500" : "text-white/70 hover:text-white"
            }`}
          >
            Transaktionen
          </button>
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
              activeTab === "withdraw" ? "text-red-500 border-b-2 border-red-500" : "text-white/70 hover:text-white"
            }`}
          >
            Auszahlen
          </button>
          <button
            onClick={() => setActiveTab("deposit")}
            className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
              activeTab === "deposit" ? "text-red-500 border-b-2 border-red-500" : "text-white/70 hover:text-white"
            }`}
          >
            Einzahlen
          </button>
          <button
            onClick={() => setActiveTab("transfer")}
            className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
              activeTab === "transfer" ? "text-red-500 border-b-2 border-red-500" : "text-white/70 hover:text-white"
            }`}
          >
            Überweisen
          </button>
        </div>

        {/* Content */}
        <div
          className={`transition-all duration-200 ${
            activeTab === "transactions" || activeTab === "transfer" ? "h-[400px] overflow-y-auto" : "h-[300px]"
          }`}
        >
          <div className="p-4 sm:p-6">
            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative w-full mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Transaktion suchen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                  />
                </div>

                {/* Transactions List */}
                <div className="grid grid-cols-1 gap-2 pr-2">
                  {filteredTransactions.slice(0, visibleTransactions).map(renderTransactionItem)}
                </div>

                {/* Load More Button */}
                {visibleTransactions < filteredTransactions.length && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={loadMoreTransactions}
                      className="px-4 py-2 bg-black/40 text-white/70 rounded-lg hover:bg-black/60 transition-colors flex items-center gap-2"
                    >
                      <span>Mehr laden</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === "withdraw" && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-white/50 text-sm">Verfügbarer Betrag</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(account.bank)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Betrag</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    />
                    <button
                      onClick={setMaxWithdraw}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-600/20 text-red-500 rounded text-xs font-medium hover:bg-red-600/30 transition-colors"
                    >
                      Max.
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={
                    !withdrawAmount ||
                    Number.parseInt(withdrawAmount) <= 0 ||
                    Number.parseInt(withdrawAmount) > account.bank
                  }
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUpCircle className="w-5 h-5" />
                  <span>Auszahlen</span>
                </button>
              </div>
            )}

            {/* Deposit Tab */}
            {activeTab === "deposit" && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-white/50 text-sm">Bargeld</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(account.cash)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Betrag</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-20 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    />
                    <button
                      onClick={setMaxDeposit}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-red-600/20 text-red-500 rounded text-xs font-medium hover:bg-red-600/30 transition-colors"
                    >
                      Max.
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDeposit}
                  disabled={
                    !depositAmount ||
                    Number.parseInt(depositAmount) <= 0 ||
                    Number.parseInt(depositAmount) > account.cash
                  }
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Einzahlen</span>
                </button>
              </div>
            )}

            {/* Transfer Tab */}
            {activeTab === "transfer" && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                  <p className="text-white/50 text-sm">Verfügbarer Betrag</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(account.bank)}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Empfänger</label>
                  <input
                    type="text"
                    value={transferTarget}
                    onChange={(e) => setTransferTarget(e.target.value)}
                    placeholder="Name oder Kontonummer"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Betrag</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={
                    !transferAmount ||
                    Number.parseInt(transferAmount) <= 0 ||
                    Number.parseInt(transferAmount) > account.bank ||
                    !transferTarget
                  }
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRightCircle className="w-5 h-5" />
                  <span>Überweisen</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

