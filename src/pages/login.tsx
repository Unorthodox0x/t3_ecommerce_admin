import {useContext} from 'react';
import {AuthContext} from "@/context/AuthContext";

export default function Login () {

  const {
    setEmail,
    session,
    submitted,
    handleLogin,
    handleLogout
  } = useContext(AuthContext);
  

  if(!session)
    return (
      <div className="flex h-[800px] w-screen items-center justify-center">
        <div className="w-[500px] bg-white p-8">
          <div className="flex w-full mb-5">
            <label
              className="flex items-center justify-center text-2xl mr-5 text-black"
            >
              Email:
            </label>
            <input
              className="flex p-3 w-96"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="flex w-full p-4 text-2xl items-center justify-center bg-red-600"
            onClick={() => handleLogin()}
          >
            Login
          </button>
          {submitted && (
            <div className="w-full text-center mt-5 text-2xl text-black">
              Check your email to login
            </div>
          )}
        </div>
      </div>
    );

  return ( 
    <div className="flex h-[800px] w-screen items-center justify-center">
      <div className="w-[500px] bg-white p-8">  
        <button 
          onClick={() => handleLogout()}
          className="flex w-full items-center justify-center text-black text-2xl"
        >
          Sign out
        </button> 
      </div>
    </div>
  )
}