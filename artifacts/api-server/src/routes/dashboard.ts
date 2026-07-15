import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  sessionsTable,
  activitiesTable,
  resourcesTable,
  messagesTable,
  savedResourcesTable,
} from "@workspace/db";
import { desc, eq, and, gte } from "drizzle-orm";
import { GetDashboardResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const CLIENT_ID = 1;

router.get("/dashboard", async (req, res): Promise<void> => {
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, CLIENT_ID));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = await db
    .select()
    .from(sessionsTable)
    .where(and(eq(sessionsTable.clientId, CLIENT_ID), eq(sessionsTable.status, "upcoming")))
    .orderBy(sessionsTable.scheduledAt)
    .limit(1);

  const todayTasks = await db
    .select()
    .from(activitiesTable)
    .where(and(eq(activitiesTable.clientId, CLIENT_ID), eq(activitiesTable.status, "pending")))
    .limit(5);

  const recentMessage = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.clientId, CLIENT_ID))
    .orderBy(desc(messagesTable.sentAt))
    .limit(1);

  const completedCount = await db
    .select()
    .from(activitiesTable)
    .where(and(eq(activitiesTable.clientId, CLIENT_ID), eq(activitiesTable.status, "completed")));

  const allResources = await db.select().from(resourcesTable).limit(4);
  const savedRows = await db.select().from(savedResourcesTable).where(eq(savedResourcesTable.clientId, CLIENT_ID));
  const savedIds = new Set(savedRows.map((r) => r.resourceId));
  const resources = allResources.map((r) => ({ ...r, isSaved: savedIds.has(r.id), specializations: undefined, languages: undefined }));

  const upcomingSession = upcomingSessions[0] || null;

  const response = GetDashboardResponse.parse({
    clientName: client?.name ?? "Client",
    activitiesCompleted: completedCount.length,
    currentStreak: 7,
    goalsAchieved: 3,
    upcomingSession: upcomingSession
      ? {
          id: upcomingSession.id,
          status: upcomingSession.status,
          scheduledAt: upcomingSession.scheduledAt.toISOString(),
          durationMinutes: upcomingSession.durationMinutes,
          therapistName: upcomingSession.therapistName,
          therapistAvatarUrl: upcomingSession.therapistAvatarUrl,
          joinUrl: upcomingSession.joinUrl,
          notes: null,
        }
      : null,
    todayTasks: todayTasks.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category,
      description: a.description,
      dueDate: a.dueDate,
      estimatedMinutes: a.estimatedMinutes,
      completionPercent: a.completionPercent,
      difficulty: a.difficulty,
      status: a.status,
      reflection: a.reflection,
      completedAt: a.completedAt?.toISOString() ?? null,
    })),
    recentMessage: recentMessage[0]
      ? {
          id: recentMessage[0].id,
          type: recentMessage[0].type,
          senderId: recentMessage[0].senderId,
          senderName: recentMessage[0].senderName,
          senderAvatarUrl: recentMessage[0].senderAvatarUrl,
          content: recentMessage[0].content,
          sentAt: recentMessage[0].sentAt.toISOString(),
          isRead: recentMessage[0].isRead,
        }
      : null,
    sharedResources: resources.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      description: r.description,
      thumbnailUrl: r.thumbnailUrl,
      readingMinutes: r.readingMinutes,
      author: r.author,
      isSaved: r.isSaved,
      isSharedByTherapist: r.isSharedByTherapist,
      downloadUrl: r.downloadUrl,
    })),
  });

  res.json(response);
});

export default router;
