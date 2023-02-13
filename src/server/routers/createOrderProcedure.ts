import { prisma } from "../prisma";
import { publicProcedure } from '../trpc';
import { z } from 'zod';

const createOrderProcedure = publicProcedure
  .input(
    z.object({
      ShippingInfo: z.object({
        first_name: z.string(),
        last_name: z.string(),
        email:  z.string().email(),
        country: z.string(),
        state_province: z.string(),
        address_one: z.string(),
        address_two: z.string(),
        zip_code: z.string(),
      })
    }).nullish() //if empty input, return all
  )
  .mutation( async({input}) => {
    
    console.log("input", input)

    return
  });

export default createOrderProcedure;