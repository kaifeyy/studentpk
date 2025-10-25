import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const stepOneSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

const stepTwoSchema = z.object({
  securityAnswer: z.string().min(1, "Please provide an answer"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type StepOneForm = z.infer<typeof stepOneSchema>;
type StepTwoForm = z.infer<typeof stepTwoSchema>;

interface ForgotPasswordProps {
  onResetPassword: (username: string, securityAnswer: string, newPassword: string) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export function ForgotPassword({ onResetPassword, onBack, loading = false }: ForgotPasswordProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [error, setError] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const stepOneForm = useForm<StepOneForm>({
    resolver: zodResolver(stepOneSchema),
  });

  const stepTwoForm = useForm<StepTwoForm>({
    resolver: zodResolver(stepTwoSchema),
  });

  const onStepOneSubmit = async (data: StepOneForm) => {
    try {
      setError("");
      const response = await fetch(`/api/auth/user-security-question/${data.username}`);
      
      if (!response.ok) {
        throw new Error("User not found or no security question set");
      }
      
      const result = await response.json();
      setUsername(data.username);
      setSecurityQuestion(result.securityQuestion);
      setStep(2);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to find user";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onStepTwoSubmit = async (data: StepTwoForm) => {
    try {
      setError("");
      await onResetPassword(username, data.securityAnswer, data.newPassword);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now login with your new password.",
      });
      onBack(); // Go back to login
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Password reset failed";
      setError(errorMessage);
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <KeyRound className="w-10 h-10 text-white" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === 1
              ? "Enter your username to find your security question"
              : "Answer your security question to reset your password"
            }
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          className="p-0 h-auto text-muted-foreground hover:text-primary"
          onClick={step === 1 ? onBack : () => setStep(1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? "Back to Login" : "Back"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <form onSubmit={stepOneForm.handleSubmit(onStepOneSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...stepOneForm.register("username")}
                className={stepOneForm.formState.errors.username ? "border-destructive" : ""}
              />
              {stepOneForm.formState.errors.username && (
                <p className="text-sm text-destructive">
                  {stepOneForm.formState.errors.username.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={stepOneForm.formState.isSubmitting || loading}
            >
              {stepOneForm.formState.isSubmitting || loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Finding User...
                </div>
              ) : (
                "Find Security Question"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={stepTwoForm.handleSubmit(onStepTwoSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Security Question</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{securityQuestion}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="securityAnswer">Your Answer</Label>
              <Input
                id="securityAnswer"
                type="text"
                placeholder="Enter your answer"
                {...stepTwoForm.register("securityAnswer")}
                className={stepTwoForm.formState.errors.securityAnswer ? "border-destructive" : ""}
              />
              {stepTwoForm.formState.errors.securityAnswer && (
                <p className="text-sm text-destructive">
                  {stepTwoForm.formState.errors.securityAnswer.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...stepTwoForm.register("newPassword")}
                  className={stepTwoForm.formState.errors.newPassword ? "border-destructive pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {stepTwoForm.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {stepTwoForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...stepTwoForm.register("confirmNewPassword")}
                  className={stepTwoForm.formState.errors.confirmNewPassword ? "border-destructive pr-10" : "pr-10"}
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
              {stepTwoForm.formState.errors.confirmNewPassword && (
                <p className="text-sm text-destructive">
                  {stepTwoForm.formState.errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={stepTwoForm.formState.isSubmitting || loading}
            >
              {stepTwoForm.formState.isSubmitting || loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
