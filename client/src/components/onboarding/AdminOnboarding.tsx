import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { School, MapPin, Building, FileText, Camera, Upload, ArrowRight, ArrowLeft, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const adminOnboardingSchema = z.object({
  // School Information
  schoolName: z.string().min(3, "School name must be at least 3 characters"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  establishedYear: z.number().min(1900).max(new Date().getFullYear()),
  principalName: z.string().min(3, "Principal name is required"),
  
  // Contact Information
  email: z.string().email("Please enter a valid email"),
  contactNumber: z.string().min(10, "Please enter a valid contact number"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  
  // Location
  address: z.string().min(10, "Please provide a detailed address"),
  city: z.string().min(1, "Please select your city"),
  
  // Education Details
  educationLevel: z.enum(['matric', 'o_level', 'both'], {
    required_error: "Please select education level",
  }),
  genderType: z.enum(['boys', 'girls', 'co_education'], {
    required_error: "Please select school type",
  }),
  
  // Proof Documents
  registrationProof: z.any().refine((file) => file instanceof File, "Registration proof is required"),
  schoolLogo: z.any().optional(),
  
  // Classes offered
  classesOffered: z.array(z.string()).min(1, "Please select at least one class"),
});

type AdminOnboardingForm = z.infer<typeof adminOnboardingSchema>;

interface AdminOnboardingProps {
  onComplete: (data: AdminOnboardingForm) => Promise<void>;
  loading?: boolean;
}

const AVAILABLE_CLASSES = [
  "Pre-K", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "O Level Year 1", "O Level Year 2", "O Level Year 3",
  "A Level Year 1", "A Level Year 2"
];

export function AdminOnboarding({ onComplete, loading = false }: AdminOnboardingProps) {
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AdminOnboardingForm>({
    resolver: zodResolver(adminOnboardingSchema),
  });

  const selectedClasses = watch("classesOffered") || [];

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

  const onSubmit = async (data: AdminOnboardingForm) => {
    try {
      await onComplete(data);
    } catch (error) {
      console.error('Admin onboarding failed:', error);
    }
  };

  const handleClassToggle = (className: string) => {
    const current = selectedClasses || [];
    const updated = current.includes(className)
      ? current.filter(c => c !== className)
      : [...current, className];
    setValue("classesOffered", updated);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("schoolLogo", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("registrationProof", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "School Information";
      case 2: return "Contact & Location";
      case 3: return "Education Details";
      case 4: return "Documents & Classes";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Basic information about your school";
      case 2: return "How can students and parents reach you?";
      case 3: return "What type of education do you provide?";
      case 4: return "Upload documents and select classes offered";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <School className="w-8 h-8 text-white" />
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
                    stepNum <= step ? 'bg-secondary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: School Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    placeholder="e.g., Lahore Grammar School"
                    {...register("schoolName")}
                    className={errors.schoolName ? "border-destructive" : ""}
                  />
                  {errors.schoolName && (
                    <p className="text-sm text-destructive">{errors.schoolName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="e.g., REG-001-2020"
                      {...register("registrationNumber")}
                      className={errors.registrationNumber ? "border-destructive" : ""}
                    />
                    {errors.registrationNumber && (
                      <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year *</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      placeholder="e.g., 1995"
                      {...register("establishedYear", { valueAsNumber: true })}
                      className={errors.establishedYear ? "border-destructive" : ""}
                    />
                    {errors.establishedYear && (
                      <p className="text-sm text-destructive">{errors.establishedYear.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name *</Label>
                  <Input
                    id="principalName"
                    placeholder="e.g., Dr. Sarah Ahmed"
                    {...register("principalName")}
                    className={errors.principalName ? "border-destructive" : ""}
                  />
                  {errors.principalName && (
                    <p className="text-sm text-destructive">{errors.principalName.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Contact & Location */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">School Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@school.edu.pk"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      placeholder="+92 42 1234567"
                      {...register("contactNumber")}
                      className={errors.contactNumber ? "border-destructive" : ""}
                    />
                    {errors.contactNumber && (
                      <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.school.edu.pk"
                    {...register("website")}
                    className={errors.website ? "border-destructive" : ""}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">School Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Complete address with landmarks"
                    {...register("address")}
                    className={errors.address ? "border-destructive" : ""}
                    rows={3}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
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
            )}

            {/* Step 3: Education Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Education Level Offered *</Label>
                  <Select onValueChange={(value) => setValue("educationLevel", value as 'matric' | 'o_level' | 'both')}>
                    <SelectTrigger className={errors.educationLevel ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select education system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matric">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Matric System Only
                        </div>
                      </SelectItem>
                      <SelectItem value="o_level">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          O/A Levels Only
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Both Systems
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.educationLevel && (
                    <p className="text-sm text-destructive">{errors.educationLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>School Type *</Label>
                  <Select onValueChange={(value) => setValue("genderType", value as 'boys' | 'girls' | 'co_education')}>
                    <SelectTrigger className={errors.genderType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select school type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="boys">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Boys Only
                        </div>
                      </SelectItem>
                      <SelectItem value="girls">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Girls Only
                        </div>
                      </SelectItem>
                      <SelectItem value="co_education">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Co-Education
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.genderType && (
                    <p className="text-sm text-destructive">{errors.genderType.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Documents & Classes */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Label>School Logo (Optional)</Label>
                    <div className="flex flex-col items-center gap-4 mt-2">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={logoPreview || undefined} />
                        <AvatarFallback>
                          <School className="w-12 h-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Registration Proof Document *</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      {proofPreview ? (
                        <div className="space-y-2">
                          <FileText className="w-12 h-12 mx-auto text-green-500" />
                          <p className="text-sm text-green-600">Document uploaded successfully</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('proof-upload')?.click()}
                          >
                            Change Document
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('proof-upload')?.click()}
                            >
                              Upload Document
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                              PDF, Image files accepted
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        id="proof-upload"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                    </div>
                    {errors.registrationProof && (
                      <p className="text-sm text-destructive">{errors.registrationProof.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Classes Offered *</Label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
                    {AVAILABLE_CLASSES.map((className) => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox
                          id={className}
                          checked={selectedClasses?.includes(className)}
                          onCheckedChange={() => handleClassToggle(className)}
                        />
                        <Label htmlFor={className} className="text-sm cursor-pointer">
                          {className}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.classesOffered && (
                    <p className="text-sm text-destructive">{errors.classesOffered.message}</p>
                  )}
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
                      Registering School...
                    </div>
                  ) : (
                    "Complete Registration"
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
