// Reference: Replit Auth Blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertPostSchema,
  insertCommentSchema,
  insertAnnouncementSchema,
  insertNoteSchema,
  insertTimetableEntrySchema,
  updateUserProfileSchema,
} from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // ============================================================================
  // AUTH MIDDLEWARE & ROUTES (From Replit Auth Blueprint)
  // ============================================================================
  
  await setupAuth(app);

  // Get authenticated user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================================================
  // USER PROFILE ROUTES
  // ============================================================================
  
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = updateUserProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // ============================================================================
  // POST ROUTES
  // ============================================================================
  
  // Get posts with filters
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const filter = req.query.filter as "school" | "public" | "trending" | undefined;
      const user = await storage.getUser(req.user.claims.sub);
      const posts = await storage.getPosts(filter, user?.schoolId || undefined);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Create post
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = insertPostSchema.parse(req.body);
      const post = await storage.createPost({ ...postData, userId });
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  // Like post
  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = req.params.id;
      await storage.likePost(userId, postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(400).json({ message: "Failed to like post" });
    }
  });

  // Unlike post
  app.delete('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = req.params.id;
      await storage.unlikePost(userId, postId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(400).json({ message: "Failed to unlike post" });
    }
  });

  // Delete post
  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deletePost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(400).json({ message: "Failed to delete post" });
    }
  });

  // ============================================================================
  // COMMENT ROUTES
  // ============================================================================
  
  // Get comments for a post
  app.get('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const comments = await storage.getComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Create comment
  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment({
        ...commentData,
        userId,
        postId: req.params.id,
      });
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: "Failed to create comment" });
    }
  });

  // ============================================================================
  // ANNOUNCEMENT ROUTES
  // ============================================================================
  
  // Get announcements for a school
  app.get('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.schoolId) {
        return res.json([]);
      }
      const announcements = await storage.getAnnouncements(user.schoolId);
      res.json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  // Create announcement (admin only)
  app.post('/api/announcements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create announcements" });
      }

      const announcementData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement({
        ...announcementData,
        userId,
        schoolId: user.schoolId!,
      });
      res.json(announcement);
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(400).json({ message: "Failed to create announcement" });
    }
  });

  // Update announcement
  app.patch('/api/announcements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      res.json(announcement);
    } catch (error) {
      console.error("Error updating announcement:", error);
      res.status(400).json({ message: "Failed to update announcement" });
    }
  });

  // Delete announcement
  app.delete('/api/announcements/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteAnnouncement(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting announcement:", error);
      res.status(400).json({ message: "Failed to delete announcement" });
    }
  });

  // ============================================================================
  // NOTES ROUTES
  // ============================================================================
  
  // Get notes with filters
  app.get('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const subject = req.query.subject as string | undefined;
      const search = req.query.search as string | undefined;
      const notes = await storage.getNotes(subject, search);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  // Create note
  app.post('/api/notes', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // In a real app, upload the file to storage and get URL
      const fileUrl = `/uploads/${req.file?.filename || "temp.pdf"}`;
      
      const noteData = {
        ...req.body,
        fileUrl,
        userId,
        schoolId: user?.schoolId,
        isVerified: user?.role === "admin",
      };
      
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Failed to create note" });
    }
  });

  // Increment note views
  app.post('/api/notes/:id/view', isAuthenticated, async (req: any, res) => {
    try {
      await storage.incrementNoteViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing views:", error);
      res.status(400).json({ message: "Failed to increment views" });
    }
  });

  // ============================================================================
  // TIMETABLE ROUTES
  // ============================================================================
  
  // Get timetable for user's class
  app.get('/api/timetable', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.classGrade) {
        return res.json(null);
      }
      
      // In a real app, map classGrade to classId
      const timetable = await storage.getTimetable("class-1");
      res.json(timetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      res.status(500).json({ message: "Failed to fetch timetable" });
    }
  });

  // Create timetable entry (admin only)
  app.post('/api/timetable/entries', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create timetable entries" });
      }

      const entryData = insertTimetableEntrySchema.parse(req.body);
      const entry = await storage.createTimetableEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating timetable entry:", error);
      res.status(400).json({ message: "Failed to create timetable entry" });
    }
  });

  // ============================================================================
  // SCHOOL ROUTES
  // ============================================================================
  
  // Create school (admin registration)
  app.post('/api/schools', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const school = await storage.createSchool({
        ...req.body,
        adminId: userId,
      });
      
      // Update user role to admin
      await storage.updateUserProfile(userId, {
        role: "admin",
        schoolId: school.id,
      });
      
      res.json(school);
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(400).json({ message: "Failed to create school" });
    }
  });

  // Join school by code
  app.post('/api/schools/join', isAuthenticated, async (req: any, res) => {
    try {
      const { code } = req.body;
      const school = await storage.getSchoolByCode(code);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      const userId = req.user.claims.sub;
      await storage.updateUserProfile(userId, {
        schoolId: school.id,
      });
      
      res.json(school);
    } catch (error) {
      console.error("Error joining school:", error);
      res.status(400).json({ message: "Failed to join school" });
    }
  });

  // ============================================================================
  // NOTIFICATION ROUTES
  // ============================================================================
  
  // Get notifications
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(400).json({ message: "Failed to mark notification as read" });
    }
  });

  // ============================================================================
  // FOLLOW ROUTES
  // ============================================================================
  
  // Follow user
  app.post('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.id;
      await storage.followUser(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(400).json({ message: "Failed to follow user" });
    }
  });

  // Unfollow user
  app.delete('/api/users/:id/follow', isAuthenticated, async (req: any, res) => {
    try {
      const followerId = req.user.claims.sub;
      const followingId = req.params.id;
      await storage.unfollowUser(followerId, followingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(400).json({ message: "Failed to unfollow user" });
    }
  });

  // ============================================================================
  // CREATE SERVER
  // ============================================================================
  
  const httpServer = createServer(app);
  return httpServer;
}
