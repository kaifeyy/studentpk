import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { apiRequest } from '../lib/axios';

type EducationType = 'matric' | 'o_level' | null;
type GenderType = 'male' | 'female' | 'other' | '';
type SchoolType = 'registered' | 'not_listed' | 'later' | null;

interface OnboardingData {
  // Step 1: Basic Info
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: GenderType;
  city: string;
  phoneNumber: string;
  securityQuestion: string;
  securityAnswer: string;
  
  // Step 2: Education Info
  educationType: EducationType;
  boardId: string;
  classGrade: string;
  schoolId: string | null;
  schoolName: string;
  schoolType: SchoolType;
  subjects: string[];
  
  // Step 3: Profile & Preferences
  profilePicture: File | null;
  bio: string;
  interests: string[];
  
  // School Admin Specific
  schoolData: {
    name: string;
    registrationNumber: string;
    establishedYear: number;
    principalName: string;
    contactNumber: string;
    address: string;
    website: string;
    educationLevel: 'matric' | 'o_level' | 'both';
    genderType: 'boys' | 'girls' | 'co_education';
    registrationProof: File | null;
    logo: File | null;
  };
}

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  userType: 'student' | 'school' | null;
  setUserType: (type: 'student' | 'school' | null) => void;
  formData: OnboardingData;
  updateFormData: (data: Partial<OnboardingData>) => void;
  submitOnboarding: () => Promise<void>;
  loading: boolean;
  errors: Record<string, string>;
  validateCurrentStep: () => boolean;
}

const defaultData: OnboardingData = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  gender: '',
  city: '',
  phoneNumber: '',
  securityQuestion: '',
  securityAnswer: '',
  educationType: null,
  boardId: '',
  classGrade: '',
  schoolId: null,
  schoolName: '',
  schoolType: null,
  subjects: [],
  profilePicture: null,
  bio: '',
  interests: [],
  schoolData: {
    name: '',
    registrationNumber: '',
    establishedYear: new Date().getFullYear(),
    principalName: '',
    contactNumber: '',
    address: '',
    website: '',
    educationLevel: 'both',
    genderType: 'co_education',
    registrationProof: null,
    logo: null,
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<'student' | 'school' | null>(null);
  const [formData, setFormData] = useState<OnboardingData>(defaultData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      schoolData: {
        ...prev.schoolData,
        ...(data.schoolData || {}),
      },
    }));
    
    // Clear errors when form data is updated
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }

    if (currentStep === 2 && userType === 'student') {
      if (!formData.educationType) newErrors.educationType = 'Please select education type';
      if (!formData.boardId) newErrors.boardId = 'Please select a board';
      if (!formData.classGrade) newErrors.classGrade = 'Please select your class/grade';
      if (formData.schoolType === null) newErrors.schoolType = 'Please select an option';
      if (formData.schoolType === 'registered' && !formData.schoolId) {
        newErrors.schoolId = 'Please select your school';
      }
      if (formData.schoolType === 'not_listed' && !formData.schoolName) {
        newErrors.schoolName = 'Please enter your school name';
      }
    }

    if (currentStep === 3 && userType === 'student') {
      if (formData.subjects.length === 0) {
        newErrors.subjects = 'Please select at least one subject';
      }
    }

    // School admin validation
    if (currentStep === 2 && userType === 'school') {
      const { schoolData } = formData;
      if (!schoolData.name) newErrors['schoolData.name'] = 'School name is required';
      if (!schoolData.registrationNumber) newErrors['schoolData.registrationNumber'] = 'Registration number is required';
      if (!schoolData.principalName) newErrors['schoolData.principalName'] = 'Principal name is required';
      if (!schoolData.contactNumber) newErrors['schoolData.contactNumber'] = 'Contact number is required';
      if (!schoolData.address) newErrors['schoolData.address'] = 'Address is required';
      if (!schoolData.registrationProof) newErrors['schoolData.registrationProof'] = 'Registration proof is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitOnboarding = async () => {
    try {
      setLoading(true);
      
      if (userType === 'student') {
        // Create FormData for file uploads
        const formDataToSend = new FormData();
        
        // Add student data
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'profilePicture' && value) {
            formDataTo.append('profileImage', value);
          } else if (key === 'schoolData') {
            // Skip school data for student
          } else if (Array.isArray(value)) {
            value.forEach(item => formDataToSend.append(`${key}[]`, item));
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(key, value as string);
          }
        });

        // Submit student profile
        await apiRequest({
          method: 'POST',
          url: '/api/onboarding/student/profile',
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Redirect to dashboard after successful onboarding
        toast({
          title: 'Profile completed!',
          description: 'Your profile has been successfully set up.',
        });
        navigate('/dashboard');

      } else if (userType === 'school') {
        // Handle school admin onboarding
        const formDataToSend = new FormData();
        const { schoolData, ...userData } = formData;

        // Add school data
        Object.entries(schoolData).forEach(([key, value]) => {
          if ((key === 'registrationProof' || key === 'logo') && value) {
            formDataToSend.append(key, value);
          } else if (value !== null && value !== undefined) {
            formDataToSend.append(`school_${key}`, value as string);
          }
        });

        // Add user data
        Object.entries(userData).forEach(([key, value]) => {
          if (key !== 'schoolData' && key !== 'profilePicture' && value !== null && value !== undefined) {
            formDataToSend.append(`user_${key}`, value as string);
          }
        });

        // Submit school registration
        await apiRequest({
          method: 'POST',
          url: '/api/onboarding/school/register',
          data: formDataToSend,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Redirect to school dashboard
        toast({
          title: 'School registered!',
          description: 'Your school has been successfully registered.',
        });
        navigate('/school/dashboard');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        userType,
        setUserType,
        formData,
        updateFormData,
        submitOnboarding,
        loading,
        errors,
        validateCurrentStep,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
