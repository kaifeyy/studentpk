import { Bell, Heart, MessageCircle, UserPlus, Megaphone } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const NOTIFICATION_TYPES = {
  like: { icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
  announcement: { icon: Megaphone, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
};

export default function Notifications() {
  const notifications = [
    {
      id: "1",
      type: "announcement",
      title: "New Announcement",
      content: "Parent-teacher meeting scheduled for next week",
      time: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
    },
    {
      id: "2",
      type: "like",
      title: "Ahmed Khan liked your post",
      content: "Great notes on Physics Chapter 5!",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
    },
    {
      id: "3",
      type: "comment",
      title: "Sara Ali commented on your post",
      content: "Can you share the Biology notes too?",
      time: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Notifications" showSearch={false} showNotifications={false} />
      
      <div className="max-w-md mx-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const typeConfig = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES];
              const Icon = typeConfig.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover-elevate cursor-pointer ${
                    !notification.isRead ? "bg-accent/30" : ""
                  }`}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.time, { addSuffix: true })}
                      </p>
                    </div>
                    
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">No notifications</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
