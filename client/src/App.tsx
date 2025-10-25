// Reference: Replit Auth Blueprint
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Notes from "@/pages/Notes";
import School from "@/pages/School";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Notifications from "@/pages/Notifications";
import RoleSelection from "@/pages/RoleSelection";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        // Not authenticated - show landing/auth page
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* Onboarding routes - accessible after authentication */}
          <Route path="/role-selection" component={RoleSelection} />
          <Route path="/onboarding/:role" component={Onboarding} />
          
          {/* Check if user needs onboarding */}
          {!user?.isOnboardingComplete ? (
            // User needs onboarding
            <>
              {!user?.role ? (
                <Route path="/" component={RoleSelection} />
              ) : (
                <Route path="/" component={() => <Redirect to={`/onboarding/${user.role}`} />} />
              )}
            </>
          ) : (
            // User is fully onboarded - show main app
            <>
              <Route path="/" component={Home} />
              <Route path="/notes" component={Notes} />
              <Route path="/school" component={School} />
              <Route path="/profile" component={Profile} />
              <Route path="/search" component={Search} />
              <Route path="/notifications" component={Notifications} />
            </>
          )}
        </>
      )}
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
