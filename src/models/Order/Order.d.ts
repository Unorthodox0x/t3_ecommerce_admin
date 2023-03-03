import {Dispatch, SetStateAction} from "react";
import {Item} from "../Item/Item"

export declare interface IOrderContext {
	selectedOrder: IOrder
	setSelectedOrder: Dispatch<SetStateAction<IOrder>>
	openOrder: boolean
	setOpenOrder: Dispatch<SetStateAction<boolean>>
}

export declare interface IOrder {
	id: string
	email: string
	firstName: string
	lastName: string
	country: string
	stateProvince: string
	city: string
	addressline: string
	addressline2: string
	zipcode: string
	phoneNumber: string
	items: Item[]
	paymentMethod: string
	totalPrice: number
	shipped: boolean
	received: boolean
	createdAt: Date

	paymentId?: string
	customerId?: string
	idempotencyKey?: string
	receiptUrl?: string
	paymentStatus?: string
}