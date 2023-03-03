import { router } from '../trpc';
import fetchItemsProcedure from "./Item/fetchItemsProcedure";
import createItemProcedure from "./Item/createItemProcedure";
import deleteItemProcedure from "./Item/deleteItemProcedure";
import updateOrderProcedure from "./Order/updateOrderProcedure";
import deleteOrderProcedure from './Order/deleteOrderProcedure';
import fetchOrdersProcedure from "./Order/fetchOrdersProcedure";
import fetchSingleOrderProcedure from "./Order/fetchSingleOrderProcedure";

//TRPC ROUTER
export const appRouter = router({
  //Items
  fetchItems: fetchItemsProcedure,
  createItem: createItemProcedure,
  deleteItem: deleteItemProcedure,
  //Orders  
  fetchOrders: fetchOrdersProcedure,
  fetchSingleOrder: fetchSingleOrderProcedure,
  updateOrder: updateOrderProcedure,
  deleteOrder: deleteOrderProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;