import { IItemContext, Item } from "./Item";

export enum ItemType {
	macrame = "Macrame",
	gemstone = "Gemstone"
}

export enum SubType {
	necklace = "Necklace",
	bracelet = "Bracelet",
	ring = "Ring",
	forehead = "Forehead",
	waist = "Waist"
}

export const defaultItem:Item = {
	id:"",
	name:"",
	img: null,
	imgLocation: null,
	price:0,
	quantity: 0,
	itemType: ItemType.macrame,
	subType: SubType.necklace,
	description:"",
	createdAt: ""
}

export const defaultItemContext:IItemContext = {
	id: "",
	setId: () => {},
	name: "",
	setName: () => {},
	img: "",
	setImg: () => {},
	imgLocation: "",
	setImgLocation: () => {},
	price: 0,
	setPrice: () => {},
	quantity: 0,
	setQuantity: () => {},
	itemType: ItemType.macrame,
	setItemType: () => {},
	subType: SubType.necklace,
	setSubType: () => {},
	description: "",
	setDescription: () => {},
	handleCreate: () => {},
	handleDelete: () => {}
}