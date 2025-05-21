import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const messagesRouter = createTRPCRouter({
  getMessages: publicProcedure.query(() => {
    return db.select({
      id: messages.id,
      text: messages.text,
      timestamp: messages.created_at
    }).from(messages)
  }),
  createNewMessege: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const [newMessage] = await db.insert(messages).values({
      text: input
    }).returning();

    return newMessage;
  }),
  deleteMessage: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    await db.delete(messages).where(eq(messages.id, input));
  })
});