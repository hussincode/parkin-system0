import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { insertCarSchema, type InsertCar } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Car } from "lucide-react";

export default function RegisterCar() {
  return (
    <ProtectedRoute requireAdmin>
      <RegisterCarContent />
    </ProtectedRoute>
  );
}

function RegisterCarContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [carData, setCarData] = useState<{ plateNumber: string; ownerName: string } | null>(null);

  const form = useForm<InsertCar>({
    resolver: zodResolver(insertCarSchema),
    defaultValues: {
      plateNumber: "",
      ownerName: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: InsertCar) => apiRequest("POST", "/api/cars", data),
    onSuccess: (response: { car: any; qrCode: string }) => {
      setQrCode(response.qrCode);
      setCarData({ 
        plateNumber: response.car.plateNumber, 
        ownerName: response.car.ownerName 
      });
      toast({
        title: "Vehicle registered!",
        description: "QR code generated successfully",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const downloadQRCode = () => {
    if (!qrCode || !carData) return;
    
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-${carData.plateNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code downloaded",
      description: `Saved as qr-${carData.plateNumber}.png`,
    });
  };

  const handleNewRegistration = () => {
    setQrCode(null);
    setCarData(null);
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
              <Car className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Register Vehicle</h1>
              <p className="text-sm text-muted-foreground">
                Add a new vehicle and generate its QR code
              </p>
            </div>
          </div>

          {!qrCode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="plateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Plate Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., ABC-1234"
                          className="h-12"
                          data-testid="input-plate-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Owner Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., John Doe"
                          className="h-12"
                          data-testid="input-owner-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 font-semibold"
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "Generating QR Code..." : "Register Vehicle"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="bg-accent/20 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium">
                  ✓ Vehicle registered successfully!
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg inline-block border-2 border-border">
                <img
                  src={qrCode}
                  alt="Vehicle QR Code"
                  className="max-w-xs w-full h-auto"
                  data-testid="img-qr-code"
                />
              </div>

              {carData && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Plate Number</p>
                  <p className="font-semibold" data-testid="text-plate-number">{carData.plateNumber}</p>
                  <p className="text-sm text-muted-foreground mt-2">Owner</p>
                  <p className="font-semibold" data-testid="text-owner-name">{carData.ownerName}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleNewRegistration}
                  data-testid="button-register-another"
                >
                  Register Another
                </Button>
                <Button
                  className="flex-1 h-12 font-semibold"
                  onClick={downloadQRCode}
                  data-testid="button-download-qr"
                >
                  <Download className="size-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
