import { useState, useEffect, useContext, ChangeEvent }  from 'react';
import Image from "next/image";
import images from "@/Assets";
import { ItemContext } from "@/context/ItemContext";
import handleUpload from "@/utils/handleUpload";

export default function MainSection () {

    const {
        handleCreate,
        img, setImg,
        setImgLocation,
        name, setName, 
        setPrice, 
        setItemType,
        setSubType,
        setQuantity,
        setDescription
    } = useContext(ItemContext);
    const [preview, setPreview] = useState<string>("");

    /**
     * After image upload changeEvent, 
     *   create blob url to display img preview in browser
     */
    useEffect(() => {
        //TODO: REMOVE STRING FROM MODEL sent to trpc
        if (!img || typeof img === "string") {
            setPreview("")
            return
        }

       // create the preview
       const objectUrl:string = URL.createObjectURL(img)
       setPreview(objectUrl);
       
       // free memory when ever this component is unmounted
       return () => URL.revokeObjectURL(objectUrl)
    }, [img])

    return (
        <div className="flex h-screen flex-col w-full bg-purple-800 items-center justify-around">

            <div className="flex h-[1000px] w-10/12 bg-gray-400 rounded-3xl border-2 border-black p-12">
                
                <div className="h-full w-92 p-10 border-black ">
                    {/* IMAGE/UPLOAD CONTAINER*/}
                    <div className="flex h-96 w-96 items-center justify-center">

                        {/* Image */}
                        <div className="flex h-96 w-96 bg-gray-400 rounded-3xl border-2 border-black p-5 items-center justify-center">
                            <Image 
                                src={preview !== "" ? preview : images.Camera} 
                                alt="Item Image" 
                                height={428} 
                                width={360} 
                            />
                        </div>

                        {/* Upload */}
                         <input 
                             type="file" 
                             accept="image/*" 
                             className="absolute translate-y-24 z-10 bg-white text-xl rounded-xl items-center justify-center cursor-pointer" 
                             onChange={(e:ChangeEvent<HTMLInputElement>) => handleUpload(e, setImg, setImgLocation) }
                         />
                    </div>

                    {/* OPTIONS */}
                    <div className="flex h-96 w-96 p-5 my-5 border-2 border-black rounded-3xl">
                        Options
                    </div>

                </div>

                {/* FORM */}
                <div className="flex flex-col w-full h-full p-16 mx-10 items-start border-2 border-black rounded-3xl">
                    <h1 className="text-4xl w-full font-bold border-b-2 border-black">
                        Input Item Info
                    </h1>
                    
                    <input 
                        className="h-16 w-96 m-5 p-5"
                        type="text" 
                        placeholder="name" 
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    
                    <input 
                        onChange={(e)=>setPrice(Number(e.target.value))}
                        className="h-16 w-96 m-5 p-5"
                        type="number" 
                        placeholder="price" 
                    />
                    
                    <select 
                        onChange={(e)=> setItemType(e.target.value)}
                        className="h-16 w-96 m-5 p-5"
                    >
                        <option value="Macreme">Macrame</option>
                        <option value="Gemstone">Gemstone</option>
                    </select>

                    <select 
                        onChange={(e)=> setSubType(e.target.value)}
                        className="h-16 w-96 m-5 p-5"
                    >
                        <option value="Necklace">Necklace</option>
                        <option value="Bracelet">Bracelet</option>
                        <option value="Ring">Ring</option>
                        <option value="Forehead">Forehead</option>
                        <option value="Waist">Waist</option>
                    </select>

                    <input 
                        onChange={(e)=>setQuantity(Number(e.target.value))}
                        className="h-16 w-96 m-5 p-5"
                        type="number" 
                        placeholder="quantity" 
                    />

                    <textarea 
                        onChange={(e)=>setDescription(e.target.value)}
                        className="h-56 w-96 m-5 p-5"
                        placeholder="Item description" 
                    />

                    <button
                        className="flex relative left-72 h-12 w-28 bg-white hover:bg-gray-300 border-2 border-black rounded-lg items-center justify-center cursor-pointer"
                        onClick={()=> handleCreate()}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}