import { pgTable, serial, text, integer, timestamp, boolean, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  age: integer("age"),
  gender: text("gender"),
  preferredLanguage: text("preferred_language"),
  avatarUrl: text("avatar_url"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClientSchema = createInsertSchema(clientsTable).omit({ id: true, createdAt: true });
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clientsTable.$inferSelect;

export const therapistsTable = pgTable("therapists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  avatarUrl: text("avatar_url"),
  yearsOfExperience: integer("years_of_experience").notNull().default(0),
  specializations: text("specializations").array(),
  languages: text("languages").array(),
  bio: text("bio"),
  isVerified: boolean("is_verified").notNull().default(false),
  rating: real("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTherapistSchema = createInsertSchema(therapistsTable).omit({ id: true, createdAt: true });
export type InsertTherapist = z.infer<typeof insertTherapistSchema>;
export type Therapist = typeof therapistsTable.$inferSelect;
