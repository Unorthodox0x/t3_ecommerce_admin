import React, { useState, useEffect, createContext } from "react";
import {
    defaultAuthContext,
    IAuthContext,
} from "../models/index";
import { useRouter } from "next/router";
import {supabase} from "@/server/supabase";
import type {Session} from "@supabase/supabase-js";

/**
 * This Context is used to collect shipping information from user
 * 	and call server function to 
 */
export const AuthContext = createContext<IAuthContext>(defaultAuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [email, setEmail] = useState <string>("");
    const [session, setSession] = useState<Session|undefined>(undefined)
    const [submitted, setSubmitted] = useState<boolean>(false);
    const router = useRouter();

    {/* CHECK USER AUTH */}
    useEffect(() => {
        const getUser = async () => {
            const {data: { user:fetchedUser }, error} = await supabase.auth.getUser();
            if(error || fetchedUser === null){
                router.push('/login');
            }
        }
        getUser();
    }, [])

    {/*CHECK SESSION*/ }
    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session: fetchedSession },
            } = await supabase.auth.getSession()
            if (!fetchedSession) {
                setSession(undefined)
            } else {
                setSession(fetchedSession);
            }
        }
        getSession();
    }, [])

    async function handleLogin() {
        if (!email) return;
        try {
            const { error } = await supabase
                .auth
                .signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: 'localhost:3000/login',
                    }
                })
            if (error) throw error;
            setSubmitted(true);
        } catch (error) {
            console.error(error)
        }
    }

    async function handleLogout() {
        supabase?.auth.signOut()
    }

    return (
        <AuthContext.Provider
			value={{
				email,
				setEmail,
				session,
				submitted,
				handleLogin,
				handleLogout
			}}
		>
			{children}
		</AuthContext.Provider>
    )

}