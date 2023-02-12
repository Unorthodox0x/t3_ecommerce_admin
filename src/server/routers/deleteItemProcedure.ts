import { prisma } from "../prisma";
import { publicProcedure } from '../trpc';
import {supabase} from "../supabase";
import { z } from "zod";

const deleteItemProcedure = publicProcedure 
  .input(
    z.object({
      itemId: z.string(),
    })
  )
  .mutation( async({ input }) => {
    try{

      //Delete Image
      const {data, error} = await supabase.from('shinies')
        .delete()
        .eq("id", input.itemId)

      if(data && !error){
        //delete database entry
        return await prisma.item.delete({
          where: {
            id: input.itemId,
          },
        })        
      }  

    }catch(error){
      console.error(error)
    }
  }
);

export default deleteItemProcedure;