import { prisma } from "@/server/prisma";
import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';

const fetchItemsProcedure = publicProcedure
  .input(
    z.object({}).nullish() //if empty input, return all
  )
  .query( async () => {
    return await prisma.item.findMany();
  });

export default fetchItemsProcedure;