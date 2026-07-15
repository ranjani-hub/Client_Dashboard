import { Router, type IRouter } from "express";
import { db, resourcesTable, savedResourcesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  GetResourcesQueryParams,
  GetResourcesResponse,
  ToggleSaveResourceParams,
  ToggleSaveResourceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const CLIENT_ID = 1;

async function getResourcesWithSaved(category?: string) {
  let rows;
  if (category) {
    rows = await db.select().from(resourcesTable).where(eq(resourcesTable.category, category));
  } else {
    rows = await db.select().from(resourcesTable);
  }

  const savedRows = await db
    .select()
    .from(savedResourcesTable)
    .where(eq(savedResourcesTable.clientId, CLIENT_ID));
  const savedIds = new Set(savedRows.map((r) => r.resourceId));

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    category: r.category,
    description: r.description,
    thumbnailUrl: r.thumbnailUrl,
    readingMinutes: r.readingMinutes,
    author: r.author,
    isSaved: savedIds.has(r.id),
    isSharedByTherapist: r.isSharedByTherapist,
    downloadUrl: r.downloadUrl,
  }));
}

router.get("/resources", async (req, res): Promise<void> => {
  const parsed = GetResourcesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const resources = await getResourcesWithSaved(parsed.data.category);
  res.json(GetResourcesResponse.parse(resources));
});

router.patch("/resources/:id/save", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = ToggleSaveResourceParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [resource] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, parsed.data.id));
  if (!resource) {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(savedResourcesTable)
    .where(and(eq(savedResourcesTable.clientId, CLIENT_ID), eq(savedResourcesTable.resourceId, parsed.data.id)));

  if (existing) {
    await db
      .delete(savedResourcesTable)
      .where(and(eq(savedResourcesTable.clientId, CLIENT_ID), eq(savedResourcesTable.resourceId, parsed.data.id)));
  } else {
    await db.insert(savedResourcesTable).values({ clientId: CLIENT_ID, resourceId: parsed.data.id });
  }

  const isSaved = !existing;
  res.json(ToggleSaveResourceResponse.parse({
    id: resource.id,
    title: resource.title,
    category: resource.category,
    description: resource.description,
    thumbnailUrl: resource.thumbnailUrl,
    readingMinutes: resource.readingMinutes,
    author: resource.author,
    isSaved,
    isSharedByTherapist: resource.isSharedByTherapist,
    downloadUrl: resource.downloadUrl,
  }));
});

export default router;
