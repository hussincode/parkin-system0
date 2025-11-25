import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Car, QrCode, Shield } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
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

          <div className="text-lg font-semibold text-foreground pt-4">
            Choose your role to continue
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin Card */}
            <button
              onClick={() => setLocation("/login")}
              className="group"
              data-testid="button-admin"
            >
              <Card className="h-48 hover:shadow-lg transition-all cursor-pointer hover-elevate active-elevate-2 border-2 border-transparent hover:border-primary/30">
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Shield className="size-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Admin</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Manage parking operations and view reports
                    </p>
                  </div>
                </div>
              </Card>
            </button>

            {/* Customer Card */}
            <button
              onClick={() => setLocation("/scan")}
              className="group"
              data-testid="button-customer"
            >
              <Card className="h-48 hover:shadow-lg transition-all cursor-pointer hover-elevate active-elevate-2 border-2 border-transparent hover:border-primary/30">
                <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <QrCode className="size-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Customer</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Quick access to parking scanner
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have a customer account?{" "}
              <button
                onClick={() => setLocation("/signup")}
                className="text-primary hover:underline font-medium"
                data-testid="link-signup"
              >
                Create one now
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
