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
	setItemType: Dispatch<SetStateAction<itemType>>
	subType: string
	setSubType: Dispatch<SetStateAction<subType>>
	description: string
	setDescription: Dispatch<SetStateAction<string>>
	handleCreate: () => void
	handleDelete: () => void
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

export declare interface itemType {
	Macrame: "Macreme"
	Gemstone: "Gemstone"
}

export declare interface subType {
	Necklace: "Necklace",
	Bracelet: "Bracelet",
	Ring: "Ring",
	Forehead: "Forehead",
	Waist: "Waist",
}