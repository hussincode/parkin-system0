import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Camera, QrCode } from "lucide-react";
import QRScanner from "@/components/QRScanner";
import { scanQRCode } from "@/lib/api";

export default function Scanner() {
  return <ScannerContent />;
}

function ScannerContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(true);

  const scanMutation = useMutation({
    mutationFn: (qrCode: string) => scanQRCode(qrCode),
    onSuccess: (response: { message: string; type: string; visit?: any }) => {
      toast({
        title: response.type === "checkin" ? "Check-in Successful" : "Check-out Successful",
        description: response.message,
      });

      // After a successful scan we can pause scanning briefly
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 1200);
    },
    onError: (error: Error) => {
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleScan = (decodedText: string) => {
    if (scanMutation.isPending) return;
    scanMutation.mutate(decodedText);
  };

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

          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              {isScanning && <QRScanner onScan={handleScan} />}
            </div>

            <div className="bg-accent/20 p-4 rounded-lg">
              <p className="text-sm text-center">Position the QR code within the frame to scan</p>
            </div>

            <Button variant="outline" className="w-full h-12" onClick={() => setIsScanning((s) => !s)}>
              {isScanning ? "Stop Scanner" : "Start Scanner"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}