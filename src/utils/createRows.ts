import {Item} from "../models/index";

export default function createRows(galleryItems:Item[]|undefined):Item[][]|null {
    if(galleryItems?.length === 0 ||galleryItems===undefined ) return null;
    
    let galleryRows:Item[][] = [];
    
    const chunkSize:number = 3;
    for (let i = 0; i < galleryItems.length; i += chunkSize) {
        const chunk:Item[] = galleryItems.slice(i, i + chunkSize);
        galleryRows.push(chunk);
    }

    return galleryRows;
}