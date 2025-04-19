//src/app/tickets/[showId]/SeatPicker.tsx
"use client";

import { useEffect, useState, useRef } from "react";

interface Seat {
  id: string;
  row: string;
  col: number;
  reserved: boolean;
}

interface SeatPickerProps {
  seats: Seat[] | null | undefined;
  inCartSeats?: string[];
  onSelect: (selected: string[]) => void;
  clearTrigger?: number;
}

const SeatPicker: React.FC<SeatPickerProps> = ({
  seats,
  inCartSeats = [],
  onSelect,
  clearTrigger,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect" | null>(null);
  const lastClearRef = useRef<number>(0);

  useEffect(() => {
    onSelect(Array.from(selectedSeats));
  }, [selectedSeats, onSelect]);

  useEffect(() => {
    if (clearTrigger && clearTrigger !== lastClearRef.current) {
      setSelectedSeats(new Set());
      lastClearRef.current = clearTrigger;
    }
  }, [clearTrigger]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setDragMode(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!seats) return <p className="text-gray-500 italic">Seats loading...</p>;
  if (seats.length === 0) return <p className="text-red-600">❌ No seating chart available</p>;

  const getSeatKey = (row: string, col: number) => `${row}${col}`;
  const reservedSet = new Set(seats.filter((s) => s.reserved).map((s) => getSeatKey(s.row, s.col)));
  const inCartSet = new Set(inCartSeats);

  const rows = [...new Set(seats.map((s) => s.row))];
  const cols = [...new Set(seats.map((s) => s.col))];

  const toggleSeat = (seatKey: string) => {
    setSelectedSeats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(seatKey)) {
        newSet.delete(seatKey);
      } else {
        newSet.add(seatKey);
      }
      return newSet;
    });
  };

  const startDrag = (seatKey: string) => {
    if (reservedSet.has(seatKey) || inCartSet.has(seatKey)) return;
    setIsDragging(true);
    setDragMode(selectedSeats.has(seatKey) ? "deselect" : "select");
    toggleSeat(seatKey);
  };

  const continueDrag = (seatKey: string) => {
    if (!isDragging || dragMode === null) return;
    if (reservedSet.has(seatKey) || inCartSet.has(seatKey)) return;

    setSelectedSeats((prev) => {
      const newSet = new Set(prev);
      if (dragMode === "select") {
        newSet.add(seatKey);
      } else {
        newSet.delete(seatKey);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2 select-none">
      {rows.map((row) => (
        <div key={row} className="flex gap-1 justify-center">
          {cols.map((col) => {
            const seatKey = getSeatKey(row, col);
            const isReserved = reservedSet.has(seatKey);
            const isInCart = inCartSet.has(seatKey);
            const isSelected = selectedSeats.has(seatKey);

            return (
              <button
                key={seatKey}
                onMouseDown={() => startDrag(seatKey)}
                onMouseEnter={() => continueDrag(seatKey)}
                disabled={isReserved || isInCart}
                title={isInCart ? "The seat is in your shopping cart" : undefined}
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