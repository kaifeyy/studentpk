import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Download, Eye, Heart, Search, Filter, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Note, User } from "@shared/schema";

const SUBJECTS = [
  { name: "Mathematics", color: "bg-blue-500" },
  { name: "Physics", color: "bg-purple-500" },
  { name: "Chemistry", color: "bg-green-500" },
  { name: "Biology", color: "bg-teal-500" },
  { name: "English", color: "bg-orange-500" },
  { name: "Urdu", color: "bg-pink-500" },
];

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const { data: notes } = useQuery<Array<Note & { author?: User }>>({
    queryKey: ["/api/notes", selectedSubject, searchQuery],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Notes & Resources" showNotifications={false} />
      
      <div className="max-w-md mx-auto">
        {/* Search Bar */}
        <div className="p-4 space-y-3 border-b border-border bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes by keyword or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-notes"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-filter">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Browse by Subject</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SUBJECTS.map((subject) => (
              <Card
                key={subject.name}
                className={`p-4 cursor-pointer hover-elevate active-elevate-2 transition-all ${
                  selectedSubject === subject.name ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedSubject(
                  selectedSubject === subject.name ? null : subject.name
                )}
                data-testid={`subject-${subject.name.toLowerCase()}`}
              >
                <div className={`w-12 h-12 rounded-xl ${subject.color} flex items-center justify-center mb-3`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-sm">{subject.name}</p>
                <p className="text-xs text-muted-foreground">24 resources</p>
              </Card>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">
              {selectedSubject ? `${selectedSubject} Notes` : "All Notes"}
            </h3>
            
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <Card key={note.id} className="p-4 hover-elevate">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{note.title}</h4>
                        {note.isVerified && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{note.subject} • {note.grade}</p>
                    </div>
                    <Badge variant="outline">{note.fileType.toUpperCase()}</Badge>
                  </div>
                  
                  {note.description && (
                    <p className="text-sm text-muted-foreground mb-3">{note.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {note.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {note.likesCount}
                      </span>
                    </div>
                    
                    <Button size="sm" variant="outline" className="gap-2" data-testid="button-download-note">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">No notes found</p>
                <p className="text-sm text-muted-foreground">Try searching for a different subject</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
