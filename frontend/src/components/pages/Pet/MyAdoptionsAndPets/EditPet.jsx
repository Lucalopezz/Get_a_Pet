import React from "react";
import api from "../../../../utils/api";

import styles from "../AddPet/AddPet.module.css";

import { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";

import PetForm from "../../../form/PetForm";
import { updatePet } from "./updatePet";

const EditPet = () => {
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

  const update = async (data) => {
    try {
      await updatePet(data, id)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
      {pet.name && (
        <PetForm onSubmit={update} btnText="Atualizar" petData={pet} />
      )}
    </section>
  );
};

export default EditPet;
