import {Dispatch, SetStateAction, ChangeEvent} from "react";
import {supabase} from "@/server/supabase";
import extractExtention from "./extractExtension";
import { StaticImageData } from "next/image";

export default async function handleUpload(
    e:ChangeEvent<HTMLInputElement>,
    setImg: Dispatch<SetStateAction<StaticImageData|string|null>>,
    setImgLocation: Dispatch<SetStateAction<string|null>>
):Promise<void> {
    const file = e.target?.files[0];
    if(!file) return;

    console.log('file', file)
    setImg(file)
    const { data } = await supabase
        .storage
        .from('shinies')
        .upload(crypto.randomUUID() + '.' + extractExtention(file.name), file) //uuid
    console.log("data", data);

    if(!data){
        setImg(null)
        return;  
    } 
    setImgLocation(data.path)
}