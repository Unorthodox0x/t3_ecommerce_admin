import { prisma } from "../prisma";
import { publicProcedure } from '../trpc';
import { z } from 'zod';

const fetchItemsProcedure = publicProcedure
  .input(
    z.object({}).nullish() //if empty input, return all
  )
  .query( async () => {
    return await prisma.item.findMany();
  });

export default fetchItemsProcedure;