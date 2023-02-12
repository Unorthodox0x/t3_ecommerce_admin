import {IItemContext, Item} from "./Item";

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
	itemType: "Macrame",
	setItemType: () => {},
	subType: "Necklace",
	setSubType: () => {},
	description: "",
	setDescription: () => {},
	// handleImage: () => {},
	handleCreate: () => {},
	handleDelete: () => {}
}

export const defaultItem:Item = {
	id:"",
	name:"",
	img: null,
	imgLocation: null,
	price:0,
	quantity: 0,
	itemType: "Macrame",
	subType: "Necklace",
	description:"",
	createdAt: ""
}