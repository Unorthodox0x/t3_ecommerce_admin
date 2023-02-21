import { prisma } from "../prisma";
import { publicProcedure } from '../trpc';
import { z } from 'zod';

/**
 * This procedure is called after reception of 
 *   webhook type:success from stripe.
 * An order object is created in Prisma DB before
 *   triggering a call to quickbooks to create bill
 */
const updateOrderProcedure = publicProcedure
  .input(
    z.object({ 
      paymentId: z.string(),
      idempotencyKey: z.string().nullable().optional(),
      amount: z.number(),
      amount_received: z.number(),
      receipt_url: z.string(),
      status: z.string(),
      customerId: z.string(),
    }) //if empty input, return all
  )
  .mutation( async({input}) => {

    //find the order saved in db and update
    await prisma.order.update({
        where: {
            customerId: input.customerId,
        },
        data: {
          paymentId: input.paymentId,
          idempotencyKey: input.idempotencyKey,
          totalPrice: input.amount,
          receiptUrl: input.receipt_url,
          paymentStatus: input.status,
        },
    });

    //trigger accounting webhook

    return;
  });

export default updateOrderProcedure;