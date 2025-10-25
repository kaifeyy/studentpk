import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, Check, X, GraduationCap, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
}

const signupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
  role: z.enum(["student", "admin"], {
    required_error: "Please select your role",
  }),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  securityQuestion: z.string().optional(),
  securityAnswer: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.securityQuestion && !data.securityAnswer) {
    return false;
  }
  return true;
}, {
  message: "Please provide an answer to your security question",
  path: ["securityAnswer"],
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignupProps {
  onSignup: (data: SignupForm) => Promise<void>;
  onSwitchToLogin: () => void;
  loading?: boolean;
}

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite book?",
  "What city were you born in?",
  "What is your favorite teacher's name?",
];

export function Signup({ onSignup, onSwitchToLogin, loading = false }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const username = watch("username");
  const role = watch("role");
  const securityQuestion = watch("securityQuestion");

  // Debounced username checking
  const checkUsername = debounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    try {
      const response = await fetch(`/api/auth/check-username/${username}`);
      const data = await response.json();
      setUsernameStatus(data.available ? "available" : "taken");
    } catch (error) {
      setUsernameStatus("idle");
    }
  }, 500);

  useEffect(() => {
    if (username) {
      checkUsername(username);
    }
  }, [username]);

  const onSubmit = async (data: SignupForm) => {
    try {
      setError("");
      if (usernameStatus === "taken") {
        setError("Username is already taken");
        return;
      }
      await onSignup(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Signup failed";
      setError(errorMessage);
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getUsernameStatusIcon = () => {
    switch (usernameStatus) {
      case "checking":
        return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
      case "available":
        return <Check className="w-4 h-4 text-green-500" />;
      case "taken":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <UserPlus className="w-10 h-10 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">Join Student Pakistan</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label>I am a</Label>
            <Select onValueChange={(value) => setValue("role", value as "student" | "admin")}>
              <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4" />
                    School Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="johndoe123"
                {...register("username")}
                className={errors.username || usernameStatus === "taken" ? "border-destructive pr-10" : "pr-10"}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getUsernameStatusIcon()}
              </div>
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
            {usernameStatus === "taken" && (
              <p className="text-sm text-destructive">This username is already taken</p>
            )}
            {usernameStatus === "available" && (
              <p className="text-sm text-green-600">Username is available!</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                {...register("password")}
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Security Question (Optional) */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              <strong>Security Question (Optional)</strong>
              <br />
              This will help you recover your password if you forget it.
            </div>
            
            <div className="space-y-2">
              <Label>Security Question</Label>
              <Select onValueChange={(value) => setValue("securityQuestion", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a security question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((question, index) => (
                    <SelectItem key={index} value={question}>
                      {question}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {securityQuestion && (
              <div className="space-y-2">
                <Label htmlFor="securityAnswer">Your Answer</Label>
                <Input
                  id="securityAnswer"
                  type="text"
                  placeholder="Enter your answer"
                  {...register("securityAnswer")}
                  className={errors.securityAnswer ? "border-destructive" : ""}
                />
                {errors.securityAnswer && (
                  <p className="text-sm text-destructive">{errors.securityAnswer.message}</p>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || loading || usernameStatus === "taken"}
          >
            {isSubmitting || loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-primary hover:text-primary/80"
              onClick={onSwitchToLogin}
            >
              Sign in here
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
