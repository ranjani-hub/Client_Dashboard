import { pgTable, serial, integer, text, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(), // breathing | journaling | mindfulness | sleep | gratitude | cbt | reading
  description: text("description"),
  dueDate: date("due_date").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  completionPercent: integer("completion_percent").notNull().default(0),
  difficulty: text("difficulty").notNull().default("medium"), // easy | medium | hard
  status: text("status").notNull().default("pending"), // pending | in_progress | completed
  reflection: text("reflection"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activitiesTable).omit({ id: true, createdAt: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activitiesTable.$inferSelect;
