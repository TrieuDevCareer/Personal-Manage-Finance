import Axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";
import domain from "../util/domain";

const UserContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sử dụng useCallback để tránh tạo lại hàm này mỗi khi component render
  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userRes = await Axios.get(`${domain}/auth/loggedIn`);
      setUser(userRes.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError(err.message || "Failed to fetch user data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <UserContext.Provider value={{ user, getUser, loading, error }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
export { UserContextProvider };