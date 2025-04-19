//src/app/dashboard/user/wallet/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getWalletInfo, rechargeWallet } from "@/lib/user-dashboard-actions";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";

export default function WalletPage() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [showRechargeForm, setShowRechargeForm] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("ALL");

  const { session, isLoading: sessionLoading } = authClient.useSession();

  useEffect(() => {
    async function fetchWallet() {
      const data = await getWalletInfo();
      setWalletInfo(data);
    }
    fetchWallet();
  }, []);

  const handleAmountClick = (amount) => {
    setRechargeAmount(amount);
    setShowRechargeForm(true);
  };

  const handleRecharge = async () => {
    if (rechargeAmount <= 0 || isNaN(rechargeAmount)) {
      alert("Please enter a valid amount to recharge");
      return;
    }
    if (rechargeAmount > 200) {
      const confirmLarge = confirm("⚠️ The amount is large. Are you sure you want to proceed?");
      if (!confirmLarge) return;
    }

    setLoading(true);
    try {
      await rechargeWallet(rechargeAmount);
      const data = await getWalletInfo();
      setWalletInfo(data);
      setRechargeAmount(0);
      setShowRechargeForm(false);
    } catch (err) {
      alert("Recharge failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = Array.isArray(walletInfo?.transactions)
  ? walletInfo.transactions.filter((t) => {
      if (filterType === "ALL") return true;
      if (filterType === "RECHARGE") return t.type === "RECHARGE";
      if (filterType === "PAYMENT") return t.type === "PAYMENT";
      if (filterType === "REFUND") return t.type === "REFUND";
      return true;
    })
  : []; 

  return (
    <div className="p-6 space-y-6">
      <NavBarClient session={session} />
      <h1 className="text-2xl font-bold">💰 My Wallet</h1>

      <div className="bg-white rounded shadow p-4">
        <p className="text-xl font-semibold text-green-700">
          Current Balance: ${walletInfo?.balance.toFixed(2) ?? "Loading..."}
        </p>

        {!showRechargeForm ? (
          <div className="mt-4 space-y-2">
            <div className="space-x-2">
              {[5, 10, 20, 50].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountClick(amount)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Recharge ${amount}
                </button>
              ))}
              <button
                onClick={() => setShowRechargeForm(true)}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Custom Amount
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={rechargeAmount}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && /^\d+(\.\d{0,2})?$/.test(e.target.value)) {
                  setRechargeAmount(val);
                }
              }}
              className="border rounded px-3 py-1 w-40"
              placeholder="Enter amount"
            />
            <div className="space-x-2">
              <button
                onClick={handleRecharge}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                {loading ? "Processing..." : "Confirm Recharge"}
              </button>
              <button
                onClick={() => {
                  setRechargeAmount(0);
                  setShowRechargeForm(false);
                }}
                className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">📜 Transaction History</h2>
        <div className="flex gap-4 mb-4">
          {["ALL", "RECHARGE", "PAYMENT", "REFUND"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1 rounded border font-medium ${
                filterType === type
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {type === "ALL" && "All"}
              {type === "RECHARGE" && "Recharge"}
              {type === "PAYMENT" && "Payment"}
              {type === "REFUND" && "Refund"}
            </button>
          ))}
        </div>
        {filteredTransactions?.length === 0 ? (
          <p className="text-gray-600">No matching transactions found</p>
        ) : (
          <ul className="space-y-2">
            {filteredTransactions.map((t) => (
              <li
                key={t.id}
                className="border p-3 rounded bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p>
                    <span className="font-medium">{t.type}</span>: ${t.amount.toFixed(2)}
                  </p>
                  {t.note && <p className="text-sm text-gray-600">{t.note}</p>}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}