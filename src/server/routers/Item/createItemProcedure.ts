import { prisma } from "@/server/prisma";
import { publicProcedure } from '@/server/trpc';
import { z } from "zod";

const createItemProcedure = publicProcedure
  .input(
    z.object({
      name: z.string(),
      imgLocation: z.string(),
      price: z.number(),
      quantity: z.number(),
      itemType: z.string(),
      subType: z.string(),
      description: z.string()
    })
  ).mutation( 
    async ({ input }) => {
      console.log('input');
      //store item with url of image in DB
      const response = await prisma
        .item
        .create({
          data: {
            name: input.name,
            img: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}` + input.imgLocation,
            price: input.price,
            quantity: input.quantity,
            itemType: input.itemType,
            subType: input.subType,
            description: input.description        
          }
        });    

      //return created confirmation
      console.log('response', response)
      return response
    });

  export default createItemProcedure;