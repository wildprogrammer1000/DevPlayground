import { createContext, useContext, useState } from "react";

export const Context = createContext();
export const ContextProvider = ({ children }) => {
  const user = useState();
  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
};