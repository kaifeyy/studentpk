import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { apiRequest } from '../../../lib/axios';

interface EducationBoard {
  id: string;
  name: string;
  type: string;
  region: string;
}

interface School {
  id: string;
  name: string;
  city: string;
}

export default function StudentStep2() {
  const { formData, updateFormData, errors } = useOnboarding();
  const [boards, setBoards] = useState<EducationBoard[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch education boards on component mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await apiRequest.get('/api/onboarding/boards');
        setBoards(response.data.boards || []);
      } catch (error) {
        console.error('Error fetching education boards:', error);
      }
    };

    fetchBoards();
  }, []);

  // Search for schools when query changes
  useEffect(() => {
    const searchSchools = async () => {
      if (searchQuery.length < 2) {
        setSchools([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiRequest.get('/api/onboarding/schools/search', {
          params: { query: searchQuery, city: formData.city || '' }
        });
        setSchools(response.data.schools || []);
      } catch (error) {
        console.error('Error searching schools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchSchools();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, formData.city]);

  const handleEducationTypeChange = (value: 'matric' | 'o_level') => {
    updateFormData({ 
      educationType: value,
      boardId: '', // Reset board when education type changes
      subjects: [] // Reset subjects when education type changes
    });
  };

  const handleSchoolSelect = (school: School) => {
    updateFormData({ 
      schoolId: school.id,
      schoolName: school.name,
      schoolType: 'registered' as const
    });
    setSearchQuery(school.name);
    setSchools([]);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Education Details</h3>
        <p className="text-sm text-gray-500">
          Please provide your education information to help us personalize your experience.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Education Type *</Label>
            <Select
              value={formData.educationType || ''}
              onValueChange={(value: 'matric' | 'o_level') => handleEducationTypeChange(value)}
            >
              <SelectTrigger className={errors.educationType ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select education type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matric">Matriculation</SelectItem>
                <SelectItem value="o_level">O-Levels</SelectItem>
              </SelectContent>
            </Select>
            {errors.educationType && <p className="text-sm text-red-500">{errors.educationType}</p>}
          </div>

          <div className="space-y-2">
            <Label>Education Board *</Label>
            <Select
              value={formData.boardId}
              onValueChange={(value) => updateFormData({ boardId: value })}
              disabled={!formData.educationType}
            >
              <SelectTrigger className={errors.boardId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {boards
                  .filter(
                    (board) =>
                      board.type === formData.educationType || board.type === 'both'
                  )
                  .map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name} {board.region ? `(${board.region})` : ''}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.boardId && <p className="text-sm text-red-500">{errors.boardId}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Class/Grade *</Label>
          <Select
            value={formData.classGrade}
            onValueChange={(value) => updateFormData({ classGrade: value })}
            disabled={!formData.educationType}
          >
            <SelectTrigger className={errors.classGrade ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select your class/grade" />
            </SelectTrigger>
            <SelectContent>
              {formData.educationType === 'matric' ? (
                // Matriculation classes (9th to 12th)
                <>
                  <SelectItem value="9th">9th Class</SelectItem>
                  <SelectItem value="10th">10th Class</SelectItem>
                  <SelectItem value="1st Year">1st Year (11th)</SelectItem>
                  <SelectItem value="2nd Year">2nd Year (12th)</SelectItem>
                </>
              ) : (
                // O-Levels (Year 7 to Year 11)
                <>
                  <SelectItem value="Year 7">Year 7</SelectItem>
                  <SelectItem value="Year 8">Year 8</SelectItem>
                  <SelectItem value="Year 9">Year 9</SelectItem>
                  <SelectItem value="O1">O1 (10th)</SelectItem>
                  <SelectItem value="O2">O2 (11th)</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {errors.classGrade && <p className="text-sm text-red-500">{errors.classGrade}</p>}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>School Information</Label>
            <p className="text-sm text-gray-500">
              Let us know about your school (you can update this later).
            </p>
          </div>

          <RadioGroup
            value={formData.schoolType || ''}
            onValueChange={(value) => {
              updateFormData({ 
                schoolType: value as 'registered' | 'not_listed' | 'later',
                schoolId: null,
                schoolName: ''
              });
              setSearchQuery('');
            }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="registered" id="registered" />
              <Label htmlFor="registered">My school is registered on Student Pakistan</Label>
            </div>

            {formData.schoolType === 'registered' && (
              <div className="pl-6 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for your school..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : schools.length > 0 ? (
                  <div className="border rounded-md max-h-48 overflow-y-auto">
                    {schools.map((school) => (
                      <div
                        key={school.id}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                          formData.schoolId === school.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleSchoolSelect(school)}
                      >
                        <p className="font-medium">{school.name}</p>
                        <p className="text-sm text-gray-500">{school.city}</p>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <p className="text-sm text-muted-foreground">
                    No schools found. Try a different search or select another option.
                  </p>
                ) : null}
                
                {formData.schoolId && (
                  <div className="mt-2 p-3 bg-green-50 rounded-md border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      Selected: {formData.schoolName}
                    </p>
                  </div>
                )}
                
                {errors.schoolId && <p className="text-sm text-red-500">{errors.schoolId}</p>}
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="not_listed" id="not_listed" />
              <Label htmlFor="not_listed">My school is not listed</Label>
            </div>

            {formData.schoolType === 'not_listed' && (
              <div className="pl-6 space-y-2">
                <Input
                  placeholder="Enter your school name"
                  value={formData.schoolName}
                  onChange={(e) => updateFormData({ schoolName: e.target.value })}
                  className={errors.schoolName ? 'border-red-500' : ''}
                />
                {errors.schoolName && <p className="text-sm text-red-500">{errors.schoolName}</p>}
                <p className="text-xs text-muted-foreground">
                  We'll help you connect with your school later.
                </p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="later" id="later" />
              <Label htmlFor="later">I'll add my school later</Label>
            </div>
          </RadioGroup>
          
          {errors.schoolType && <p className="text-sm text-red-500">{errors.schoolType}</p>}
        </div>
      </div>
    </div>
  );
}
