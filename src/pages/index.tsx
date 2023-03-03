import {useContext} from 'react';
import {AuthContext} from "@/context/AuthContext";
import { MainSection } from "@/components/index";
import { ItemContextProvider } from "@/context/ItemContext";

export default function ItemMain() {
    
    const { session } = useContext(AuthContext);

    if(session)
        return (
            <div>
                <ItemContextProvider>
                    <MainSection />
                </ItemContextProvider>
            </div>
        );
}