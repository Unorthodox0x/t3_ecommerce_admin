import {IAuthContext} from "./Auth";

export const defaultAuthContext:IAuthContext = {
	email:"",
	setEmail: () => {},
	session: undefined,
	submitted:false,
	handleLogin: () => {},
	handleLogout: () => {},
}