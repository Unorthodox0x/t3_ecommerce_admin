import {useContext} from 'react';
import {AuthContext} from "@/context/AuthContext";
import { OrdersMain } from "@/components";
import {OrderContextProvider} from "@/context/OrderContext";

export default function GalleryPage() {
   
    const { session } = useContext(AuthContext);

    if (session)
     return (
        <div className="flex p-20 h-full w-full bg-purple-800 items-center justify-around">
          <OrderContextProvider>
            <OrdersMain />
          </OrderContextProvider>
        </div>
    );
}