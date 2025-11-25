import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import RegisterCar from "@/pages/RegisterCar";
import Scanner from "@/pages/Scanner";
import Visits from "@/pages/Visits";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/home" component={Home} />
      <Route path="/register" component={RegisterCar} />
      <Route path="/scan" component={Scanner} />
      <Route path="/visits" component={Visits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Header />
        <div className="min-h-screen pt-16 pb-20">
          <Router />
        </div>
        <Footer />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
