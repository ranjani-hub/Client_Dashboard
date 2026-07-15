import { pgTable, serial, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // PHQ-9 | GAD-7 | PANAS | PCL-5 | AUDIT
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending | completed
  dueDate: text("due_date"),
  completedAt: timestamp("completed_at"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  score: integer("score"),
  scoreHistory: jsonb("score_history").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({ id: true, createdAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;
