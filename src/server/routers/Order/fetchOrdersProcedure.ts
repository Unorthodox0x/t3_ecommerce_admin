import { prisma } from "@/server/prisma";
import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';

const fetchOrdersProcedure = publicProcedure
  .input(
    z.object({}).nullish() //if empty input, return all
  )
  .query( async () => {
    return await prisma.order.findMany();
  });

export default fetchOrdersProcedure;