import React, { useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Upload } from 'lucide-react';

export default function SchoolStep1() {
  const { formData, updateFormData, errors } = useOnboarding();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [registrationProofPreview, setRegistrationProofPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({
      schoolData: {
        ...formData.schoolData,
        [name]: value
      }
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    updateFormData({
      schoolData: {
        ...formData.schoolData,
        [name]: value
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'registrationProof') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type && !file.type.startsWith('image/') && !file.type.includes('pdf')) {
      alert('Please upload an image or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'logo') {
          setLogoPreview(reader.result as string);
        } else {
          setRegistrationProofPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }

    updateFormData({
      schoolData: {
        ...formData.schoolData,
        [field]: file
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">School Information</h3>
        <p className="text-sm text-gray-500">
          Please provide your school's details. This information will be verified by our team.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">School Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.schoolData.name}
              onChange={handleChange}
              placeholder="ABC Public School"
              className={errors['schoolData.name'] ? 'border-red-500' : ''}
            />
            {errors['schoolData.name'] && (
              <p className="text-sm text-red-500">{errors['schoolData.name']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              value={formData.schoolData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., REG-12345"
              className={errors['schoolData.registrationNumber'] ? 'border-red-500' : ''}
            />
            {errors['schoolData.registrationNumber'] && (
              <p className="text-sm text-red-500">{errors['schoolData.registrationNumber']}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="establishedYear">Year Established *</Label>
            <Select
              value={formData.schoolData.establishedYear.toString()}
              onValueChange={(value) => handleSelectChange('establishedYear', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationLevel">Education Level *</Label>
            <Select
              value={formData.schoolData.educationLevel}
              onValueChange={(value) => 
                handleSelectChange('educationLevel', value as 'matric' | 'o_level' | 'both')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matric">Matriculation</SelectItem>
                <SelectItem value="o_level">O-Levels</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>School Type *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                formData.schoolData.genderType === 'boys' 
                  ? 'border-primary bg-primary/10' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChange('genderType', 'boys')}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.schoolData.genderType === 'boys' 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}></div>
                <span>Boys</span>
              </div>
            </div>
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                formData.schoolData.genderType === 'girls' 
                  ? 'border-primary bg-primary/10' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChange('genderType', 'girls')}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.schoolData.genderType === 'girls' 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}></div>
                <span>Girls</span>
              </div>
            </div>
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                formData.schoolData.genderType === 'co_education' 
                  ? 'border-primary bg-primary/10' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectChange('genderType', 'co_education')}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  formData.schoolData.genderType === 'co_education' 
                    ? 'border-primary bg-primary' 
                    : 'border-gray-300'
                }`}></div>
                <span>Co-Education</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="principalName">Principal Name *</Label>
          <Input
            id="principalName"
            name="principalName"
            value={formData.schoolData.principalName}
            onChange={handleChange}
            placeholder="Principal's full name"
            className={errors['schoolData.principalName'] ? 'border-red-500' : ''}
          />
          {errors['schoolData.principalName'] && (
            <p className="text-sm text-red-500">{errors['schoolData.principalName']}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            value={formData.schoolData.contactNumber}
            onChange={handleChange}
            placeholder="e.g., +92 300 1234567"
            className={errors['schoolData.contactNumber'] ? 'border-red-500' : ''}
          />
          {errors['schoolData.contactNumber'] && (
            <p className="text-sm text-red-500">{errors['schoolData.contactNumber']}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.schoolData.address}
            onChange={handleChange}
            placeholder="Full school address"
            className={errors['schoolData.address'] ? 'border-red-500' : ''}
          />
          {errors['schoolData.address'] && (
            <p className="text-sm text-red-500">{errors['schoolData.address']}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.schoolData.website}
            onChange={handleChange}
            placeholder="https://www.yourschool.edu.pk"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>School Logo</Label>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="h-5 w-5 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, 'logo')}
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Upload your school logo</p>
                <p className="text-xs">JPG, PNG (max 5MB)</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Registration Proof *</Label>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {registrationProofPreview ? (
                  <img 
                    src={registrationProofPreview} 
                    alt="Registration proof preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, 'registrationProof')}
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Upload registration document</p>
                <p className="text-xs">PDF or Image (max 5MB)</p>
                {errors['schoolData.registrationProof'] && (
                  <p className="text-xs text-red-500">{errors['schoolData.registrationProof']}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
