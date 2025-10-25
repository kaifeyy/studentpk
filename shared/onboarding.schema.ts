import { pgTable, text, varchar, timestamp, jsonb, boolean, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './schema';

export const educationBoards = pgTable('education_boards', {
  id: varchar('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { 
    enum: ['matric', 'o_level', 'both'],
    length: 10 
  }).notNull(),
  region: varchar('region', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const subjects = pgTable('subjects', {
  id: varchar('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  boardId: varchar('board_id').references(() => educationBoards.id, { onDelete: 'cascade' }),
  educationType: varchar('education_type', { 
    enum: ['matric', 'o_level'],
    length: 10 
  }).notNull(),
  isCompulsory: boolean('is_compulsory').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const studentProfiles = pgTable('student_profiles', {
  id: varchar('id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  dateOfBirth: timestamp('date_of_birth'),
  classGrade: varchar('class_grade', { length: 20 }).notNull(),
  educationType: varchar('education_type', { 
    enum: ['matric', 'o_level'],
    length: 10 
  }).notNull(),
  boardId: varchar('board_id').references(() => educationBoards.id, { onDelete: 'set null' }),
  schoolId: varchar('school_id').references(() => schools.id, { onDelete: 'set null' }),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const studentSubjects = pgTable('student_subjects', 
  {
    studentId: varchar('student_id').notNull()
      .references(() => studentProfiles.id, { onDelete: 'cascade' }),
    subjectId: varchar('subject_id').notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    isElective: boolean('is_elective').default(false),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.studentId, table.subjectId] }),
  })
);

export const schools = pgTable('schools', {
  id: varchar('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  registrationNumber: varchar('registration_number', { length: 50 }).unique(),
  establishedYear: integer('established_year'),
  principalName: varchar('principal_name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull(),
  contactNumber: varchar('contact_number', { length: 20 }).notNull(),
  address: text().notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  website: varchar('website', { length: 255 }),
  educationLevel: varchar('education_level', { 
    enum: ['matric', 'o_level', 'both'] 
  }).notNull().default('both'),
  genderType: varchar('gender_type', { 
    enum: ['boys', 'girls', 'co_education'] 
  }).notNull().default('co_education'),
  registrationProof: text('registration_proof'),
  logo: text('logo'),
  isVerified: boolean('is_verified').default(false),
  adminId: varchar('admin_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relationships
export const studentProfileRelations = relations(studentProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [studentProfiles.id],
    references: [users.id],
  }),
  school: one(schools, {
    fields: [studentProfiles.schoolId],
    references: [schools.id],
  }),
  board: one(educationBoards, {
    fields: [studentProfiles.boardId],
    references: [educationBoards.id],
  }),
  subjects: many(studentSubjects),
}));

export const schoolRelations = relations(schools, ({ one }) => ({
  admin: one(users, {
    fields: [schools.adminId],
    references: [users.id],
  }),
}));

export const educationBoardRelations = relations(educationBoards, ({ many }) => ({
  subjects: many(subjects),
}));

export const subjectRelations = relations(subjects, ({ one }) => ({
  board: one(educationBoards, {
    fields: [subjects.boardId],
    references: [educationBoards.id],
  }),
}));

export const studentSubjectRelations = relations(studentSubjects, ({ one }) => ({
  student: one(studentProfiles, {
    fields: [studentSubjects.studentId],
    references: [studentProfiles.id],
  }),
  subject: one(subjects, {
    fields: [studentSubjects.subjectId],
    references: [subjects.id],
  }),
}));

// Types
export type EducationBoard = typeof educationBoards.$inferSelect;
export type NewEducationBoard = typeof educationBoards.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;

export type School = typeof schools.$inferSelect;
export type NewSchool = typeof schools.$inferInsert;

export type StudentSubject = typeof studentSubjects.$inferSelect;
export type NewStudentSubject = typeof studentSubjects.$inferInsert;
