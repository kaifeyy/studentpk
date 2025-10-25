import { db } from '../config/db';
import { eq, and, or, ilike } from 'drizzle-orm';
import { 
  studentProfiles, 
  schools, 
  educationBoards, 
  subjects, 
  studentSubjects,
} from '../../../shared/onboarding.schema';
import { users } from '../../../shared/schema';
import { ApiError } from '../utils/apiResponse';

export class OnboardingService {
  // Get all education boards
  static async getEducationBoards(educationType?: 'matric' | 'o_level') {
    const query = db.select().from(educationBoards);
    
    if (educationType) {
      query.where(
        or(
          eq(educationBoards.type, educationType),
          eq(educationBoards.type, 'both')
        )
      );
    }
    
    return await query;
  }

  // Get subjects by board and education type
  static async getSubjects(boardId: string, educationType: 'matric' | 'o_level') {
    return await db
      .select()
      .from(subjects)
      .where(
        and(
          eq(subjects.boardId, boardId),
          eq(subjects.educationType, educationType)
        )
      );
  }

  // Create student profile
  static async createStudentProfile(
    userId: string, 
    data: {
      dateOfBirth: Date;
      classGrade: string;
      educationType: 'matric' | 'o_level';
      boardId: string;
      schoolId?: string | null;
      bio?: string;
      subjectIds: string[];
    }
  ) {
    return await db.transaction(async (tx) => {
      // Create student profile
      const [profile] = await tx
        .insert(studentProfiles)
        .values({
          id: userId,
          dateOfBirth: data.dateOfBirth,
          classGrade: data.classGrade,
          educationType: data.educationType,
          boardId: data.boardId,
          schoolId: data.schoolId,
          bio: data.bio,
        })
        .returning();

      // Add selected subjects
      if (data.subjectIds.length > 0) {
        await tx.insert(studentSubjects).values(
          data.subjectIds.map(subjectId => ({
            studentId: userId,
            subjectId,
          }))
        );
      }

      // Update user role to student if not already set
      await tx
        .update(users)
        .set({ role: 'student' })
        .where(eq(users.id, userId));

      return profile;
    });
  }

  // Create school and set user as admin
  static async createSchool(
    adminId: string, 
    data: {
      name: string;
      registrationNumber: string;
      establishedYear: number;
      principalName: string;
      email: string;
      contactNumber: string;
      address: string;
      city: string;
      website?: string;
      educationLevel: 'matric' | 'o_level' | 'both';
      genderType: 'boys' | 'girls' | 'co_education';
      registrationProof: string;
      logo?: string;
    }
  ) {
    return await db.transaction(async (tx) => {
      // Create school
      const [school] = await tx
        .insert(schools)
        .values({
          ...data,
          adminId,
        })
        .returning();

      // Update user role to admin
      await tx
        .update(users)
        .set({ 
          role: 'admin',
          schoolId: school.id 
        })
        .where(eq(users.id, adminId));

      return school;
    });
  }

  // Search schools by name or location
  static async searchSchools(query: string, city?: string) {
    let q = db
      .select()
      .from(schools)
      .where(ilike(schools.name as any, `%${query}%`));

    if (city) {
      q = q.where(ilike(schools.city as any, `%${city}%`));
    }

    return await q.limit(10);
  }

  // Check if username is available
  static async isUsernameAvailable(username: string): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    return !user;
  }

  // Update user profile
  static async updateUserProfile(
    userId: string, 
    data: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      city?: string;
      dateOfBirth?: Date;
      isOnboardingComplete?: boolean;
    }
  ) {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }
}
