import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "./Dashboard.module.css";
import useFlashMessage from "../../../hooks/useFlashMessage";
import api from "../../../utils/api";

import RoundedImage from "../../layout/RoundedImage";
const imageURL = "http://localhost:5000/";

const MyPets = () => {
  const { setFlashMessage } = useFlashMessage();
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem("token" || ""));

  useEffect(() => {
    api
      .get("/pets/mypets", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((resp) => {
        setPets(resp.data.pets);
      });
  }, [token]);

  const removePet = async (id) => {
    let msgType = "success";

    const data = await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((resp) => {
        const updatedPers = pets.filter((pet) => pet._id != id); // remove deleted pet from the frontend
        setPets(updatedPers);
        return resp.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };

  return (
    <section>
      <div className={styles.petslist_header}>
        <h1>Meus pets</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div className={styles.petslist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div key={pet._id} className={styles.petlist_row}>
              <RoundedImage
                src={`${imageURL}images/pets/${pet.images[0]} `}
                alt={pet.name}
                width="75px"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.available ? (
                  <>
                    {pet.adopter && (
                      <button className={styles.conclude_btn}>
                        Concluir adoção
                      </button>
                    )}
                    <Link to={`pet/edit/${pet._id}`}>Editar</Link>
                    <button onClick={() => removePet(pet._id)}>Excluir</button>
                  </>
                ) : (
                  <p>Pet já adotado</p>
                )}
              </div>
            </div>
          ))}
        {pets.length === 0 && <p>Não há pets cadastrados</p>}
      </div>
    </section>
  );
};

export default MyPets;
