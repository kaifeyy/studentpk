import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { ArrowRight, Loader2 } from 'lucide-react';
import StudentStep1 from './steps/StudentStep1';
import StudentStep2 from './steps/StudentStep2';
import StudentStep3 from './steps/StudentStep3';
import SchoolStep1 from './steps/SchoolStep1';
import SchoolStep2 from './steps/SchoolStep2';

export default function OnboardingFlow() {
  const { 
    currentStep, 
    setCurrentStep, 
    userType, 
    submitOnboarding, 
    loading, 
    validateCurrentStep 
  } = useOnboarding();

  const totalSteps = userType === 'student' ? 3 : 2;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        submitOnboarding();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    if (!userType) return null;

    if (userType === 'student') {
      switch (currentStep) {
        case 1:
          return <StudentStep1 />;
        case 2:
          return <StudentStep2 />;
        case 3:
          return <StudentStep3 />;
        default:
          return null;
      }
    } else {
      switch (currentStep) {
        case 1:
          return <SchoolStep1 />;
        case 2:
          return <SchoolStep2 />;
        default:
          return null;
      }
    }
  };

  const getStepTitle = () => {
    if (!userType) return '';

    if (userType === 'student') {
      switch (currentStep) {
        case 1:
          return 'Personal Information';
        case 2:
          return 'Education Details';
        case 3:
          return 'Profile Setup';
        default:
          return '';
      }
    } else {
      switch (currentStep) {
        case 1:
          return 'School Information';
        case 2:
          return 'Admin Details';
        default:
          return '';
      }
    }
  };

  if (!userType) {
    // Redirect to role selection if no user type is selected
    window.location.href = '/role-selection';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {getStepTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {currentStep === totalSteps ? 'Complete' : 'Next'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
