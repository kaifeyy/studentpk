import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [match, params] = useRoute<{ role: string }>("/onboarding/:role");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Debug logging
  console.log("Onboarding match:", match);
  console.log("Onboarding params:", params);
  console.log("Role from params:", params?.role);
  
  // If route doesn't match or no params, redirect to role selection
  if (!match || !params?.role) {
    console.log("No match or params, redirecting to role selection");
    setLocation("/role-selection");
    return null;
  }
  
  const isStudent = params.role === "student";
  console.log("isStudent:", isStudent);

  const [formData, setFormData] = useState({
    schoolId: "",
    city: "",
    classGrade: "",
    board: "",
    bio: "",
    schoolName: "",
    address: "",
    contact: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Updating profile with data:", data);
      return await apiRequest("PATCH", "/api/user/profile", data);
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const createSchoolMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Creating school with data:", data);
      return await apiRequest("POST", "/api/schools", data);
    },
    onSuccess: (data) => {
      console.log("School created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("School creation error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create school",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isStudent) {
      // Student: update profile with city, classGrade, board, schoolId
      updateProfileMutation.mutate({
        role: "student",
        city: formData.city,
        classGrade: formData.classGrade,
        board: formData.board,
        schoolId: formData.schoolId || undefined,
      });
    } else {
      // Admin: create school first
      createSchoolMutation.mutate({
        name: formData.schoolName,
        address: formData.address,
        contactNumber: formData.contact,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            {isStudent 
              ? "Tell us about yourself to get started"
              : "Set up your school to begin managing"
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            {isStudent ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Karachi, Lahore"
                    data-testid="input-city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classGrade">Class/Grade</Label>
                  <Select
                    value={formData.classGrade}
                    onValueChange={(value) => setFormData({ ...formData, classGrade: value })}
                  >
                    <SelectTrigger id="classGrade" data-testid="select-class">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade 9">Grade 9</SelectItem>
                      <SelectItem value="Grade 10">Grade 10</SelectItem>
                      <SelectItem value="O Levels Year 1">O Levels Year 1</SelectItem>
                      <SelectItem value="O Levels Year 2">O Levels Year 2</SelectItem>
                      <SelectItem value="A Levels Year 1">A Levels Year 1</SelectItem>
                      <SelectItem value="A Levels Year 2">A Levels Year 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Select
                    value={formData.board}
                    onValueChange={(value) => setFormData({ ...formData, board: value })}
                  >
                    <SelectTrigger id="board" data-testid="select-board">
                      <SelectValue placeholder="Select your board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matric">Matric</SelectItem>
                      <SelectItem value="O Levels">O Levels</SelectItem>
                      <SelectItem value="A Levels">A Levels</SelectItem>
                      <SelectItem value="FBISE">FBISE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolCode">School Code (Optional)</Label>
                  <Input
                    id="schoolCode"
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    placeholder="Enter 6-character school code"
                    maxLength={6}
                    data-testid="input-school-code"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask your school admin for the code
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="e.g., City Model School"
                    required
                    data-testid="input-school-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Complete school address"
                    data-testid="input-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+92 XXX XXXXXXX"
                    data-testid="input-contact"
                  />
                </div>
              </>
            )}
          </Card>

          <div className="space-y-4 w-full">
            <Button 
              type="submit" 
              className="w-full gap-2" 
              data-testid="button-complete-profile"
              disabled={updateProfileMutation.isPending || createSchoolMutation.isPending}
            >
              {(updateProfileMutation.isPending || createSchoolMutation.isPending) ? "Processing..." : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </Button>

            {/* DEV ONLY: Test Login Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline"
              className="w-full gap-2 text-green-600 border-green-300 hover:bg-green-50"
              onClick={async () => {
                // Auto-login as test student
                localStorage.setItem('test-user', 'student');
                window.location.href = '/';
              }}
            >
              🚀 Quick Test Login (Student)
            </Button>

            <Button 
              type="button" 
              variant="outline"
              className="w-full gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={async () => {
                // Auto-login as test admin
                localStorage.setItem('test-user', 'admin');
                window.location.href = '/';
              }}
            >
              🏫 Quick Test Login (Admin)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
