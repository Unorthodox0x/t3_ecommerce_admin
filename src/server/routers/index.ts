import { router } from '../trpc';
import fetchItemsProcedure from "./fetchItemsProcedure";
import createItemProcedure from "./createItemProcedure";
import deleteItemProcedure from "./deleteItemProcedure";
import createOrderProcedure from "./createOrderProcedure";

export const appRouter = router({
  fetchItems: fetchItemsProcedure,
  createItem: createItemProcedure,
  deleteItem: deleteItemProcedure,
  deleteItem: deleteItemProcedure
  createOrder: ,
});

// export type definition of API
export type AppRouter = typeof appRouter;