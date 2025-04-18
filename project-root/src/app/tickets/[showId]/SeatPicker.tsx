//src/app/tickets/[showId]/SeatPicker.tsx
"use client";

import { useEffect, useState } from "react";

interface Seat {
  id: string;
  row: string;
  col: number;
  reserved: boolean;
}

interface SeatPickerProps {
  seats: Seat[] | null | undefined;
  inCartSeats?: string[]; // ✅ 新增：购物车中座位
  onSelect: (selected: string[]) => void;
}

const SeatPicker: React.FC<SeatPickerProps> = ({ seats, inCartSeats = [], onSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  useEffect(() => {
    onSelect(selectedSeats);
  }, [selectedSeats, onSelect]);

  // 显示加载中状态
  if (seats === undefined || seats === null) {
    return <p className="text-gray-500 italic">加载座位中...</p>;
  }

  // 没有任何座位
  if (seats.length === 0) {
    return <p className="text-red-600">❌ 无可用的座位表</p>;
  }

  const getSeatKey = (row: string, col: number) => `${row}${col}`;
  const reservedSet = new Set(seats.filter((s) => s.reserved).map((s) => getSeatKey(s.row, s.col)));
  const inCartSet = new Set(inCartSeats);

  const toggleSeat = (seatKey: string) => {
    if (reservedSet.has(seatKey) || inCartSet.has(seatKey)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatKey) ? prev.filter((s) => s !== seatKey) : [...prev, seatKey]
    );
  };

  const rows = [...new Set(seats.map((s) => s.row))];
  const cols = [...new Set(seats.map((s) => s.col))];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row} className="flex gap-1 justify-center">
          {cols.map((col) => {
            const seatKey = `${row}${col}`;
            const isReserved = reservedSet.has(seatKey);
            const isInCart = inCartSet.has(seatKey);
            const isSelected = selectedSeats.includes(seatKey);
            return (
              <button
                key={seatKey}
                onClick={() => toggleSeat(seatKey)}
                disabled={isReserved || isInCart}
                  title={isInCart ? "该座位已在你的购物车中" : undefined} // 原生html提示语有一秒延迟
                  className={`w-8 h-8 text-xs rounded border font-mono
                  ${isReserved ? "bg-gray-400 cursor-not-allowed" : ""}
                  ${isInCart ? "bg-yellow-300 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-green-500 text-white" : "bg-blue-100 hover:bg-blue-300"}`}
              >
                {seatKey}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SeatPicker;