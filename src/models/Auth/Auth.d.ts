import {Session} from "@Supabase/supabase-js";
import {Dispatch, SetStateAction} from "react";

export declare interface IAuthContext {
	email: string
	setEmail: Dispatch<SetStateAction<string>>
	session: Session|undefined
	submitted: boolean
	handleLogin: () => void
	handleLogout: () => void
}