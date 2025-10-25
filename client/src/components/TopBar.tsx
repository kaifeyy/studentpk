import { Bell, Search, Moon, Sun, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Link } from "wouter";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
}

export function TopBar({ title = "Student Pakistan", showSearch = true, showNotifications = true }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-card-border">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-search"
              >
                <Search className="w-5 h-5" />
              </Button>
            </Link>
          )}
          
          {showNotifications && (
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-notifications"
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            data-testid="button-language-toggle"
          >
            <Languages className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
