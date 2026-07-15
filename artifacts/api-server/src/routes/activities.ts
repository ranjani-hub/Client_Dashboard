import { Router, type IRouter } from "express";
import { db, activitiesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  GetActivitiesResponse,
  CompleteActivityParams,
  CompleteActivityBody,
  CompleteActivityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const CLIENT_ID = 1;

function serializeActivity(a: typeof activitiesTable.$inferSelect) {
  return {
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
  };
}

router.get("/activities", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(activitiesTable)
    .where(eq(activitiesTable.clientId, CLIENT_ID))
    .orderBy(activitiesTable.dueDate);

  res.json(GetActivitiesResponse.parse(rows.map(serializeActivity)));
});

router.patch("/activities/:id/complete", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsedParams = CompleteActivityParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }

  const parsedBody = CompleteActivityBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }

  const [updated] = await db
    .update(activitiesTable)
    .set({
      status: "completed",
      completionPercent: 100,
      reflection: parsedBody.data.reflection,
      completedAt: new Date(),
    })
    .where(and(eq(activitiesTable.id, parsedParams.data.id), eq(activitiesTable.clientId, CLIENT_ID)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }

  res.json(CompleteActivityResponse.parse(serializeActivity(updated)));
});

export default router;
