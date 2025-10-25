import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Login } from "./Login";
import { Signup } from "./Signup";
import { ForgotPassword } from "./ForgotPassword";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup" | "forgot-password";

interface LoginData {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
  role: "student" | "admin";
  firstName?: string;
  lastName?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      // Redirect based on onboarding status
      if (!data.user.isOnboardingComplete) {
        setLocation("/role-selection");
      } else {
        setLocation("/");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email || undefined,
          password: data.password,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          securityQuestion: data.securityQuestion,
          securityAnswer: data.securityAnswer,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store the token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast({
        title: "Account Created!",
        description: "Your account has been created successfully.",
      });

      // Redirect to onboarding
      setLocation(`/onboarding/${data.user.role}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ username, securityAnswer, newPassword }: {
      username: string;
      securityAnswer: string;
      newPassword: string;
    }) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          securityAnswer,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Password reset failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully.",
      });
      setMode("login");
    },
    onError: (error: Error) => {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (data: LoginData) => {
    return loginMutation.mutateAsync(data);
  };

  const handleSignup = async (data: SignupData) => {
    return signupMutation.mutateAsync(data);
  };

  const handleForgotPassword = async (username: string, securityAnswer: string, newPassword: string) => {
    return forgotPasswordMutation.mutateAsync({ username, securityAnswer, newPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === "login" && (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setMode("signup")}
            onForgotPassword={() => setMode("forgot-password")}
            loading={loginMutation.isPending}
          />
        )}
        
        {mode === "signup" && (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setMode("login")}
            loading={signupMutation.isPending}
          />
        )}
        
        {mode === "forgot-password" && (
          <ForgotPassword
            onResetPassword={handleForgotPassword}
            onBack={() => setMode("login")}
            loading={forgotPasswordMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
