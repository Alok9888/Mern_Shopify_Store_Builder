import { createContext, useState } from "react"
export const AuthContext = createContext(null)
export function AuthProvider({children}){
  const [token, setToken] = useState(null) // ONLY RAM - dies on reload
  const [email, setEmail] = useState(null)
  return <AuthContext.Provider value={{token,setToken,email,setEmail}}>{children}</AuthContext.Provider>
}