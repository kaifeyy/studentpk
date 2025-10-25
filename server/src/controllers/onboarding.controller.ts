import { Request, Response } from 'express';
import { z } from 'zod';
import { OnboardingService } from '../services/onboarding.service';
import { ApiResponse } from '../utils/apiResponse';
import { uploadToS3 } from '../utils/fileUpload';

// Validation schemas
const studentProfileSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dateOfBirth: z.string().datetime(),
  classGrade: z.string().min(1, 'Class grade is required'),
  educationType: z.enum(['matric', 'o_level']),
  boardId: z.string().uuid('Invalid board ID'),
  schoolId: z.string().uuid('Invalid school ID').optional().nullable(),
  bio: z.string().max(500).optional(),
  subjectIds: z.array(z.string().uuid()).min(1, 'At least one subject is required'),
});

const schoolRegistrationSchema = z.object({
  name: z.string().min(3).max(255),
  registrationNumber: z.string().min(3).max(50),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()),
  principalName: z.string().min(3).max(100),
  email: z.string().email(),
  contactNumber: z.string().min(10).max(20),
  address: z.string().min(5),
  city: z.string().min(2).max(100),
  website: z.string().url().optional(),
  educationLevel: z.enum(['matric', 'o_level', 'both']),
  genderType: z.enum(['boys', 'girls', 'co_education']),
});

export class OnboardingController {
  // Get education boards
  static async getEducationBoards(req: Request, res: Response) {
    try {
      const { type } = req.query;
      const educationType = type === 'matric' || type === 'o_level' ? type : undefined;
      
      const boards = await OnboardingService.getEducationBoards(educationType);
      return ApiResponse.success(res, { boards });
    } catch (error) {
      console.error('Error getting education boards:', error);
      return ApiResponse.error(res, 'Failed to fetch education boards');
    }
  }

  // Get subjects by board and education type
  static async getSubjects(req: Request, res: Response) {
    try {
      const { boardId, educationType } = req.query;
      
      if (!boardId || typeof boardId !== 'string') {
        return ApiResponse.badRequest(res, 'Board ID is required');
      }
      
      if (educationType !== 'matric' && educationType !== 'o_level') {
        return ApiResponse.badRequest(res, 'Invalid education type');
      }
      
      const subjects = await OnboardingService.getSubjects(boardId, educationType);
      return ApiResponse.success(res, { subjects });
    } catch (error) {
      console.error('Error getting subjects:', error);
      return ApiResponse.error(res, 'Failed to fetch subjects');
    }
  }

  // Search schools
  static async searchSchools(req: Request, res: Response) {
    try {
      const { query, city } = req.query;
      
      if (!query || typeof query !== 'string') {
        return ApiResponse.badRequest(res, 'Search query is required');
      }
      
      const schools = await OnboardingService.searchSchools(
        query, 
        typeof city === 'string' ? city : undefined
      );
      
      return ApiResponse.success(res, { schools });
    } catch (error) {
      console.error('Error searching schools:', error);
      return ApiResponse.error(res, 'Failed to search schools');
    }
  }

  // Complete student profile
  static async completeStudentProfile(req: Request, res: Response) {
    try {
      // @ts-ignore - auth middleware adds user to request
      const userId = req.user.userId;
      
      const result = studentProfileSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.badRequest(res, 'Validation failed', result.error.errors);
      }
      
      const { firstName, lastName, ...profileData } = result.data;
      
      // Update basic user info
      await OnboardingService.updateUserProfile(userId, {
        firstName,
        lastName,
        city: profileData.schoolId ? undefined : profileData.city,
      });
      
      // Create student profile
      const profile = await OnboardingService.createStudentProfile(userId, {
        ...profileData,
        dateOfBirth: new Date(profileData.dateOfBirth),
      });
      
      return ApiResponse.success(res, { profile }, 'Profile completed successfully');
    } catch (error) {
      console.error('Error completing student profile:', error);
      return ApiResponse.error(res, 'Failed to complete profile');
    }
  }

  // Register school
  static async registerSchool(req: Request, res: Response) {
    try {
      // @ts-ignore - auth middleware adds user to request
      const userId = req.user.userId;
      
      const result = schoolRegistrationSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.badRequest(res, 'Validation failed', result.error.errors);
      }
      
      // Handle file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Upload registration proof
      let registrationProofUrl: string | undefined;
      if (files.registrationProof?.[0]) {
        registrationProofUrl = await uploadToS3(files.registrationProof[0]);
      }
      
      // Upload logo if provided
      let logoUrl: string | undefined;
      if (files.logo?.[0]) {
        logoUrl = await uploadToS3(files.logo[0]);
      }
      
      // Create school
      const school = await OnboardingService.createSchool(userId, {
        ...result.data,
        registrationProof: registrationProofUrl || '',
        logo: logoUrl,
      });
      
      return ApiResponse.success(res, { school }, 'School registered successfully');
    } catch (error) {
      console.error('Error registering school:', error);
      return ApiResponse.error(res, 'Failed to register school');
    }
  }

  // Check username availability
  static async checkUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return ApiResponse.badRequest(res, 'Username is required');
      }
      
      const isAvailable = await OnboardingService.isUsernameAvailable(username);
      
      return ApiResponse.success(res, { available: isAvailable });
    } catch (error) {
      console.error('Error checking username:', error);
      return ApiResponse.error(res, 'Failed to check username availability');
    }
  }
}
