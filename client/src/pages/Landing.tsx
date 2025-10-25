import { GraduationCap, School as SchoolIcon, Users, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageProvider";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: "Connect & Collaborate",
      description: "Join thousands of students across Pakistan",
    },
    {
      icon: BookOpen,
      title: "Share Notes",
      description: "Access verified study materials and resources",
    },
    {
      icon: TrendingUp,
      title: "Stay Updated",
      description: "Get real-time announcements and timetables",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* Logo & Hero */}
        <div className="text-center mb-12 mt-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Student Pakistan
          </h1>
          <p className="text-lg text-primary font-semibold mb-3">
            {t("landing.tagline")}
          </p>
          <p className="text-muted-foreground">
            {t("landing.subtitle")}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-4 hover-elevate transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          <Button
            asChild
            size="lg"
            className="w-full h-14 text-lg rounded-2xl"
            data-testid="button-login-student"
          >
            <a href="/api/login">
              <Users className="w-5 h-5 mr-2" />
              {t("landing.student")}
            </a>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg rounded-2xl"
            data-testid="button-login-admin"
          >
            <a href="/api/login">
              <SchoolIcon className="w-5 h-5 mr-2" />
              {t("landing.admin")}
            </a>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Built for Pakistani students, by students</p>
        </div>
      </div>
    </div>
  );
}
