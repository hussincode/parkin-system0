import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/RoleBadge";
import { useLocation } from "wouter";
import { Car, QrCode, FileSpreadsheet, LogOut } from "lucide-react";

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" data-testid="text-welcome">
                Welcome back, {user.username}
              </h1>
              <RoleBadge role={user.role} />
            </div>
            <p className="text-sm text-muted-foreground">
              {user.role === "admin" 
                ? "Manage parking operations and view detailed reports" 
                : "Quick access to parking scanner"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="size-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {user.role === "admin" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setLocation("/register")}
              className="group"
              data-testid="card-register-vehicle"
            >
              <Card className="h-32 hover:shadow-lg transition-shadow cursor-pointer hover-elevate active-elevate-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Register Vehicle</CardTitle>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Car className="size-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Add new vehicles and generate QR codes
                  </CardDescription>
                </CardContent>
              </Card>
            </button>

            <button
              onClick={() => setLocation("/visits")}
              className="group"
              data-testid="card-view-visits"
            >
              <Card className="h-32 hover:shadow-lg transition-shadow cursor-pointer hover-elevate active-elevate-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">View Visits</CardTitle>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileSpreadsheet className="size-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Access visit logs and export reports
                  </CardDescription>
                </CardContent>
              </Card>
            </button>

            <button
              onClick={() => setLocation("/scan")}
              className="group"
              data-testid="card-scanner-access"
            >
              <Card className="h-32 hover:shadow-lg transition-shadow cursor-pointer hover-elevate active-elevate-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">Scanner Access</CardTitle>
                  <div className="bg-primary/10 p-2 rounded-md">
                    <QrCode className="size-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Scan QR codes for check-in/out
                  </CardDescription>
                </CardContent>
              </Card>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLocation("/scan")}
            className="w-full"
            data-testid="card-scanner-customer"
          >
            <Card className="h-48 hover:shadow-lg transition-shadow cursor-pointer hover-elevate active-elevate-2">
              <CardHeader className="text-center pb-0">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-primary/10 p-6 rounded-full">
                    <QrCode className="size-16 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">QR Code Scanner</CardTitle>
                <CardDescription className="text-base mt-2">
                  Tap to scan vehicles for check-in and check-out
                </CardDescription>
              </CardHeader>
            </Card>
          </button>
        )}
      </div>
    </div>
  );
}
