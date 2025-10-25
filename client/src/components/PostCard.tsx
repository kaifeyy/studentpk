import { Heart, MessageCircle, Share2, MoreVertical, School as SchoolIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import type { Post, User } from "@shared/schema";

interface PostCardProps {
  post: Post & { author?: User };
  onLike?: () => void;
  onComment?: () => void;
  isLiked?: boolean;
}

export function PostCard({ post, onLike, onComment, isLiked }: PostCardProps) {
  const author = post.author;
  const initials = author
    ? `${author.firstName?.[0] || ""}${author.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  return (
    <Card className="mb-4 overflow-hidden hover-elevate transition-all">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={author?.profileImageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">
                  {author?.firstName} {author?.lastName}
                </span>
                {post.type === "announcement" && (
                  <Badge variant="secondary" className="gap-1">
                    <SchoolIcon className="w-3 h-3" />
                    School
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid="button-post-more">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          
          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="text-sm text-primary hover-elevate px-2 py-1 rounded-md cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="mb-3 rounded-xl overflow-hidden">
            <img
              src={post.mediaUrls[0]}
              alt="Post media"
              className="w-full object-cover max-h-96"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 border-t border-border pt-3">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 flex-1 ${isLiked ? "text-destructive" : ""}`}
            onClick={onLike}
            data-testid="button-like-post"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{post.likesCount || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 flex-1"
            onClick={onComment}
            data-testid="button-comment-post"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.commentsCount || 0}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2 flex-1" data-testid="button-share-post">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}
