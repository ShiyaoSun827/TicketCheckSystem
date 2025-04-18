//src/app/dashboard/staff/checkin/page.tsx


"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { authClient } from "@/lib/auth-client";
import NavBarClient from "@/components/NavBarClient";

export default function StaffCheckinPage() {
    const { session } = authClient.useSession();
    const [message, setMessage] = useState<string | null>(null);
    const scannerRef = useRef<any>(null);

    const handleScanSuccess = async (decodedText: string) => {
        const res = await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCode: decodedText }),
        });
        const result = await res.json();
        setMessage(result.message);
    };

    useEffect(() => {
        if (!scannerRef.current && typeof window !== "undefined") {
            const Html5QrcodeScanner = require("html5-qrcode").Html5QrcodeScanner;
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
            scanner.render(handleScanSuccess);
            scannerRef.current = scanner;
        }
    }, []);

    return (
        <div className="p-6 space-y-6">
            <NavBarClient session={session} />
            <h1 className="text-3xl font-bold">📲 Staff QR Check-In</h1>
            <div id="reader" className="w-full max-w-md border rounded p-4 bg-white shadow" />
            {message && <p className="text-xl text-green-600 mt-4">{message}</p>}
        </div>
    );
}


