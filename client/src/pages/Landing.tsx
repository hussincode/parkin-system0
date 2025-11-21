import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, QrCode, FileSpreadsheet, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLocation("/home");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto">
        <Card className="p-6 md:p-8 text-center space-y-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Car className="size-12 text-primary" />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Smart Parking System
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Efficient parking management with QR code technology
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <QrCode className="size-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">QR Scanning</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileSpreadsheet className="size-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Visit Reports</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="size-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Secure Access</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              className="w-full h-14 text-lg font-semibold"
              onClick={() => setLocation("/signup")}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-primary hover:underline font-medium"
                data-testid="link-login"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
