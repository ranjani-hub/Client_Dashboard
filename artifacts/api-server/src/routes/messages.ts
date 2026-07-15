import { Router, type IRouter } from "express";
import { db, messagesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import {
  GetMessagesResponse,
  SendMessageBody,
  SendMessageResponse,
  MarkMessageReadParams,
  MarkMessageReadResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const CLIENT_ID = 1;

function serializeMessage(m: typeof messagesTable.$inferSelect) {
  return {
    id: m.id,
    type: m.type,
    senderId: m.senderId,
    senderName: m.senderName,
    senderAvatarUrl: m.senderAvatarUrl,
    content: m.content,
    sentAt: m.sentAt.toISOString(),
    isRead: m.isRead,
  };
}

router.get("/messages", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.clientId, CLIENT_ID))
    .orderBy(desc(messagesTable.sentAt));

  res.json(GetMessagesResponse.parse(rows.map(serializeMessage)));
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [msg] = await db
    .insert(messagesTable)
    .values({
      clientId: CLIENT_ID,
      type: "therapist",
      senderId: CLIENT_ID,
      senderName: "You",
      senderAvatarUrl: null,
      content: parsed.data.content,
      sentAt: new Date(),
      isRead: true,
    })
    .returning();

  res.status(201).json(SendMessageResponse.parse(serializeMessage(msg)));
});

router.patch("/messages/:id/read", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = MarkMessageReadParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(messagesTable)
    .set({ isRead: true })
    .where(and(eq(messagesTable.id, parsed.data.id), eq(messagesTable.clientId, CLIENT_ID)))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json(MarkMessageReadResponse.parse(serializeMessage(updated)));
});

export default router;
