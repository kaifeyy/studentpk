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

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          {/* Onboarding routes - accessible before role/city is set */}
          <Route path="/role-selection" component={RoleSelection} />
          <Route path="/onboarding/:role" component={Onboarding} />
          
          {/* Redirect to role selection if no role */}
          {!user?.role && <Route path="/" component={RoleSelection} />}
          
          {/* Main App Routes - only accessible after onboarding */}
          {user?.role && user?.city && (
            <>
              <Route path="/" component={Home} />
              <Route path="/notes" component={Notes} />
              <Route path="/school" component={School} />
              <Route path="/profile" component={Profile} />
              <Route path="/search" component={Search} />
              <Route path="/notifications" component={Notifications} />
            </>
          )}
          
          {/* Redirect to onboarding if role set but no city */}
          {user?.role && !user?.city && (
            <Route path="/" component={() => <Redirect to={`/onboarding/${user.role}`} />} />
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
