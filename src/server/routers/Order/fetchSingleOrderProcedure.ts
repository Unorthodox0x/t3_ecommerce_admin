import { prisma } from "@/server/prisma";
import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';

const fetchSingleOrderProcedure = publicProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query( async ({ input }) => {
    return await prisma.order.findUnique({
      where: {
        id: input.id
      }
    });
  });

export default fetchSingleOrderProcedure;