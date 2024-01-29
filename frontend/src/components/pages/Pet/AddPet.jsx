import styles from "./AddPet.module.css";

import api from "../../../utils/api";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useFlashMessage from "../../../hooks/useFlashMessage";
import PetForm from "../../form/PetForm";

const AddPet = () => {
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function registerPet(pet) {
    console.log(pet);
    let msgType = "success";
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    const data = await api
      .post("pets/create", formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });
    setFlashMessage(data.message, msgType);
    if (msgType !== "error") {
      navigate("/pet/mypets");
    }
  }
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponivel para adoção</p>
      </div>
      <br />
      <PetForm btnText="Cadastrar Pet" onSubmit={registerPet} />
    </section>
  );
};

export default AddPet;
