import {useContext} from "react"
import {OrderContext} from "@/context/OrderContext";
import numeral from "numeral";

//Types
import {IOrder} from "@/models/index";

interface CustomPageProps {
    order: IOrder
    key: number
}

/**
 * This component hosts an image
 * the image is the main backgroud of the card
 * the add to cart button and price are super imposed over the item
 * the top right of the item has an arrow which can be used to flip
 * 	the item over and display text and item info on the reverse side
 */
export default function OrderPreview(props:CustomPageProps) {

	const { order } = props;
	const {
        setSelectedOrder,
        setOpenOrder
    } = useContext(OrderContext);

	return (
		<div 
			className="h-OrderPreview w-OrderPreview m-5 text-lg rounded-2xl border-2 border-pink-400 cursor-pointer"
			onClick={() => {
				setSelectedOrder(order), 
				setOpenOrder(true)
			}	}
		>
			<div className="flex flex-col p-5 rounded-2xl bg-gray-600">
				<div className="flex w-full">
					<span className="w-full my-2 mr-5">
						<u>Order Id</u>: {order.id}
					</span>
					<span className="my-2 w-60">
						<u>Order Price</u>: {numeral(order.totalPrice).format("$0.00")}
					</span>
				</div>
				<span className="my-2">
					<u>email</u>: {order.email}
				</span>
				<span className="my-2">
					<u>Time Created</u>: {order.createdAt}
				</span>
				<span className="my-2">
					<u>Payment Provider</u>: {order.paymentMethod}	
				</span>
				<span className="my-2">
					<u>Payment Status</u>: {order.paymentStatus}
				</span>
				<span className="my-2">
					<u>Receipt</u>: {order.receiptUrl}
				</span>
				<span className="my-2"> 
					<u>Shipping Status</u>: { 
						order.shipped === false && order.received === false
							? "Not Shipped" :
						order.shipped === true && order.received === false
							? "Shipped" :
						order.shipped === true && order.received === true
							? "Received" : 
							null
					}
				</span>
			</div>
		</div>
	);
}