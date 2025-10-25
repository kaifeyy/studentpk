import { useState } from "react";
import { Search as SearchIcon, Users, FileText, School as SchoolIcon, TrendingUp, X } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TRENDING_HASHTAGS = [
  { tag: "FScPhysics", posts: 245 },
  { tag: "BISE2025", posts: 189 },
  { tag: "MatricNotes", posts: 156 },
  { tag: "OLevels", posts: 134 },
  { tag: "ExamPrep", posts: 98 },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar title="Search" showSearch={false} />
      
      <div className="max-w-md mx-auto p-4">
        {/* Search Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users, notes, schools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 h-12 text-base rounded-2xl"
            data-testid="input-search"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {!query ? (
          /* Trending Section */
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Trending Now</h3>
            </div>
            
            <div className="space-y-3">
              {TRENDING_HASHTAGS.map((item) => (
                <Card
                  key={item.tag}
                  className="p-4 hover-elevate active-elevate-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary">#{item.tag}</p>
                      <p className="text-sm text-muted-foreground">{item.posts} posts</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results */
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                <Users className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">
                <FileText className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="schools" data-testid="tab-schools">
                <SchoolIcon className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              <Card className="p-8 text-center">
                <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-3">
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No users found</p>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-3">
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No notes found</p>
              </Card>
            </TabsContent>

            <TabsContent value="schools" className="space-y-3">
              <Card className="p-8 text-center">
                <SchoolIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No schools found</p>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
