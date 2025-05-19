import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const messagesRouter = createTRPCRouter({
  getMessages: publicProcedure.query(() => {
    return db.select({
      id: messages.id,
      text: messages.text,
      timestamp: messages.createdAt
    }).from(messages)
  }),
  createNewMessege: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const [newMessage] = await db.insert(messages).values({
      text: input
    }).returning();

    // Notify all clients about the new message
    await db.execute(sql`NOTIFY new_message, '${JSON.stringify(newMessage)}'`);

    return newMessage;
  }),
});