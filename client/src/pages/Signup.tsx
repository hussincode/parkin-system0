import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, User as UserIcon, ShieldCheck, Check, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const signupFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupFormSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<"admin" | "customer" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
  });

  const password = form.watch("password");
  const passwordStrength = calculatePasswordStrength(password);

  const signupMutation = useMutation({
    mutationFn: (data: InsertUser) => apiRequest("POST", "/api/auth/signup", data),
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/me"], user);
      toast({
        title: "Account created!",
        description: `Welcome! You're signed in as ${user.role}`,
      });
      setLocation("/home");
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRoleSelect = (role: "admin" | "customer") => {
    if (role === "customer") {
      // For customer, skip directly to scanner
      setLocation("/scan");
      return;
    }
    // For admin, proceed to credentials
    setSelectedRole(role);
    form.setValue("role", role);
    setStep("credentials");
  };

  const handleSubmit = (data: SignupForm) => {
    const { confirmPassword, ...signupData } = data;
    signupMutation.mutate(signupData);
  };

  if (step === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-center">Choose Your Account Type</h1>
            <p className="text-sm text-muted-foreground text-center">
              Select the role that best describes your access needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <button
              onClick={() => handleRoleSelect("admin")}
              className="group relative"
              data-testid="card-role-admin"
            >
              <Card className="p-6 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full hover-elevate active-elevate-2">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <ShieldCheck className="size-16 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Administrator</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Full system access for managing operations
                    </p>
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="size-4 text-primary" />
                      <span>Register vehicles</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="size-4 text-primary" />
                      <span>View all visits</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="size-4 text-primary" />
                      <span>Export reports</span>
                    </div>
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={() => handleRoleSelect("customer")}
              className="group relative"
              data-testid="card-role-customer"
            >
              <Card className="p-6 border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer h-full hover-elevate active-elevate-2">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-secondary/50 p-4 rounded-full">
                    <UserIcon className="size-16 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Customer</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      Quick access for parking operations
                    </p>
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="size-4 text-primary" />
                      <span>Scan QR codes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className="size-4 text-primary" />
                      <span>Quick check-in/out</span>
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-primary hover:underline font-medium"
                data-testid="link-login-from-signup"
              >
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              <Check className="size-4" />
            </div>
            <div className="h-0.5 w-16 bg-primary"></div>
          </div>
          <div className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            2
          </div>
          <div className="h-0.5 w-16 bg-muted"></div>
          <div className="flex items-center justify-center size-8 rounded-full border-2 border-muted text-sm font-semibold text-muted-foreground">
            3
          </div>
        </div>

        <Card className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">Set Up Your Credentials</h1>
            <p className="text-sm text-muted-foreground">
              Create your {selectedRole} account
            </p>
          </div>

          {selectedRole === "admin" && (
            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-md">
              <p className="text-sm">
                <strong>Admin Access:</strong> You'll have full access to register vehicles, manage visits, and export reports.
              </p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Username <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="Choose a username"
                          className="h-12 pl-12"
                          data-testid="input-signup-username"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="h-12 pl-12 pr-12"
                          data-testid="input-signup-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="size-5 text-muted-foreground" />
                          ) : (
                            <Eye className="size-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {password && (
                      <div className="space-y-2 mt-2">
                        <Progress value={passwordStrength} className="h-2" />
                        <div className="flex gap-2 flex-wrap text-xs">
                          <span className={password.length >= 8 ? "text-primary" : "text-muted-foreground"}>
                            ✓ 8+ characters
                          </span>
                          <span className={/[0-9]/.test(password) ? "text-primary" : "text-muted-foreground"}>
                            ✓ 1 number
                          </span>
                          <span className={/[!@#$%^&*]/.test(password) ? "text-primary" : "text-muted-foreground"}>
                            ✓ 1 special char
                          </span>
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Confirm Password <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="h-12 pl-12 pr-12"
                          data-testid="input-confirm-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                          data-testid="button-toggle-confirm-password"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-5 text-muted-foreground" />
                          ) : (
                            <Eye className="size-5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setStep("role")}
                  data-testid="button-back"
                >
                  Back
                </Button>
                {selectedRole === "customer" && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1 h-12"
                    onClick={() => setLocation("/scan")}
                    data-testid="button-skip-customer"
                  >
                    Skip & Scan
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 h-12 font-semibold"
                  disabled={signupMutation.isPending}
                  data-testid="button-create-account"
                >
                  {signupMutation.isPending ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

function calculatePasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength += 33;
  if (/[0-9]/.test(password)) strength += 33;
  if (/[!@#$%^&*]/.test(password)) strength += 34;
  return strength;
}
