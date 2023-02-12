import React, {useContext} from "react"
import Image from "next/image";
import Link from "next/link";
import {AuthContext} from "@/context/AuthContext";
 
import images from "../Assets";

const NavBar:React.FunctionComponent = () => {

	const { session } = useContext(AuthContext);

	const menuItems = [{ 
		name: "Gallery",
		link: "/gallery"
	}, {
		name: "Create",
		link: "/"
	}]

	return (
		<div className="flex max-w-full mx-auto p-5 bg-black shadow-xl justify-between">

			{/* LEFT SECTION */}
			<div className="grid grid-cols-3 items-center justify-start mx-5">
				
				{/* Logo Image */}
				<div className="flex items-center gap-4">
					<Link href="/gallery">
						<Image src={images.Logo} alt="logo" width={50} height={50}/>
					</Link>
				</div>

				{/* Menu Items */}
				<div className="flex items-center justify-between gap-10">
					{ menuItems.map((el, i) => (
						<Link
							key={i+1}
							href={{ pathname: `${el.link}` }}
						>
							<p className="text-2xl text-white">{el.name}</p>
						</Link>
					)	)	}
				</div>

			</div>

			{/* RIGHT */}
			<div className="absolute flex right-10 top-5 items-center justify-end mt-2 mr-28">
				{/* LOGIN */}
				<Link
					className="cursor-pointer" 
					href='/login'
				>
					<p className="text-2xl text-white">
						{ session ? (
							"Signout"
						)  : "Login" }
					</p>
				</Link>
			</div>
		</div>
	);
}

export default NavBar;