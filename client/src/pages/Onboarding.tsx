import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { StudentOnboarding } from "@/components/onboarding/StudentOnboarding";
import { AdminOnboarding } from "@/components/onboarding/AdminOnboarding";
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  params: {
    role: string;
  };
}

export default function Onboarding({ params }: OnboardingProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Student onboarding mutation
  const studentOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/onboarding/student/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Onboarding failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Student Pakistan!",
        description: "Your profile has been completed successfully.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Onboarding Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Admin onboarding mutation
  const adminOnboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'registrationProof' || key === 'schoolLogo') {
          if (data[key]) {
            formData.append(key, data[key]);
          }
        } else if (Array.isArray(data[key])) {
          data[key].forEach((item: string) => {
            formData.append(`${key}[]`, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch("/api/onboarding/admin/complete", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "School registration failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "School Registered Successfully!",
        description: "Your school has been registered and is pending verification.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStudentComplete = async (data: any) => {
    return studentOnboardingMutation.mutateAsync(data);
  };

  const handleAdminComplete = async (data: any) => {
    return adminOnboardingMutation.mutateAsync(data);
  };

  if (params.role === "student") {
    return (
      <StudentOnboarding
        onComplete={handleStudentComplete}
        loading={studentOnboardingMutation.isPending}
      />
    );
  }

  if (params.role === "admin") {
    return (
      <AdminOnboarding
        onComplete={handleAdminComplete}
        loading={adminOnboardingMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-destructive">Invalid Role</h1>
        <p className="text-muted-foreground">The specified role is not valid.</p>
      </div>
    </div>
  );
}