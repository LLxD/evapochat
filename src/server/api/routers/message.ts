import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  createMessage: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      if(input.text.length > 120 || input.text.length < 1){
        throw new Error('Message must be between 1 and 120 characters')
      }
      return ctx.prisma.message.create({
        data: {
          text: input.text,
        },
      });
    }),
  eraseAll: publicProcedure.mutation(({ ctx }) => {
    return ctx.prisma.message.deleteMany();
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany();
  }),
});

const caller = messageRouter.createCaller({
  prisma,
})

const eraseMessagesEvery5Minutes = async () => {
  await caller.eraseAll()
  setTimeout(eraseMessagesEvery5Minutes, 1000 * 60 * 5)
}

eraseMessagesEvery5Minutes()