import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

const AdminScanQR = () => {
  const scannerRef = useRef(null);
  const initializedRef = useRef(false);

  const [msg, setMsg] = useState("");
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= CAMERA SCANNER ================= */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (locked) return;
          setLocked(true);

          await verifyTicket(decodedText);

          await stopScanner();
        }
      )
      .catch(() => {});

    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= VERIFY ================= */
  const verifyTicket = async (ticketId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/bookings/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ticketId }),
      });

      const data = await res.json();
      setMsg(data.message);
    } catch {
      setMsg("❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STOP SCANNER SAFELY ================= */
  const stopScanner = async () => {
    if (!scannerRef.current) return;

    try {
      if (scannerRef.current.getState() === 2) {
        await scannerRef.current.stop();
      }
      await scannerRef.current.clear();
    } catch {
      // ignore lifecycle errors
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || locked) return;

    if (!file.type.startsWith("image/")) {
      setMsg("❌ Please upload an image with QR code");
      return;
    }

    try {
      setLocked(true);
      const decodedText = await scannerRef.current.scanFile(file, true);
      await verifyTicket(decodedText);
      await stopScanner();
    } catch {
      setLocked(false);
      setMsg("❌ QR not detected in image");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🎟️ Scan / Upload Event Ticket</h2>

      {/* CAMERA */}
      <div
        id="qr-reader"
        style={{
          width: "260px",
          height: "260px",
          margin: "1rem auto",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      />

      <p style={{ color: "#aaa", marginTop: "1rem" }}>OR</p>

      {/* IMAGE UPLOAD */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={locked || loading}
        style={{ marginTop: "1rem" }}
      />

      {loading && <p>Verifying...</p>}
      {msg && <h3>{msg}</h3>}
    </div>
  );
};

export default AdminScanQR;
