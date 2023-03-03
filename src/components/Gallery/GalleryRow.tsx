import React from "react"
import { GalleryItem } from "@/components";
//Types
import {Item} from "@/models";

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
					className="my-5 rounded-2xl group perspective preserve-3d"
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