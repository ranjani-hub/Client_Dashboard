import { Router, type IRouter } from "express";
import { db, clientsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetClientProfileResponse,
  UpdateClientProfileBody,
  UpdateClientProfileResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const CLIENT_ID = 1;

router.get("/client/me", async (req, res): Promise<void> => {
  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, CLIENT_ID));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(GetClientProfileResponse.parse({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
    age: client.age,
    gender: client.gender,
    preferredLanguage: client.preferredLanguage,
    avatarUrl: client.avatarUrl,
    timezone: client.timezone,
  }));
});

router.patch("/client/me", async (req, res): Promise<void> => {
  const parsed = UpdateClientProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(clientsTable)
    .set(parsed.data)
    .where(eq(clientsTable.id, CLIENT_ID))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  res.json(UpdateClientProfileResponse.parse({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    age: updated.age,
    gender: updated.gender,
    preferredLanguage: updated.preferredLanguage,
    avatarUrl: updated.avatarUrl,
    timezone: updated.timezone,
  }));
});

export default router;
