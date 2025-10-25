import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { Button } from '../../../components/ui/button';
import { Loader2, Upload, X } from 'lucide-react';
import { Textarea } from '../../../components/ui/textarea';
import { apiRequest } from '../../../lib/axios';

interface Subject {
  id: string;
  name: string;
  code: string;
  isCompulsory: boolean;
}

export default function StudentStep3() {
  const { formData, updateFormData, errors } = useOnboarding();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch subjects based on selected board and education type
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!formData.boardId || !formData.educationType) return;
      
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/api/onboarding/subjects', {
          params: {
            boardId: formData.boardId,
            educationType: formData.educationType
          }
        });
        setSubjects(response.data.subjects || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [formData.boardId, formData.educationType]);

  // Handle subject selection
  const handleSubjectToggle = (subjectId: string, isSelected: boolean) => {
    const updatedSubjects = isSelected
      ? [...formData.subjects, subjectId]
      : formData.subjects.filter(id => id !== subjectId);
    
    updateFormData({ subjects: updatedSubjects });
  };

  // Handle profile picture upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    updateFormData({ profilePicture: file });
  };

  // Handle bio update
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ bio: e.target.value });
  };

  // Group subjects by compulsory/optional
  const compulsorySubjects = subjects.filter(subject => subject.isCompulsory);
  const optionalSubjects = subjects.filter(subject => !subject.isCompulsory);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Complete Your Profile</h3>
        <p className="text-sm text-gray-500">
          Add some personal touches to make your profile stand out.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
              {previewImage ? (
                <>
                  <img 
                    src={previewImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(null);
                      updateFormData({ profilePicture: null });
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Upload a clear photo of yourself</p>
              <p className="text-xs">JPG, PNG (max 2MB)</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">About You</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself, your interests, and your goals..."
            className="min-h-[100px]"
            value={formData.bio}
            onChange={handleBioChange}
          />
          <p className="text-xs text-gray-500">
            This will be visible on your profile. Max 500 characters.
          </p>
        </div>

        {/* Subject Selection */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Select Your Subjects *</Label>
            <p className="text-sm text-gray-500">
              Choose the subjects you're currently studying.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {compulsorySubjects.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Compulsory Subjects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {compulsorySubjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject.id}
                          checked={formData.subjects.includes(subject.id)}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(subject.id, checked as boolean)
                          }
                          disabled // Compulsory subjects are selected by default and can't be deselected
                        />
                        <Label htmlFor={subject.id} className="font-normal">
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {optionalSubjects.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Optional Subjects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {optionalSubjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject.id}
                          checked={formData.subjects.includes(subject.id)}
                          onCheckedChange={(checked) => 
                            handleSubjectToggle(subject.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={subject.id} className="font-normal">
                          {subject.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {errors.subjects && (
                <p className="text-sm text-red-500">{errors.subjects}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
