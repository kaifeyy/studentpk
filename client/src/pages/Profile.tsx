import { useState, useEffect } from "react";
import { Settings, LogOut, Edit, Users, FileText, School as SchoolIcon } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const stats = [
    { label: "Posts", value: "24", testId: "stat-posts" },
    { label: "Following", value: "156", testId: "stat-following" },
    { label: "Followers", value: "89", testId: "stat-followers" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Profile" showSearch={false} showNotifications={false} />
      
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-br from-primary to-secondary" />
          
          {/* Avatar & Info */}
          <div className="px-4 pb-4">
            <div className="relative -mt-16 mb-4">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={user?.profileImageUrl || ""} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h2>
                {user?.schoolId && (
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <SchoolIcon className="w-4 h-4" />
                    <span className="text-sm">City Model School</span>
                  </div>
                )}
                {user?.classGrade && (
                  <Badge variant="secondary" className="mt-2">{user.classGrade}</Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                data-testid="button-edit-profile"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>

            {user?.bio && (
              <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center" data-testid={stat.testId}>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <Button variant="outline" className="flex-1 gap-2" data-testid="button-settings">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive/10"
                asChild
                data-testid="button-logout"
              >
                <a href="/api/logout">
                  <LogOut className="w-4 h-4" />
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="posts" data-testid="tab-posts">
              <FileText className="w-4 h-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="notes" data-testid="tab-notes">
              <FileText className="w-4 h-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="groups" data-testid="tab-groups">
              <Users className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-3">
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No posts yet</p>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-3">
            <Card className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No shared notes yet</p>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-3">
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Not in any groups yet</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
