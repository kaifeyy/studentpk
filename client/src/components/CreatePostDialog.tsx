import { useState } from "react";
import { Image, Hash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageProvider";
import type { User } from "@shared/schema";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onPost?: (content: string, hashtags: string[]) => void;
}

export function CreatePostDialog({ open, onOpenChange, user, onPost }: CreatePostDialogProps) {
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const handleAddHashtag = () => {
    if (hashtagInput.trim()) {
      const tag = hashtagInput.replace("#", "").trim();
      if (!hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput("");
    }
  };

  const handlePost = () => {
    if (content.trim()) {
      onPost?.(content, hashtags);
      setContent("");
      setHashtags([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profileImageUrl || ""} className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">Posting to Public</p>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder={t("feed.whatsOnMind")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 resize-none text-base"
            data-testid="input-post-content"
          />

          {/* Hashtags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Add hashtag"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHashtag();
                    }
                  }}
                  className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm"
                  data-testid="input-hashtag"
                />
              </div>
              <Button size="sm" onClick={handleAddHashtag} data-testid="button-add-hashtag">
                Add
              </Button>
            </div>
            
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    #{tag}
                    <button
                      onClick={() => setHashtags(hashtags.filter((t) => t !== tag))}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Attachment Button */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Image className="w-4 h-4" />
              Add Media
            </Button>
          </div>

          {/* Post Button */}
          <Button
            onClick={handlePost}
            disabled={!content.trim()}
            className="w-full"
            data-testid="button-submit-post"
          >
            {t("feed.post")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
