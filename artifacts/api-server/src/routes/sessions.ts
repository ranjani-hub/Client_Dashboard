import { Router, type IRouter } from "express";
import { db, sessionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  GetSessionsQueryParams,
  GetSessionsResponse,
  CancelSessionParams,
  CancelSessionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const CLIENT_ID = 1;

function serializeSession(s: typeof sessionsTable.$inferSelect) {
  return {
    id: s.id,
    status: s.status,
    scheduledAt: s.scheduledAt.toISOString(),
    durationMinutes: s.durationMinutes,
    therapistName: s.therapistName,
    therapistAvatarUrl: s.therapistAvatarUrl,
    joinUrl: s.joinUrl,
    notes: null,
  };
}

router.get("/sessions", async (req, res): Promise<void> => {
  const parsed = GetSessionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const conditions = [eq(sessionsTable.clientId, CLIENT_ID)];
  if (parsed.data.status) {
    conditions.push(eq(sessionsTable.status, parsed.data.status));
  }

  const rows = await db
    .select()
    .from(sessionsTable)
    .where(and(...conditions))
    .orderBy(sessionsTable.scheduledAt);

  res.json(GetSessionsResponse.parse(rows.map(serializeSession)));
});

router.patch("/sessions/:id/cancel", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = CancelSessionParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(sessionsTable)
    .set({ status: "cancelled" })
    .where(and(eq(sessionsTable.id, parsed.data.id), eq(sessionsTable.clientId, CLIENT_ID)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Session not found" });
    return;
  }

  res.json(CancelSessionResponse.parse(serializeSession(updated)));
});

export default router;
