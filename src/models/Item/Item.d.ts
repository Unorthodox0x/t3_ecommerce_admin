import { StaticImageData } from "next/image";
import {Dispatch, SetStateAction} from "react";

export declare interface IItemContext {
	id: string
	setId: Dispatch<SetStateAction<string>>
  name: string
	setName: Dispatch<SetStateAction<string>>
  img: StaticImageData|string|null
  setImg: Dispatch<SetStateAction<StaticImageData|string|null>>
  imgLocation: string|null
	setImgLocation: Dispatch<SetStateAction<string|null>>
  price: number
	setPrice: Dispatch<SetStateAction<number>>
	quantity: number
	setQuantity: Dispatch<SetStateAction<number>>
  itemType: string
	setItemType: Dispatch<SetStateAction<string>>
	subType: string
	setSubType: Dispatch<SetStateAction<string>>
	description: string
	setDescription: Dispatch<SetStateAction<string>>
	handleCreate: () => void
	handleDelete: (itemId:string) => void
}

export declare interface Item {
  id: string
  name: string
  img: StaticImageData|string|null
  imgLocation?: string|null|undefined
  price: number
  quantity: number
  itemType: string
  subType: string
  description: string
  createdAt: string
}