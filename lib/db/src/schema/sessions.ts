import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sessionsTable = pgTable("sessions", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  therapistId: integer("therapist_id").notNull(),
  therapistName: text("therapist_name").notNull(),
  therapistAvatarUrl: text("therapist_avatar_url"),
  status: text("status").notNull().default("upcoming"), // upcoming | past | cancelled
  scheduledAt: timestamp("scheduled_at").notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(50),
  joinUrl: text("join_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSessionSchema = createInsertSchema(sessionsTable).omit({ id: true, createdAt: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionsTable.$inferSelect;
