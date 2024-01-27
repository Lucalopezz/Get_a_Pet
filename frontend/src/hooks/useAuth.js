import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  // const navigate = useNavigate();

  const { setFlashMessage } = useFlashMessage();

  async function register(user) {
    let msgText = "Cadastro Realizado!";
    let msgType = "success";
    try {
      const data = await api.post("/users/register", user).then((resp) => {
        return resp.data;
      });
      console.log(data);
    } catch (error) {
      msgText = error.response.data.message;
      msgType = "error";
    }

    setFlashMessage(msgText, msgType)
  }
  return { register };
}
