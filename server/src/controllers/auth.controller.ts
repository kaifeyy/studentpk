import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  password: z.string().min(8),
  role: z.enum(['student', 'admin']),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  securityQuestion: z.string().optional(),
  securityAnswer: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  username: z.string().min(3),
  securityAnswer: z.string().min(1),
  newPassword: z.string().min(8),
});

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);
      
      return new ApiResponse(res, 201, {
        user: result.user,
        token: result.token,
      }).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new ApiResponse(res, 400, {
          message: 'Validation error',
          errors: error.errors,
        }).send();
      }
      
      return new ApiResponse(res, 400, {
        message: error instanceof Error ? error.message : 'Registration failed',
      }).send();
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(username, password);
      
      return new ApiResponse(res, 200, {
        user: result.user,
        token: result.token,
      }).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new ApiResponse(res, 400, {
          message: 'Validation error',
          errors: error.errors,
        }).send();
      }
      
      return new ApiResponse(res, 401, {
        message: error instanceof Error ? error.message : 'Login failed',
      }).send();
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { username, securityAnswer, newPassword } = forgotPasswordSchema.parse(req.body);
      await AuthService.resetPassword(username, securityAnswer, newPassword);
      
      return new ApiResponse(res, 200, {
        message: 'Password reset successfully',
      }).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new ApiResponse(res, 400, {
          message: 'Validation error',
          errors: error.errors,
        }).send();
      }
      
      return new ApiResponse(res, 400, {
        message: error instanceof Error ? error.message : 'Password reset failed',
      }).send();
    }
  }

  static async checkUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const isAvailable = await AuthService.isUsernameAvailable(username);
      
      return new ApiResponse(res, 200, {
        available: isAvailable,
      }).send();
    } catch (error) {
      return new ApiResponse(res, 500, {
        message: 'Failed to check username availability',
      }).send();
    }
  }

  static async getUserSecurityQuestion(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const result = await AuthService.getUserSecurityQuestion(username);
      
      return new ApiResponse(res, 200, result).send();
    } catch (error) {
      return new ApiResponse(res, 404, {
        message: error instanceof Error ? error.message : 'Security question not found',
      }).send();
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      // @ts-ignore - auth middleware adds user to request
      const userId = req.user.userId;
      const user = await AuthService.getCurrentUser(userId);
      
      return new ApiResponse(res, 200, { user }).send();
    } catch (error) {
      return new ApiResponse(res, 401, {
        message: 'Not authenticated',
      }).send();
    }
  }
}
