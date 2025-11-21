import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, QrCode } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  return (
    <ProtectedRoute>
      <ScannerContent />
    </ProtectedRoute>
  );
}

function ScannerContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerDivRef = useRef<HTMLDivElement>(null);

  const scanMutation = useMutation({
    mutationFn: (qrCode: string) => apiRequest("POST", "/api/scan", { qrCode }),
    onSuccess: (response: { message: string; type: string; visit?: any }) => {
      toast({
        title: response.type === "checkin" ? "Check-in Successful" : "Check-out Successful",
        description: response.message,
      });
      
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      setIsScanning(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startScanner = () => {
    if (!scannerDivRef.current) return;
    
    setIsScanning(true);
    
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        scanMutation.mutate(decodedText);
      },
      (error) => {
        console.log("QR scan error:", error);
      }
    );

    scannerRef.current = scanner;
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/home")}
          data-testid="button-back-home"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <QrCode className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">QR Code Scanner</h1>
              <p className="text-sm text-muted-foreground">
                Scan vehicle QR codes for check-in and check-out
              </p>
            </div>
          </div>

          {!isScanning ? (
            <div className="text-center space-y-6 py-8">
              <div className="flex items-center justify-center">
                <div className="bg-primary/10 p-8 rounded-full">
                  <Camera className="size-20 text-primary" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Click the button below to start your camera and scan QR codes
                </p>
              </div>

              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold"
                onClick={startScanner}
                data-testid="button-start-scanner"
              >
                <Camera className="size-5 mr-2" />
                Start Scanner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                id="qr-reader"
                ref={scannerDivRef}
                className="rounded-lg overflow-hidden"
                data-testid="scanner-view"
              ></div>

              <div className="bg-accent/20 p-4 rounded-lg">
                <p className="text-sm text-center">
                  Position the QR code within the frame to scan
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={stopScanner}
                disabled={scanMutation.isPending}
                data-testid="button-stop-scanner"
              >
                {scanMutation.isPending ? "Processing..." : "Stop Scanner"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
