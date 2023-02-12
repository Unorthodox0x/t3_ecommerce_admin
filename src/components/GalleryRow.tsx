import React from "react"
import { GalleryItem } from "./index";
import {Item} from "@/models/index";

interface CustomPageProps {
    row: Item[]
    key: number
}

export default function GalleryRow (props:CustomPageProps) {
	const {row} = props;

	return (
		<div className="flex w-11/12 max-w-10xl mt-20 items-start justify-between">
			{row?.map(
				(object:Item, i:number) => i < 3 && 
				<div 
					className={
						i === 1 
						? "mb-5 rounded-2xl group perspective preserve-3d" 
						: "my-5 rounded-2xl group perspective preserve-3d"
					}
					key={i}
				>
					<GalleryItem 
						item={row[i]} 
						key={i}
					/>
				</div>
            ) }
		</div>
	);
}