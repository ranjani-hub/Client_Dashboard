import { Router, type IRouter } from "express";
import { db, therapistsTable } from "@workspace/db";
import { GetTherapistResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/therapist", async (req, res): Promise<void> => {
  const [therapist] = await db.select().from(therapistsTable).limit(1);
  if (!therapist) {
    res.status(404).json({ error: "Therapist not found" });
    return;
  }
  res.json(GetTherapistResponse.parse({
    id: therapist.id,
    name: therapist.name,
    title: therapist.title,
    avatarUrl: therapist.avatarUrl,
    yearsOfExperience: therapist.yearsOfExperience,
    specializations: therapist.specializations ?? [],
    languages: therapist.languages ?? [],
    bio: therapist.bio,
    isVerified: therapist.isVerified,
    rating: therapist.rating,
  }));
});

export default router;
