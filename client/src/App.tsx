import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Unsubscribe from "@/pages/Unsubscribe";
import NotFound from "@/pages/not-found";
import Maintenance from "@/pages/Maintenance";

// Set to false when maintenance is complete
const MAINTENANCE_MODE = false;

function Router() {
  // If maintenance mode is enabled, show maintenance page for all routes
  if (MAINTENANCE_MODE) {
    return (
      <Switch>
        <Route component={Maintenance} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/events" component={Events} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/unsubscribe" component={Unsubscribe} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
