import { useQuery } from "@tanstack/react-query";
import { Calendar, Bell, Video, School as SchoolIcon } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import type { Announcement, Timetable, TimetableEntry } from "@shared/schema";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function School() {
  const { user } = useAuth();

  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  const { data: timetable } = useQuery<Timetable & { entries?: TimetableEntry[] }>({
    queryKey: ["/api/timetable"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="School Dashboard" showSearch={false} />
      
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* School Header */}
        {user?.schoolId && (
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center shadow-md">
                <SchoolIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">City Model School</h2>
                <p className="text-sm text-muted-foreground">Grade 9 - Section A</p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            data-testid="button-timetable"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Timetable</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            data-testid="button-announcements"
          >
            <Bell className="w-6 h-6" />
            <span className="text-xs">Announcements</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            data-testid="button-online-classes"
          >
            <Video className="w-6 h-6" />
            <span className="text-xs">Classes</span>
          </Button>
        </div>

        {/* Announcements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Latest Announcements</h3>
            <Button variant="ghost" size="sm" data-testid="button-see-all-announcements">
              See all
            </Button>
          </div>
          
          <div className="space-y-3">
            {announcements && announcements.length > 0 ? (
              announcements.slice(0, 3).map((announcement) => (
                <Card key={announcement.id} className="p-4 hover-elevate">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm text-foreground">{announcement.title}</h4>
                        {announcement.isPinned && (
                          <Badge variant="secondary" className="flex-shrink-0">Pinned</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.content}
                      </p>
                      {announcement.targetClass && (
                        <Badge variant="outline" className="mt-2">{announcement.targetClass}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No announcements yet</p>
              </Card>
            )}
          </div>
        </div>

        {/* Today's Timetable */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Today's Schedule</h3>
          
          <Card className="overflow-hidden">
            {timetable?.entries && timetable.entries.length > 0 ? (
              <div className="divide-y divide-border">
                {timetable.entries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 flex items-center gap-4 hover-elevate"
                  >
                    <div className="text-center min-w-16">
                      <p className="text-xs text-muted-foreground">{entry.startTime}</p>
                      <p className="text-xs text-muted-foreground">{entry.endTime}</p>
                    </div>
                    
                    <div className="w-1 h-12 bg-primary rounded-full" />
                    
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{entry.subject}</p>
                      <p className="text-sm text-muted-foreground">{entry.teacher}</p>
                      {entry.classroom && (
                        <p className="text-xs text-muted-foreground mt-1">Room {entry.classroom}</p>
                      )}
                    </div>
                    
                    {entry.meetingLink && (
                      <Button size="sm" variant="outline" className="gap-2" data-testid="button-join-class">
                        <Video className="w-4 h-4" />
                        Join
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No classes scheduled</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
