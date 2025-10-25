// Reference: Replit Auth Blueprint & Database Blueprint
import {
  users,
  schools,
  posts,
  comments,
  likes,
  follows,
  announcements,
  notes,
  timetables,
  timetableEntries,
  classes,
  subjects,
  notifications,
  type User,
  type UpsertUser,
  type UpdateUserProfile,
  type School,
  type InsertSchool,
  type Post,
  type InsertPost,
  type Comment,
  type InsertComment,
  type Announcement,
  type InsertAnnouncement,
  type Note,
  type InsertNote,
  type Timetable,
  type TimetableEntry,
  type InsertTimetableEntry,
  type Notification,
  type Class,
  type Subject,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, or, like, sql } from "drizzle-orm";

// Generate school code
function generateSchoolCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, profile: Partial<UpdateUserProfile>): Promise<User>;
  
  // School operations
  createSchool(school: InsertSchool & { adminId: string }): Promise<School>;
  getSchool(id: string): Promise<School | undefined>;
  getSchoolByCode(code: string): Promise<School | undefined>;
  updateSchool(id: string, data: Partial<InsertSchool>): Promise<School>;
  
  // Post operations
  createPost(post: InsertPost & { userId: string }): Promise<Post>;
  getPosts(filter?: "school" | "public" | "trending", schoolId?: string): Promise<Array<Post & { author?: User }>>;
  getPost(id: string): Promise<Post | undefined>;
  updatePost(id: string, data: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  likePost(userId: string, postId: string): Promise<void>;
  unlikePost(userId: string, postId: string): Promise<void>;
  isPostLiked(userId: string, postId: string): Promise<boolean>;
  
  // Comment operations
  createComment(comment: InsertComment & { userId: string }): Promise<Comment>;
  getComments(postId: string): Promise<Array<Comment & { author?: User }>>;
  
  // Announcement operations
  createAnnouncement(announcement: InsertAnnouncement & { userId: string }): Promise<Announcement>;
  getAnnouncements(schoolId: string): Promise<Announcement[]>;
  updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement>;
  deleteAnnouncement(id: string): Promise<void>;
  
  // Note operations
  createNote(note: InsertNote & { userId: string }): Promise<Note>;
  getNotes(subject?: string, search?: string): Promise<Array<Note & { author?: User }>>;
  getNote(id: string): Promise<Note | undefined>;
  incrementNoteViews(id: string): Promise<void>;
  
  // Timetable operations
  getTimetable(classId: string): Promise<(Timetable & { entries?: TimetableEntry[] }) | undefined>;
  createTimetableEntry(entry: InsertTimetableEntry): Promise<TimetableEntry>;
  getTimetableEntries(timetableId: string): Promise<TimetableEntry[]>;
  
  // Follow operations
  followUser(followerId: string, followingId: string): Promise<void>;
  unfollowUser(followerId: string, followingId: string): Promise<void>;
  
  // Notification operations
  createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification>;
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // ========================================================================
  // USER OPERATIONS (Required for Replit Auth)
  // ========================================================================
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, profile: Partial<UpdateUserProfile>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // ========================================================================
  // SCHOOL OPERATIONS
  // ========================================================================
  
  async createSchool(schoolData: InsertSchool & { adminId: string }): Promise<School> {
    const schoolCode = generateSchoolCode();
    const [school] = await db
      .insert(schools)
      .values({ ...schoolData, schoolCode })
      .returning();
    return school;
  }

  async getSchool(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async getSchoolByCode(code: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.schoolCode, code));
    return school;
  }

  async updateSchool(id: string, data: Partial<InsertSchool>): Promise<School> {
    const [school] = await db
      .update(schools)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schools.id, id))
      .returning();
    return school;
  }

  // ========================================================================
  // POST OPERATIONS
  // ========================================================================
  
  async createPost(postData: InsertPost & { userId: string }): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }

  async getPosts(filter?: "school" | "public" | "trending", schoolId?: string): Promise<Array<Post & { author?: User }>> {
    let query = db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt))
      .limit(50);

    // Apply filters
    const result = await query;
    
    return result.map((row) => ({
      ...row.post,
      author: row.author || undefined,
    }));
  }

  async getPost(id: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async updatePost(id: string, data: Partial<InsertPost>): Promise<Post> {
    const [post] = await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async likePost(userId: string, postId: string): Promise<void> {
    await db.insert(likes).values({ userId, postId });
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async unlikePost(userId: string, postId: string): Promise<void> {
    await db.delete(likes).where(
      and(eq(likes.userId, userId), eq(likes.postId, postId))
    );
    await db
      .update(posts)
      .set({ likesCount: sql`${posts.likesCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async isPostLiked(userId: string, postId: string): Promise<boolean> {
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return !!like;
  }

  // ========================================================================
  // COMMENT OPERATIONS
  // ========================================================================
  
  async createComment(commentData: InsertComment & { userId: string }): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, commentData.postId));
    return comment;
  }

  async getComments(postId: string): Promise<Array<Comment & { author?: User }>> {
    const result = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return result.map((row) => ({
      ...row.comment,
      author: row.author || undefined,
    }));
  }

  // ========================================================================
  // ANNOUNCEMENT OPERATIONS
  // ========================================================================
  
  async createAnnouncement(announcementData: InsertAnnouncement & { userId: string }): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(announcementData)
      .returning();
    return announcement;
  }

  async getAnnouncements(schoolId: string): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(eq(announcements.schoolId, schoolId))
      .orderBy(desc(announcements.isPinned), desc(announcements.createdAt));
  }

  async updateAnnouncement(id: string, data: Partial<InsertAnnouncement>): Promise<Announcement> {
    const [announcement] = await db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    return announcement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  // ========================================================================
  // NOTE OPERATIONS
  // ========================================================================
  
  async createNote(noteData: InsertNote & { userId: string }): Promise<Note> {
    const [note] = await db.insert(notes).values(noteData).returning();
    return note;
  }

  async getNotes(subject?: string, search?: string): Promise<Array<Note & { author?: User }>> {
    let query = db
      .select({
        note: notes,
        author: users,
      })
      .from(notes)
      .leftJoin(users, eq(notes.userId, users.id))
      .orderBy(desc(notes.createdAt))
      .limit(50);

    const result = await query;
    
    return result.map((row) => ({
      ...row.note,
      author: row.author || undefined,
    }));
  }

  async getNote(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note;
  }

  async incrementNoteViews(id: string): Promise<void> {
    await db
      .update(notes)
      .set({ viewCount: sql`${notes.viewCount} + 1` })
      .where(eq(notes.id, id));
  }

  // ========================================================================
  // TIMETABLE OPERATIONS
  // ========================================================================
  
  async getTimetable(classId: string): Promise<(Timetable & { entries?: TimetableEntry[] }) | undefined> {
    const [timetable] = await db
      .select()
      .from(timetables)
      .where(eq(timetables.classId, classId));
    
    if (!timetable) return undefined;

    const entries = await this.getTimetableEntries(timetable.id);
    return { ...timetable, entries };
  }

  async createTimetableEntry(entryData: InsertTimetableEntry): Promise<TimetableEntry> {
    const [entry] = await db.insert(timetableEntries).values(entryData).returning();
    return entry;
  }

  async getTimetableEntries(timetableId: string): Promise<TimetableEntry[]> {
    return await db
      .select()
      .from(timetableEntries)
      .where(eq(timetableEntries.timetableId, timetableId))
      .orderBy(timetableEntries.day, timetableEntries.period);
  }

  // ========================================================================
  // FOLLOW OPERATIONS
  // ========================================================================
  
  async followUser(followerId: string, followingId: string): Promise<void> {
    await db.insert(follows).values({ followerId, followingId });
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.delete(follows).where(
      and(eq(follows.followerId, followerId), eq(follows.followingId, followingId))
    );
  }

  // ========================================================================
  // NOTIFICATION OPERATIONS
  // ========================================================================
  
  async createNotification(notificationData: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
