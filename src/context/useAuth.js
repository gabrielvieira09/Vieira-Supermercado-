import React, {
    createContext,
    useCallback,
    useState,
    useContext,
    useEffect,
  } from "react";
  import AsyncStorage from "@react-native-community/async-storage";
  import { api } from "../services/api";
  
  
  const AuthContext = createContext({});
  
  
  export const AuthProvider = ({ children }) => {
    const [data, setData] = useState({});
  
  
    useEffect(() => {
      async function loadStorageData() {
        const [token, user] = await AsyncStorage.multiGet([
          "@SenaiX:token",
          "@SenaiX:user",
        ]);
  
  
        if (token[1] && user[1]) {
          api.defaults.headers.authorization = `Bearer ${token[1]}`;
          setData({ token: token[1], user: JSON.parse(user[1]) });
        }
      }
  
  
      loadStorageData();
    }, []);
  
  
    const signIn = useCallback(async ({ email, password }) => {
      const response = await api.post("login", { email, password });
      const { token, user } = response.data;
  
  
      await AsyncStorage.multiSet([
        ["@SenaiX:token", token],
        ["@SenaiX:user", JSON.stringify(user)],
      ]);
  
  
      api.defaults.headers.authorization = `Bearer ${token}`;
      setData({ token, user });
    }, []);
  
  
    const signOut = useCallback(async () => {
      await AsyncStorage.multiRemove(["@SenaiX:token", "@SenaiX:user"]);
      setData({});
    }, []);

    const updateUser = useCallback((updateUser) => {
      setData((currentData) => ({...currentData, user: updateUser}));
      AsyncStorage.setItem("@SenaiX:user", JSON.stringify(updateUser));
    }, []);
  
  
    return (
      <AuthContext.Provider value={{ ...data, signIn, signOut, updateUser }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  
  export const useAuth = () => useContext(AuthContext);
  