import { useContext, createContext } from "react";
const AuthContext = createContext({
    //declare all the data and fuctions to be accessed globally
    user: null,
    role: null,
    token: null,
    isLogIn: false,
    isLoading: false,
    signUp: async () => {},
    logIn: async () => {},
    logInWithIdentityProvider : () => {},
    logOut: async () => {},
    logInState: () => {},
  });

//custom hook to use | read  the context
const useAuth = () => useContext(AuthContext);

export{
    useAuth,
    AuthContext
}