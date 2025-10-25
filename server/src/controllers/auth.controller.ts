import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'admin']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
      const { email, password } = loginSchema.parse(req.body);
      const result = await AuthService.login(email, password);
      
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
