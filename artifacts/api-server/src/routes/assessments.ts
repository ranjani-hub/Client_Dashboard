import { Router, type IRouter } from "express";
import { db, assessmentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  GetAssessmentsResponse,
  SubmitAssessmentParams,
  SubmitAssessmentBody,
  SubmitAssessmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const CLIENT_ID = 1;

function serializeAssessment(a: typeof assessmentsTable.$inferSelect) {
  return {
    id: a.id,
    name: a.name,
    type: a.type,
    description: a.description,
    status: a.status,
    dueDate: a.dueDate,
    completedAt: a.completedAt?.toISOString() ?? null,
    estimatedMinutes: a.estimatedMinutes,
    score: a.score,
    scoreHistory: Array.isArray(a.scoreHistory) ? a.scoreHistory : [],
  };
}

router.get("/assessments", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(assessmentsTable)
    .where(eq(assessmentsTable.clientId, CLIENT_ID));

  res.json(GetAssessmentsResponse.parse(rows.map(serializeAssessment)));
});

router.post("/assessments/:id/submit", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsedParams = SubmitAssessmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsedParams.success) {
    res.status(400).json({ error: parsedParams.error.message });
    return;
  }

  const parsedBody = SubmitAssessmentBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(assessmentsTable)
    .where(and(eq(assessmentsTable.id, parsedParams.data.id), eq(assessmentsTable.clientId, CLIENT_ID)));

  if (!existing) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const prevHistory = Array.isArray(existing.scoreHistory) ? existing.scoreHistory as { date: string; score: number }[] : [];
  const newHistory = [...prevHistory, { date: today, score: parsedBody.data.score }];

  const [updated] = await db
    .update(assessmentsTable)
    .set({
      status: "completed",
      score: parsedBody.data.score,
      completedAt: new Date(),
      scoreHistory: newHistory,
    })
    .where(eq(assessmentsTable.id, parsedParams.data.id))
    .returning();

  res.json(SubmitAssessmentResponse.parse(serializeAssessment(updated)));
});

export default router;
