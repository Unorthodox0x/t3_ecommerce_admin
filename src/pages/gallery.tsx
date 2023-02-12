import {useContext} from 'react';
import {AuthContext} from "@/context/AuthContext";
import { GalleryMain } from "@/components/index";
import {ItemContextProvider} from "@/context/ItemContext";

export default function GalleryPage() {
   
    const { session } = useContext(AuthContext);

    if (session)
     return (
        <div className="flex h-full w-full bg-purple-800 items-center justify-around">
          <ItemContextProvider>
            <GalleryMain />
          </ItemContextProvider>
        </div>
    );
}