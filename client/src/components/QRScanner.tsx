import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type Props = {
  onScan: (decodedText: string) => void;
  fps?: number;
  qrbox?: { width: number; height: number } | number;
};

export const QRScanner: React.FC<Props> = ({ onScan, fps = 10, qrbox = 250 }) => {
  const containerIdRef = useRef<string>(`qr-reader-${Math.random().toString(36).slice(2, 9)}`);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const id = containerIdRef.current;

    const options: any = {
      fps,
    };
    if (typeof qrbox === "number") {
      options.qrbox = { width: qrbox, height: qrbox };
    } else {
      options.qrbox = qrbox;
    }

    const scanner = new Html5QrcodeScanner(id, options, false);

    scanner.render(
      (decodedText) => {
        try {
          onScan(decodedText);
        } catch (err) {
          // swallow consumer errors
          // consumer will handle toast/error states
          console.error("onScan callback error:", err);
        }
      },
      (errorMessage) => {
        // You can log minor scan errors here
        // console.debug("QR scan error:", errorMessage);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (err) {
          // ignore cleanup errors
        }
        scannerRef.current = null;
      }
    };
  }, [onScan, fps, qrbox]);

  return <div id={containerIdRef.current} />;
};

export default QRScanner;
