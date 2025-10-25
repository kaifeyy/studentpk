// Student Pakistan - Complete Database Schema
// Reference: Replit Auth Blueprint & Database Blueprint

import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// AUTH TABLES (Required for Replit Auth)
// ============================================================================

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// ============================================================================
// USER & SCHOOL TABLES
// ============================================================================

// Users table - Extended for Student Pakistan
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Auth fields (from Replit Auth)
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Student Pakistan specific fields
  role: varchar("role", { length: 20 }).notNull().default("student"), // 'student' or 'admin'
  schoolId: varchar("school_id"),
  city: varchar("city"),
  classGrade: varchar("class_grade"), // e.g., "Grade 9", "O Levels Year 1"
  board: varchar("board"), // e.g., "Matric", "O Levels", "A Levels"
  bio: text("bio"),
  interests: text("interests").array(),
  isPublic: boolean("is_public").notNull().default(true),
  language: varchar("language", { length: 10 }).notNull().default("en"), // 'en' or 'ur'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  city: varchar("city"),
  logoUrl: varchar("logo_url"),
  contactNumber: varchar("contact_number"),
  registrationNumber: varchar("registration_number"),
  schoolCode: varchar("school_code", { length: 6 }).notNull().unique(), // 6-character join code
  adminId: varchar("admin_id").notNull(), // School admin user ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classes table
export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  grade: varchar("grade").notNull(), // e.g., "Grade 9", "O Levels Year 1"
  section: varchar("section"), // e.g., "A", "B"
  createdAt: timestamp("created_at").defaultNow(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  schoolId: varchar("school_id"),
  classId: varchar("class_id"),
  teacher: varchar("teacher"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// SOCIAL & FEED TABLES
// ============================================================================

// Posts table (for feed)
export const posts = pgTable("posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  mediaUrls: text("media_urls").array(), // Images, PDFs, videos
  type: varchar("type", { length: 50 }).notNull().default("post"), // 'post', 'announcement', 'study_tip'
  visibility: varchar("visibility", { length: 20 }).notNull().default("public"), // 'public', 'school', 'private'
  schoolId: varchar("school_id"), // If school-only post
  hashtags: text("hashtags").array(),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  parentId: varchar("parent_id"), // For threaded replies
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes table
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  postId: varchar("post_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Follows table
export const follows = pgTable("follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull(),
  followingId: varchar("following_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// ANNOUNCEMENTS & NOTES TABLES
// ============================================================================

// Announcements table
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  userId: varchar("user_id").notNull(), // Admin who created it
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  mediaUrl: varchar("media_url"), // PDF, image
  targetClass: varchar("target_class"), // e.g., "Grade 9 Science"
  isPinned: boolean("is_pinned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notes table (educational resources)
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  schoolId: varchar("school_id"), // Optional - for verified school notes
  title: varchar("title", { length: 255 }).notNull(),
  subject: varchar("subject").notNull(),
  grade: varchar("grade"),
  board: varchar("board"),
  fileUrl: varchar("file_url").notNull(),
  fileType: varchar("file_type").notNull(), // 'pdf', 'docx', 'image', 'ppt'
  description: text("description"),
  isVerified: boolean("is_verified").notNull().default(false), // School-provided
  viewCount: integer("view_count").notNull().default(0),
  likesCount: integer("likes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// TIMETABLE TABLES
// ============================================================================

// Timetables table
export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  schoolId: varchar("school_id").notNull(),
  classId: varchar("class_id").notNull(),
  name: varchar("name").notNull(), // e.g., "Grade 9A - Spring 2024"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timetable entries (periods)
export const timetableEntries = pgTable("timetable_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timetableId: varchar("timetable_id").notNull(),
  day: varchar("day").notNull(), // 'Monday', 'Tuesday', etc.
  period: integer("period").notNull(), // Period number
  subject: varchar("subject").notNull(),
  teacher: varchar("teacher"),
  classroom: varchar("classroom"),
  startTime: varchar("start_time").notNull(), // e.g., "09:00"
  endTime: varchar("end_time").notNull(), // e.g., "09:45"
  meetingLink: varchar("meeting_link"), // Zoom/Meet link
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'announcement', 'like', 'comment', 'follow', 'mention'
  title: varchar("title").notNull(),
  content: text("content"),
  relatedId: varchar("related_id"), // ID of related post/announcement/etc
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  followersRelation: many(follows, { relationName: "followers" }),
  followingRelation: many(follows, { relationName: "following" }),
  notifications: many(notifications),
}));

export const schoolsRelations = relations(schools, ({ many }) => ({
  students: many(users),
  classes: many(classes),
  posts: many(posts),
  announcements: many(announcements),
  notes: many(notes),
  timetables: many(timetables),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [posts.schoolId],
    references: [schools.id],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const timetablesRelations = relations(timetables, ({ one, many }) => ({
  school: one(schools, {
    fields: [timetables.schoolId],
    references: [schools.id],
  }),
  class: one(classes, {
    fields: [timetables.classId],
    references: [classes.id],
  }),
  entries: many(timetableEntries),
}));

// ============================================================================
// ZOD SCHEMAS & TYPES
// ============================================================================

// User types
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const updateUserProfileSchema = createInsertSchema(users).pick({
  role: true,
  schoolId: true,
  city: true,
  classGrade: true,
  board: true,
  bio: true,
  interests: true,
  isPublic: true,
  language: true,
});

// School types
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  schoolCode: true,
  createdAt: true,
  updatedAt: true,
});

// Post types
export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  userId: true,
  likesCount: true,
  commentsCount: true,
  createdAt: true,
  updatedAt: true,
});

// Comment types
export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Announcement types
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Note types
export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  userId: true,
  viewCount: true,
  likesCount: true,
  createdAt: true,
});

// Timetable entry types
export const insertTimetableEntrySchema = createInsertSchema(timetableEntries).omit({
  id: true,
  createdAt: true,
});

// TypeScript types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;

export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type School = typeof schools.$inferSelect;

export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof posts.$inferSelect;

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export type InsertTimetableEntry = z.infer<typeof insertTimetableEntrySchema>;
export type TimetableEntry = typeof timetableEntries.$inferSelect;
export type Timetable = typeof timetables.$inferSelect;

export type Notification = typeof notifications.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
