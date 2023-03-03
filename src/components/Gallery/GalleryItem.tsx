import React, { useContext } from "react"
import { ItemContext } from "@/context/ItemContext";
import Image from "next/image";
import images from "@/Assets";
import numeral from "numeral";
import {Item} from "@/models/index";

interface CustomPageProps {
    item: Item
    key: number
}

/**
 * This component hosts an image
 * the image is the main backgroud of the card
 * the add to cart button and price are super imposed over the item
 * the top right of the item has an arrow which can be used to flip
 * 	the item over and display text and item info on the reverse side
 */
export default function GalleryItem(props:CustomPageProps) {
	const { item }:{item:Item} = props;
	const { handleDelete } = useContext(ItemContext);
	console.log('item',item)

	return (
		<div 
			className="relative h-GalleryItem w-GalleryItem rounded-2xl border-2 border-pink-400 bg-transparent shadow-3xl"
		>

			{/* FRONT */}

			<div className="rounded-2xl h-full w-full bg-gray-200">
				{/* MAIN ASSET FR - BACKGROUND */}
				<Image 
					src={item.img ? item.img: images.Logo} 
					alt="Item Image" 
					layout="fill"
				/>

				{/*BACK ELEMENTS NESTED IN COMPONENT */}
				<div className="absolute z-50 left-4 bottom-10">

					{/* REMOVE ITEM */}
					<div 
						className="flex justify-center bg-red-600 absolute h-12 w-12 top-5 right-3 border-2 border-black rounded-[50%] cursor-pointer"
						onClick={() => handleDelete(item?.id) }
					>
						<Image 
							src={images.Cross} 
							className=""
							alt="Item Image" 
							height={35} 
							width={35}
						/> 
					</div>

					{/* DESCRIPTION */}
					<div className="flex h-full flex-col text-center items-center justify-center">
						<h1 className="flex h-10 w-52 my-8 justify-center items-center text-2xl border-2 border-black bg-gray-300 shadow-lg">
							{item?.name}
						</h1>
						<p className="flex h-[425px] w-80 text-left text-xl bg-gray-300 border border-gray-700 rounded-xl p-3 m-3 bg-opacity-40"> 
							{item?.description}
						</p>
					</div>

					{/* ITEM OPTIONS */}
					<div className="flex w-90 p-3 items-end justify-between border border-gray-700 rounded-xl bg-gray-400 bg-opacity-50">
						
						<p className="flex h-full w-full p-2 max-h-[3rem] max-w-[8rem] bg-black hover:bg-red-600 text-white items-center justify-center rounded-lg">
							price: {numeral(item.price).format("$0,0.00")}
						</p>
						
						<p 
							className="flex h-10 w-36 text-3xl items-center justify-center bg-green-400 hover:bg-purple-500 rounded-xl cursor-pointer"
						>
							Available								
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}