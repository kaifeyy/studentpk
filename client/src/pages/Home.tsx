import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, FileText } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageProvider";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Post, User } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [feedFilter, setFeedFilter] = useState<"school" | "public" | "trending">("school");
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const { data: posts, isLoading } = useQuery<Array<Post & { author?: User }>>({
    queryKey: ["/api/posts", feedFilter],
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; hashtags: string[] }) => {
      return await apiRequest("POST", "/api/posts", {
        content: data.content,
        hashtags: data.hashtags,
        visibility: feedFilter === "school" ? "school" : "public",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({ title: "Success", description: "Post created successfully!" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await apiRequest("POST", `/api/posts/${postId}/like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  const handleCreatePost = (content: string, hashtags: string[]) => {
    createPostMutation.mutate({ content, hashtags });
  };

  const filters = [
    { key: "school" as const, label: t("feed.school"), testId: "filter-school" },
    { key: "public" as const, label: t("feed.public"), testId: "filter-public" },
    { key: "trending" as const, label: t("feed.trending"), testId: "filter-trending" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="CampusConnect" />
      
      <div className="max-w-md mx-auto">
        {/* Feed Filters */}
        <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex gap-1 p-2">
            {filters.map((filter) => (
              <Button
                key={filter.key}
                variant={feedFilter === filter.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setFeedFilter(filter.key)}
                className="flex-1"
                data-testid={filter.testId}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Feed Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => likePostMutation.mutate(post.id)}
                onComment={() => console.log("Comment", post.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {t("feed.noPostsYet")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("feed.startConversation")}
              </p>
            </div>
          )}
        </div>
      </div>

      <FloatingActionButton onClick={() => setCreatePostOpen(true)} />
      <BottomNav />
      
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        user={user}
        onPost={handleCreatePost}
      />
    </div>
  );
}
