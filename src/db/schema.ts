import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export interface ProfilePrinciple {
  index: string;
  title: string;
  body: string;
}

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  uid: text('uid').unique(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull().default('Ateeq Ur Rehman'),
  passwordHash: text('password_hash'),
  role: text('role').notNull().default('admin'),
  isActive: boolean('is_active').notNull().default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const adminSessions = pgTable('admin_sessions', {
  id: serial('id').primaryKey(),
  tokenHash: text('token_hash').notNull().unique(),
  adminUserId: integer('admin_user_id')
    .notNull()
    .references(() => adminUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  initials: text('initials').notNull().default('AR'),
  tagline: text('tagline').notNull(),
  rotatingRoles: jsonb('rotating_roles').$type<string[]>().notNull(),
  location: text('location').notNull(),
  coordinates: text('coordinates').notNull(),
  email: text('email').notNull(),
  avatarUrl: text('avatar_url').notNull(),
  degree: text('degree').notNull(),
  semester: text('semester').notNull(),
  educationPeriod: text('education_period').notNull(),
  department: text('department').notNull(),
  university: text('university').notNull(),
  educationFocus: text('education_focus').notNull(),
  previousNote: text('previous_note').notNull(),
  philosophyQuote: text('philosophy_quote').notNull(),
  aboutStory: jsonb('about_story').$type<string[]>().notNull(),
  principles: jsonb('principles').$type<ProfilePrinciple[]>().notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  indexLabel: text('index_label').notNull(),
  title: text('title').notNull(),
  shortTitle: text('short_title').notNull(),
  category: text('category').notNull(),
  status: text('status').notNull(),
  mathSymbol: text('math_symbol').notNull().default('∑'),
  motif: text('motif').notNull().default('group-symmetry'),
  tagline: text('tagline').notNull(),
  summary: text('summary').notNull(),
  problem: text('problem').notNull(),
  approach: text('approach').notNull(),
  mathematicalConnection: text('mathematical_connection').notNull(),
  notes: text('notes').notNull(),
  techStack: jsonb('tech_stack').$type<string[]>().notNull(),
  features: jsonb('features').$type<string[]>().notNull(),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  featured: boolean('featured').notNull().default(false),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  indexLabel: text('index_label').notNull(),
  symbol: text('symbol').notNull().default('∑'),
  domain: text('domain').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  topics: jsonb('topics').$type<string[]>().notNull(),
  contextLabel: text('context_label').notNull(),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  degree: text('degree').notNull(),
  institution: text('institution').notNull(),
  department: text('department').notNull().default(''),
  location: text('location').notNull().default(''),
  period: text('period').notNull(),
  semesterOrGrade: text('semester_or_grade').notNull().default(''),
  description: text('description').notNull(),
  isPlaceholder: boolean('is_placeholder').notNull().default(false),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  indexLabel: text('index_label').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  organization: text('organization').notNull(),
  period: text('period').notNull(),
  location: text('location').notNull(),
  summary: text('summary').notNull(),
  highlights: jsonb('highlights').$type<string[]>().notNull(),
  takeaway: text('takeaway').notNull(),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teachings = pgTable('teachings', {
  id: serial('id').primaryKey(),
  indexLabel: text('index_label').notNull(),
  level: text('level').notNull(),
  title: text('title').notNull(),
  focus: text('focus').notNull(),
  topics: jsonb('topics').$type<string[]>().notNull(),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  awardDate: text('award_date').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  certificatePdfUrl: text('certificate_pdf_url'),
  verificationUrl: text('verification_url'),
  published: boolean('published').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  pdfUrl: text('pdf_url'),
  verificationUrl: text('verification_url'),
  published: boolean('published').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  caption: text('caption').notNull().default(''),
  category: text('category').notNull().default('General'),
  imageUrl: text('image_url').notNull(),
  storedFilename: text('stored_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(),
  isProfilePhoto: boolean('is_profile_photo').notNull().default(false),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cvDocuments = pgTable('cv_documents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  originalFilename: text('original_filename').notNull(),
  storedFilename: text('stored_filename').notNull(),
  fileUrl: text('file_url').notNull(),
  mimeType: text('mime_type').notNull().default('application/pdf'),
  fileSize: integer('file_size').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  uploadedByEmail: text('uploaded_by_email').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platformKey: text('platform_key').notNull().unique(),
  label: text('label').notNull(),
  handle: text('handle').notNull(),
  href: text('href').notNull(),
  description: text('description').notNull().default(''),
  external: boolean('external').notNull().default(true),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  emailDelivered: boolean('email_delivered').notNull().default(false),
  deliveryNote: text('delivery_note').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const aiKnowledge = pgTable('ai_knowledge', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull().default('Portfolio'),
  content: text('content').notNull(),
  keywords: jsonb('keywords').$type<string[]>().notNull(),
  published: boolean('published').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteTitle: text('site_title').notNull(),
  siteTagline: text('site_tagline').notNull(),
  muavinEnabled: boolean('muavin_enabled').notNull().default(true),
  muavinWelcomeMessage: text('muavin_welcome_message').notNull(),
  muavinSystemTone: text('muavin_system_tone').notNull(),
  teachingHeadline: text('teaching_headline').notNull(),
  teachingSummary: text('teaching_summary').notNull(),
  teachingAudience: text('teaching_audience').notNull(),
  teachingExperienceLabel: text('teaching_experience_label').notNull(),
  teachingMode: text('teaching_mode').notNull(),
  teachingLocation: text('teaching_location').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
