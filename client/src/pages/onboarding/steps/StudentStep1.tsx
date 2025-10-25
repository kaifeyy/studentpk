import React from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Calendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { Button } from '../../../components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

export default function StudentStep1() {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
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
            placeholder="johndoe"
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
            placeholder="john@example.com"
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
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
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
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                toYear={new Date().getFullYear() - 10}
              />
            </PopoverContent>
          </Popover>
          {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => updateFormData({ gender: value as any })}
          >
            <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Lahore"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="securityQuestion">Security Question (Optional)</Label>
        <Input
          id="securityQuestion"
          name="securityQuestion"
          value={formData.securityQuestion}
          onChange={handleChange}
          placeholder="What was the name of your first pet?"
        />
        {formData.securityQuestion && (
          <Input
            id="securityAnswer"
            name="securityAnswer"
            value={formData.securityAnswer}
            onChange={handleChange}
            placeholder="Your answer"
            className="mt-2"
          />
        )}
      </div>
    </div>
  );
}
