import { RootState } from "../lib/store";
import React from "react";
import { useSelector } from "react-redux";

const useUserLogin = () => {
  const isClient = typeof window === "object";

  const [userToken, setUserToken] = React.useState<string | null>(
    isClient ? localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") as string)?.token : null
  );
  const userRedux = useSelector((state: RootState) => state.user.user);

  React.useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("ETWL") && JSON.parse(localStorage.getItem("ETWL") as string)?.token;
      setUserToken(token || null);
    }
  }, [userRedux, isClient]);

  return {
    isLogin: userToken ? true : false,
    token: userToken,
  };
};

export default useUserLogin;
