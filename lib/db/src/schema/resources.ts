import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // article | video | worksheet | meditation | pdf
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  readingMinutes: integer("reading_minutes"),
  author: text("author"),
  isSharedByTherapist: boolean("is_shared_by_therapist").notNull().default(false),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedResourcesTable = pgTable("saved_resources", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").notNull(),
  resourceId: integer("resource_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResourceSchema = createInsertSchema(resourcesTable).omit({ id: true, createdAt: true });
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resourcesTable.$inferSelect;
