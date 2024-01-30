import React from "react";
import api from "../../../utils/api";

import styles from "./AddPet.module.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useFlashMessage from "../../../hooks/useFlashMessage";
import PetForm from "../../form/PetForm";

const EditPet = () => {
  const { setFlashMessage } = useFlashMessage();
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token" || ""));

  const { id } = useParams();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((resp) => {
        setPet(resp.data.pet);
      });
  }, [token, id]);

  const updatePet = async (petData) => {
    let msgType = "success";
    const formData = new FormData();
    const petFormData = Object.keys(petData).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < petData[key].length; i++) {
          formData.append(`images`, petData[key][i]);
        } 
      } else {
        formData.append(key, petData[key]);
      }
    });

    formData.append("pet", petFormData);

    const data = await api
      .patch(`pets/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload()
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm onSubmit={updatePet} btnText="Atualizar" petData={pet} />
      )}
    </section>
  );
};

export default EditPet;
