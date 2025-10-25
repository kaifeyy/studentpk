import { UserModel } from '../models/user.model';
import { config } from '../config/env';

export class AuthService {
  static async register(userData: {
    username: string;
    email?: string;
    password: string;
    role: 'student' | 'admin';
    firstName?: string;
    lastName?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) {
    // Check if username already exists
    const existingUser = await UserModel.findUserByUsername(userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Check if email already exists (if provided)
    if (userData.email) {
      const existingEmailUser = await UserModel.findUserByEmail(userData.email);
      if (existingEmailUser) {
        throw new Error('Email already exists');
      }
    }

    // Create new user
    const user = await UserModel.createUser(userData);
    
    // Generate JWT token
    const token = UserModel.generateToken(user.id, user.role);
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isOnboardingComplete: user.isOnboardingComplete,
      },
      token,
    };
  }

  static async login(username: string, password: string) {
    // Find user by username
    const user = await UserModel.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Check password
    const isPasswordValid = await UserModel.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = UserModel.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isOnboardingComplete: user.isOnboardingComplete,
        city: user.city,
        profileImageUrl: user.profileImageUrl,
      },
      token,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await UserModel.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      isOnboardingComplete: user.isOnboardingComplete,
      city: user.city,
      profileImageUrl: user.profileImageUrl,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      schoolId: user.schoolId,
      classGrade: user.classGrade,
      board: user.board,
      bio: user.bio,
      interests: user.interests,
      isPublic: user.isPublic,
      language: user.language,
    };
  }

  static async resetPassword(username: string, securityAnswer: string, newPassword: string) {
    // Find user by username
    const user = await UserModel.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has security question set
    if (!user.securityQuestion || !user.securityAnswer) {
      throw new Error('No security question set for this account');
    }

    // Validate security answer
    const isValidAnswer = await UserModel.validateSecurityAnswer(user.id, securityAnswer);
    if (!isValidAnswer) {
      throw new Error('Incorrect security answer');
    }

    // Reset password
    await UserModel.resetPassword(user.id, newPassword);
  }

  static async isUsernameAvailable(username: string) {
    return await UserModel.isUsernameAvailable(username);
  }

  static async getUserSecurityQuestion(username: string) {
    const user = await UserModel.findUserByUsername(username);
    if (!user || !user.securityQuestion) {
      throw new Error('No security question found for this user');
    }

    return {
      securityQuestion: user.securityQuestion,
    };
  }
}
