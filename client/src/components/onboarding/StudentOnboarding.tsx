import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, MapPin, GraduationCap, BookOpen, User, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

// Pakistani cities for easy selection
const PAKISTANI_CITIES = [
  "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala",
  "Hyderabad", "Peshawar", "Quetta", "Islamabad", "Sialkot", "Sargodha",
  "Bahawalpur", "Sukkur", "Jhang", "Mardan", "Kasur", "Rahim Yar Khan",
  "Sahiwal", "Okara", "Wah Cantonment", "Dera Ghazi Khan", "Mirpur Khas",
  "Nawabshah", "Mingora", "Chiniot", "Kamoke", "Mandi Bahauddin", "Jhelum",
  "Sadiqabad", "Jacobabad", "Shikarpur", "Khanewal", "Hafizabad"
];

const studentOnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  age: z.number().min(12).max(25),
  city: z.string().min(1, "Please select your city"),
  educationType: z.enum(['matric', 'o_level'], {
    required_error: "Please select your education type",
  }),
  grade: z.string().min(1, "Please select your grade"),
  boardId: z.string().min(1, "Please select your education board"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  bio: z.string().max(200).optional(),
});

type StudentOnboardingForm = z.infer<typeof studentOnboardingSchema>;

interface StudentOnboardingProps {
  onComplete: (data: StudentOnboardingForm) => Promise<void>;
  loading?: boolean;
}

export function StudentOnboarding({ onComplete, loading = false }: StudentOnboardingProps) {
  const [step, setStep] = useState(1);
  const [boards, setBoards] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<StudentOnboardingForm>({
    resolver: zodResolver(studentOnboardingSchema),
  });

  const educationType = watch("educationType");
  const selectedSubjects = watch("subjects") || [];

  // Fetch boards when education type changes
  useEffect(() => {
    if (educationType) {
      fetchBoards(educationType);
      fetchGrades(educationType);
      fetchSubjects(educationType);
    }
  }, [educationType]);

  const fetchBoards = async (type: 'matric' | 'o_level') => {
    try {
      const response = await fetch(`/api/boards/type/${type}`);
      const data = await response.json();
      setBoards(data.boards || []);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      toast({
        title: "Error",
        description: "Failed to load education boards",
        variant: "destructive",
      });
    }
  };

  const fetchGrades = async (type: 'matric' | 'o_level') => {
    try {
      const response = await fetch(`/api/boards/grade-levels/${type}`);
      const data = await response.json();
      setGrades(data.gradeLevels || []);
    } catch (error) {
      console.error('Failed to fetch grades:', error);
    }
  };

  const fetchSubjects = async (type: 'matric' | 'o_level') => {
    try {
      const response = await fetch(`/api/boards/subjects/${type}`);
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: StudentOnboardingForm) => {
    try {
      await onComplete(data);
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    const current = selectedSubjects || [];
    const updated = current.includes(subject)
      ? current.filter(s => s !== subject)
      : [...current, subject];
    setValue("subjects", updated);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Personal Information";
      case 2: return "Location & Age";
      case 3: return "Education Details";
      case 4: return "Subjects & Profile";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Let's start with your basic information";
      case 2: return "Tell us about your location and age";
      case 3: return "Choose your education type and board";
      case 4: return "Select your subjects and complete your profile";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
          
          {/* Progress Bar */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full ${
                    stepNum <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Ahmed"
                      {...register("firstName")}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Khan"
                      {...register("lastName")}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Age */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      min="12"
                      max="25"
                      placeholder="16"
                      {...register("age", { valueAsNumber: true })}
                      className={errors.age ? "border-destructive" : ""}
                    />
                    {errors.age && (
                      <p className="text-sm text-destructive">{errors.age.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Select onValueChange={(value) => setValue("city", value)}>
                      <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAKISTANI_CITIES.map((city) => (
                          <SelectItem key={city} value={city}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {city}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Education Details */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Education Type *</Label>
                  <Select onValueChange={(value) => setValue("educationType", value as 'matric' | 'o_level')}>
                    <SelectTrigger className={errors.educationType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Choose your education system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matric">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Matric System
                        </div>
                      </SelectItem>
                      <SelectItem value="o_level">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          O Levels
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.educationType && (
                    <p className="text-sm text-destructive">{errors.educationType.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grade/Class *</Label>
                    <Select onValueChange={(value) => setValue("grade", value)} disabled={!educationType}>
                      <SelectTrigger className={errors.grade ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select your grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {grades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.grade && (
                      <p className="text-sm text-destructive">{errors.grade.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Education Board *</Label>
                    <Select onValueChange={(value) => setValue("boardId", value)} disabled={!educationType}>
                      <SelectTrigger className={errors.boardId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select your board" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map((board) => (
                          <SelectItem key={board.id} value={board.id}>
                            {board.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.boardId && (
                      <p className="text-sm text-destructive">{errors.boardId.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Subjects & Profile */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Select Your Subjects *</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject}
                          checked={selectedSubjects?.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label htmlFor={subject} className="text-sm cursor-pointer">
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedSubjects?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.subjects && (
                    <p className="text-sm text-destructive">{errors.subjects.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <Label>Profile Picture (Optional)</Label>
                    <div className="flex flex-col items-center gap-4 mt-2">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileImage || undefined} />
                        <AvatarFallback>
                          <User className="w-12 h-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Input
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      {...register("bio")}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {watch("bio")?.length || 0}/200 characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Completing...
                    </div>
                  ) : (
                    "Complete Profile"
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
