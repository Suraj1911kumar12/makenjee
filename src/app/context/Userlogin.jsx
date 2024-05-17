"use client";

import { createContext, useState } from "react";

export const UserloginContext = createContext();

const UserloginWrapper = ({ children }) => {
  // COMPANY STATUS STATE
  const [logindata, setLogindata] = useState({
    username: "",
    pasword: "",
  });

  return (
    <UserloginContext.Provider value={[logindata, setLogindata]}>
      {children}
    </UserloginContext.Provider>
  );
};

export default UserloginWrapper;
