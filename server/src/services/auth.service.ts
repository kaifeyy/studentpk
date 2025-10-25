import { UserModel } from '../models/user.model';
import { config } from '../config/env';

export class AuthService {
  static async register(userData: {
    username: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
  }) {
    // Check if user already exists
    const existingUser = await UserModel.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
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
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    // Find user by email
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await UserModel.validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = UserModel.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
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
    };
  }
}
