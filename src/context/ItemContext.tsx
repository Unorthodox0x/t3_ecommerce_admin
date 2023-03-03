import React, { useState, createContext, ReactNode, ReactElement } from "react";
import { StaticImageData } from "next/image";
import {
	defaultItemContext, IItemContext,
	defaultItem
} from "../models/index";
import {trpc} from "../utils/trpc";
/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const ItemContext = createContext<IItemContext>(defaultItemContext);

export const ItemContextProvider = ({children}:{children: ReactNode}):ReactElement => {

	const [id, setId] = useState<string>(defaultItem.id);
	const [name, setName] = useState<string>(defaultItem.name);
	const [img, setImg] = useState<StaticImageData|string|null>(null);
	const [imgLocation, setImgLocation] = useState<string|null>(null);
	const [quantity, setQuantity] = useState<number>(defaultItem.quantity);
	const [price, setPrice] = useState<number>(defaultItem.price);
	const [itemType, setItemType] = useState<string>(defaultItem.itemType);
	const [subType, setSubType] = useState<string>(defaultItem.subType);
	const [description, setDescription] = useState<string>(defaultItem.description);

	const {mutate: createItem} = trpc.createItem.useMutation();
	const handleCreate = ():void => {
		try{
			if(!imgLocation) throw new Error("Image required");
			return createItem({ 
				name, 
				imgLocation, 
				price,
				quantity,
				itemType,
				subType, 
				description 
			});	
		} catch (error){
			console.error(error)
		}
	}

	const {mutate: doDelete} = trpc.deleteItem.useMutation()
	const handleDelete = (itemId: string):void => {
		try{
			console.log("itemId", itemId)
			return doDelete({ itemId })
		}catch(error){
			console.error(error)
		}
	}
	
	return(
		<ItemContext.Provider
			value={{
				id,
				setId,
				name,
				setName,
				img,
				setImg,
				imgLocation,
				setImgLocation,
				price,
				setPrice,
				itemType,
				setItemType,
				subType,
				setSubType,
				quantity,
				setQuantity,
				description,
				setDescription,
				handleCreate,
				handleDelete
			}}
		>
			{children}
		</ItemContext.Provider>
		)

}