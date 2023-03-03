import {useContext} from "react";
import {OrderContext} from "@/context/OrderContext";
import {trpc} from "@/utils/trpc";
import {OrderPreview, DisplayOrder} from "@/components"
import Popup from "reactjs-popup";

//types
import {IOrder} from "@/models"

export default function OrdersMain () {

    const {
        selectedOrder, 
        openOrder,
        setOpenOrder
    } = useContext(OrderContext);
    const {data:fetchedOrders} = trpc.fetchOrders.useQuery({},{
        onSuccess: (data:IOrder[])=> {
            console.log('done', data)
        },
    });

    console.log("fetchedOrders", fetchedOrders)

    return (
        <main className="flex flex-wrap justify-start overflow-y-scroll h-full w-[1350px] bg-purple-800 border-r-2 border-black">
            { fetchedOrders?.map( 
                (order:IOrder, i:number) => 
                    <OrderPreview
                        order={order}
                        key={i}
                    />
                )
            }

            {/* POPUP CART MENU */}
            <Popup
                open={openOrder}
                className=""
                closeOnEscape={true}
                onClose={() => (
                    setOpenOrder(false)
                )}
            >
                <DisplayOrder 
                    order={selectedOrder}
                />
            </Popup>
        </main>
    );
}