import { createContext,useContext } from "react";


export const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: null,
});


export function useAuthContext(){
    return useContext(AuthContext)
}
