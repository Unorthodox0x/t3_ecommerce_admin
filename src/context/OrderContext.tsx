import React, { useState, createContext } from "react";
import {
	defaultOrder,
	defaultOrderContext, IOrderContext,
	Item, //IOrder
} from "../models/index";

/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const OrderContext = createContext<IOrderContext>(defaultOrderContext);

export const OrderContextProvider = ({ children }:{children: React.ReactNode}) => {

	//ALL ORDERS LIST
	// const [order, setOrder] = useState<IOrder>(defaultOrder)
	//SINGLE ORDER VARS
	const [id, setId] = useState<string>(defaultOrder.id)
	const [email, setEmail] = useState<string>(defaultOrder.email)
	const [firstName, setFirstName] = useState<string>(defaultOrder.firstName)
	const [lastName, setLasttName] = useState<string>(defaultOrder.lastName)
	const [country, setCountry] = useState<string>(defaultOrder.country)
	const [stateProvince, setStateProvince] = useState<string>(defaultOrder.stateProvince)
	const [city, setCity] = useState<string>(defaultOrder.city)
	const [address1, setAddress1] = useState<string>(defaultOrder.address1)
	const [address2, setAddress2] = useState<string>(defaultOrder.address2)
	const [zipcode, setZipcode] = useState<string>(defaultOrder.zipcode)
	const [items, setItems] = useState<Item[]>(defaultOrder.items)
	const [paymentMethod, setPaymentMethod] = useState<string>(defaultOrder.paymentMethod)
	const [totalPrice, setTotalPrice] = useState<number>(defaultOrder.totalPrice)
	// const [shippingCost, setShippingCost] =useState<number>(defaultOrder.shippingCost);
	// const [shipped, setShipped] =useState<boolean>(defaultOrder.shipped);
	// const [received, setReceived] =useState<boolean>(defaultOrder.received);
		
	const fetchOrders = async(orderId:string):Promise<void> => {
		console.log('orderId', orderId)
		// const { data, error } = fetchGalleryItems('/api/posts', fetcher)
		// console.log('item', item)
		return;
	}

	return(
		<OrderContext.Provider
			value={{
				id,
				setId,
				email,
				setEmail,
				firstName,
				setFirstName,
				lastName,
				setLasttName,
				country,
				setCountry,
				stateProvince,
				setStateProvince,
				city,
				setCity,
				address1,
				setAddress1,
				address2,
				setAddress2,
				zipcode,
				setZipcode,
				items,
				paymentMethod,
				setPaymentMethod,
				totalPrice,
				// fetchOrders,
			}}
		>
			{children}
		</OrderContext.Provider>
		)

}