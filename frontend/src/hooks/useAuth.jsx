import api from "../utils/api";

import { useState, useEffect } from "react";

import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setAuthenticated(true);
    }
  }, []);

  async function register(user, navigate) {
    let msgText = "Cadastro Realizado!";
    let msgType = "success";
    try {
      const data = await api.post("/users/register", user).then((resp) => {
        return resp.data;
      });
      await authUser(data, navigate);
    } catch (error) {
      msgText = error.response.data.message;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType);
  }

  async function authUser(data, navigate) {
    setAuthenticated(true);
    localStorage.setItem("token", JSON.stringify(data.token));

    navigate("/");
  }

  function logout(navigate){
    const msgText = "Logout realizado com sucesso!";
    const msgType = "success";

    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    navigate('/')

    setFlashMessage(msgText, msgType)
  }
  return { authenticated, register, logout };
}
