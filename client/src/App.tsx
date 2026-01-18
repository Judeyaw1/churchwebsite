import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Blog from "@/pages/Blog";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import Unsubscribe from "@/pages/Unsubscribe";
import NotFound from "@/pages/not-found";
import Maintenance from "@/pages/Maintenance";
import Media from "@/pages/Media";
import WomensFellowship from "@/pages/WomensFellowship";
import Announcements from "@/pages/Announcements";
import YafFellowship from "@/pages/YafFellowship";
import MensFellowship from "@/pages/MensFellowship";
import YpgFellowship from "@/pages/YpgFellowship";

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
      <Route path="/blog" component={Blog} />
      <Route path="/gallery" component={Media} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/unsubscribe" component={Unsubscribe} />
      <Route path="/announcements" component={Announcements} />
      <Route path="/groups/mens-fellowship" component={MensFellowship} />
      <Route path="/groups/womens-fellowship" component={WomensFellowship} />
      <Route path="/groups/yaf" component={YafFellowship} />
      <Route path="/groups/ypg" component={YpgFellowship} />
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
