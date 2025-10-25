import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

export default function SchoolStep2() {
  const { formData, updateFormData, errors } = useOnboarding();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateFormData({ dateOfBirth: date.toISOString() });
    }
  };

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
    updateFormData({ profilePicture: file });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Admin Information</h3>
        <p className="text-sm text-gray-500">
          Please provide your personal details as the school administrator.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
            {formData.profilePicture ? (
              <img 
                src={URL.createObjectURL(formData.profilePicture)} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-gray-500">Click to upload profile picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className={errors.username ? 'border-red-500' : ''}
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@school.edu.pk"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Date of Birth *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dateOfBirth && "text-muted-foreground",
                    errors.dateOfBirth ? 'border-red-500' : ''
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfBirth ? (
                    format(new Date(formData.dateOfBirth), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                  fromYear={new Date().getFullYear() - 100}
                  toYear={new Date().getFullYear() - 18}
                />
              </PopoverContent>
            </Popover>
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Your city"
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About You</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            placeholder="Tell us a bit about yourself and your role at the school..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
