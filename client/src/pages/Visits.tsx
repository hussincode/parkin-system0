import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { type Visit } from "@shared/schema";
import { ArrowLeft, Download, RefreshCw, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { queryClient } from "@/lib/queryClient";

export default function Visits() {
  return (
    <ProtectedRoute requireAdmin>
      <VisitsContent />
    </ProtectedRoute>
  );
}

function VisitsContent() {
  const [, setLocation] = useLocation();

  const { data: visits = [], isLoading, refetch } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/visits/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `parking-visits-${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/home")}
          data-testid="button-back-home"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileSpreadsheet className="size-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Visits Log</h1>
                <p className="text-sm text-muted-foreground">
                  View all parking visits and export reports
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                data-testid="button-refresh"
              >
                <RefreshCw className={`size-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                data-testid="button-export"
              >
                <Download className="size-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : visits.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="flex items-center justify-center">
                <div className="bg-muted p-6 rounded-full">
                  <FileSpreadsheet className="size-12 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">No visits yet</h3>
              <p className="text-sm text-muted-foreground">
                Parking visits will appear here once vehicles check in
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Plate Number</TableHead>
                    <TableHead className="font-semibold">Owner</TableHead>
                    <TableHead className="font-semibold">Check In</TableHead>
                    <TableHead className="font-semibold">Check Out</TableHead>
                    <TableHead className="font-semibold">Duration</TableHead>
                    <TableHead className="font-semibold">Fee</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id} data-testid={`row-visit-${visit.id}`}>
                      <TableCell className="font-medium" data-testid={`text-plate-${visit.id}`}>
                        {visit.plateNumber}
                      </TableCell>
                      <TableCell data-testid={`text-owner-${visit.id}`}>
                        {visit.ownerName}
                      </TableCell>
                      <TableCell data-testid={`text-checkin-${visit.id}`}>
                        {format(new Date(visit.checkInTime), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell data-testid={`text-checkout-${visit.id}`}>
                        {visit.checkOutTime
                          ? format(new Date(visit.checkOutTime), "MMM dd, yyyy HH:mm")
                          : "-"}
                      </TableCell>
                      <TableCell data-testid={`text-duration-${visit.id}`}>
                        {visit.duration ? `${visit.duration} min` : "-"}
                      </TableCell>
                      <TableCell data-testid={`text-fee-${visit.id}`}>
                        {visit.fee ? `${visit.fee} EGP` : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={visit.isCheckedIn ? "default" : "secondary"}
                          data-testid={`badge-status-${visit.id}`}
                        >
                          {visit.isCheckedIn ? "Checked In" : "Checked Out"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
