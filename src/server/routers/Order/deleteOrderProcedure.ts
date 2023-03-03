import { prisma } from "@/server/prisma";
import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';

/**
 * This procedure is called after reception of 
 *   webhook type:success from stripe.
 * An order object is created in Prisma DB before
 *   triggering a call to quickbooks to create bill
 */
const deleteOrderProcedure = publicProcedure
  .input(
    z.object({ 
      customerId: z.string(),
    }) //if empty input, return all
  )
  .mutation( async({input}) => {

    //find the order saved in db and update
    await prisma.order.delete({
        where: {
            customerId: input.customerId,
        },
    });

    //trigger accounting webhook

    return;
  });

export default deleteOrderProcedure;