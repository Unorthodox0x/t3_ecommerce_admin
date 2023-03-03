// import numeral from "numeral";
//Types
import {IOrder} from "@/models/index";

interface CustomPageProps {
    order: IOrder
}

/**
 * This component hosts an image
 * the image is the main backgroud of the card
 * the add to cart button and price are super imposed over the item
 * the top right of the item has an arrow which can be used to flip
 * 	the item over and display text and item info on the reverse side
 */
export default function DisplayOrder(props:CustomPageProps) {
	const { order } = props;

	return (
		<div 
			className="h-DisplayOrder w-DisplayOrder text-lg rounded-2xl bg-gray-400 border-2 border-pink-400"
		>
			{/* ORDER INFO */}
			<div 
				className="flex flex-col w-full text-black border-b-2 border-black"
			>
				<h1
					className="text-2xl py-5 text-center font-bold"
				>
					Customer Order
				</h1>
				<span
					className="text-2xl p-3 text-end font-bold"
				>
					<u>Order Id:</u> {order.id}
				</span>
			</div>

			{/* CUSTOMER INFO */}
			<div
				className="flex flex-col px-12 pt-8 text-black font-bold"
			>
				<u
					className="text-4xl"
				>
					Customer Info
				</u>
				<div
					className="flex flex-col ml-4 mt-2"
				>
					<span>
						<u className="text-2xl">Email:</u> 
						&nbsp; {order.email}
					</span>
					<span>
						<u className="text-2xl">Customer Name:</u> 
						&nbsp; {order.firstName + " " + order.lastName}
					</span>
				</div>
			</div>
			
			{/* ADDRESS INFO */}
			<div 
				className="flex flex-col px-12 py-5 text-black font-bold"
			>
				<u
					className="text-4xl"
				>
					Address
				</u>
				<div
					className="flex flex-col ml-4 mt-2"
				>
					<span>
						<u className="text-2xl">Country:</u> 
						&nbsp; {order.country}
					</span>
					<span>
						<u className="text-2xl">State|Province:</u> 
						&nbsp; {order.stateProvince}					
					</span>
					<span>
						<u className="text-2xl">City:</u> 
						&nbsp; {order.city}
					</span>
					<span>
						<u className="text-2xl">Street Address:</u>
						&nbsp; {order.addressline + " " + order.addressline2}
					</span>
					<span>
						<u className="text-2xl">ZipCode:</u> 
						&nbsp; {order.zipcode}
					</span>
				</div>
			</div>

			{/* PAYMENT INFO */}
			<div 
				className="flex flex-col px-12 text-black font-bold"
			>
				<u
					className="text-4xl"
				>
					Payment
				</u>
				<div
					className="flex flex-col ml-4 mt-2"
				>
					<span>
						<u className="text-2xl">Order Price:</u> 
						&nbsp; {order.totalPrice}
					</span>
					<span>
						<u className="text-2xl">Payment Provider:</u> 
						&nbsp; {order.paymentMethod}
					</span>
					<span>
						<u className={
							order.paymentStatus === "failed" 
								? "text-2xl text-red" 
							: order.paymentStatus === "success" 
								? "text-2xl text-green"
							: "text-2xl"}
							>Payment Status:</u> 
						&nbsp; {order.paymentStatus}
					</span>
					<span>
						<u className="text-2xl">Payment Receipt:</u> 
						&nbsp; {order.receiptUrl}
					</span>
				</div>
			</div>

			{/* SHIPPING INFO */}
			<div 
				className="flex flex-col px-12 py-5 text-black font-bold"
			>
				<u
					className="text-4xl"
				>
					Shipping
				</u>
				<div
					className="flex flex-col ml-4 mt-2"
				>
					<span>
						<u>Shipping Cost:</u> null
					</span>
					<span> 
						<u>Status:</u> { 
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
	
			{/* ORDER OPTIONS */}
			<div
				className="flex flex-wrap w-full justify-end p-12 font-bold cursor-pointer"
			>
				<button
					className="w-40 h-10 ml-2 my-2 text-black bg-yellow-400 cursor-pointer"
				>
					Reset Shipping
				</button>
				<button
					className="w-40 h-10 ml-2 my-2 text-black bg-yellow-400 cursor-pointer"
				>
					Mark Shipped
				</button>
				<button
					className="w-40 h-10 ml-2 my-2 text-black bg-yellow-400 cursor-pointer"
				>
					Mark Received
				</button>
				<button
					className="w-40 h-10 ml-2 my-2 bg-red-700"
				>
					Delete order
				</button>
			</div>

		</div>
	);
}