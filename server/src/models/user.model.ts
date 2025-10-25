import { db } from '../config/db';
import { users } from '../../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from '../config/env';

export class UserModel {
  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: 'student' | 'admin';
  }) {
    const hashedPassword = await hash(userData.password, 12);
    
    const [user] = await db.insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
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
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
  }

  static async updateUser(userId: string, updateData: Record<string, any>) {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    
    return user;
  }
}
