import React, { useState, createContext, ReactNode, ReactElement } from "react";
import {
	defaultOrder, IOrder,
	defaultOrderContext, IOrderContext,
} from "../models/index";

/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const OrderContext = createContext<IOrderContext>(defaultOrderContext);

export const OrderContextProvider = ({ children }:{children: ReactNode}):ReactElement => {

	//ALL ORDERS LIST
	const [openOrder, setOpenOrder] = useState<boolean>(false);
	const [selectedOrder, setSelectedOrder] = useState<IOrder>(defaultOrder)

	return(
		<OrderContext.Provider
			value={{
				selectedOrder,
				setSelectedOrder,
				openOrder,
				setOpenOrder,
			}}
		>
			{children}
		</OrderContext.Provider>
		)

}