import { GraduationCap, School as SchoolIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageProvider";

export default function RoleSelection() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to CampusConnect!
          </h1>
          <p className="text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        <div className="grid gap-4">
          <Card
            className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => setLocation("/onboarding/student")}
            data-testid="card-student-role"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t("landing.student")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Access notes, join discussions, and connect with classmates
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => setLocation("/onboarding/admin")}
            data-testid="card-admin-role"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <SchoolIcon className="w-8 h-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t("landing.admin")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage school, create announcements, and organize classes
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
