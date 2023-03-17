import { z } from "zod";
import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const availableColors = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
] ;


export const messageRouter = createTRPCRouter({
  createMessage: publicProcedure
    .input(z.object({ text: z.string(), randomColor: z.number() }))
    .mutation(({ ctx, input }) => {
      if(input.text.length > 120 || input.text.length < 1){
        throw new Error('Message must be between 1 and 120 characters')
      }
      // input.randomColor is a number between 0 and 1
      const randomColor = availableColors[Math.floor(input.randomColor * availableColors.length)] || "bg-gray-500"
      return ctx.prisma.message.create({
        data: {
          text: input.text,
          randomColor: randomColor,
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

const eraseMessagesEvery5Minutes = () => {
  caller.eraseAll().then(()=>
  setTimeout(eraseMessagesEvery5Minutes, 1000 * 60 * 5)
  ).catch((err) => {
    console.error(err)
  })
}

eraseMessagesEvery5Minutes()