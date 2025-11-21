import { ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: "admin" | "customer";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  if (role === "admin") {
    return (
      <Badge variant="default" className="px-3 py-1 text-xs font-bold uppercase tracking-wide" data-testid="badge-admin">
        <ShieldCheck className="size-3 mr-1 inline" />
        Admin
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wide" data-testid="badge-customer">
      <User className="size-3 mr-1 inline" />
      Customer
    </Badge>
  );
}
