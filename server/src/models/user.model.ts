import { db } from '../config/db';
import { users } from '../../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from '../config/env';

export class UserModel {
  static async createUser(userData: {
    username: string;
    email?: string;
    password: string;
    role: 'student' | 'admin';
    firstName?: string;
    lastName?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) {
    const hashedPassword = await hash(userData.password, 12);
    let hashedSecurityAnswer: string | undefined;
    
    if (userData.securityAnswer) {
      hashedSecurityAnswer = await hash(userData.securityAnswer.toLowerCase(), 12);
    }
    
    const [user] = await db.insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        securityQuestion: userData.securityQuestion,
        securityAnswer: hashedSecurityAnswer,
      })
      .returning();

    return user;
  }

  static async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return user || null;
  }

  static async findUserByUsername(username: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return user || null;
  }

  static async findUserById(id: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return user || null;
  }

  static async validatePassword(userPassword: string, hashedPassword: string) {
    return await compare(userPassword, hashedPassword);
  }

  static generateToken(userId: string, role: string) {
    return sign(
      { userId, role },
      config.JWT_SECRET as string,
      { expiresIn: config.JWT_EXPIRES_IN as string }
    );
  }

  static async updateUser(userId: string, updateData: Record<string, any>) {
    const [user] = await db
      .update(users)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  static async validateSecurityAnswer(userId: string, securityAnswer: string) {
    const user = await this.findUserById(userId);
    if (!user || !user.securityAnswer) {
      return false;
    }
    
    return await compare(securityAnswer.toLowerCase(), user.securityAnswer);
  }

  static async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, 12);
    
    const [user] = await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }

  static async isUsernameAvailable(username: string) {
    const user = await this.findUserByUsername(username);
    return !user;
  }
}
