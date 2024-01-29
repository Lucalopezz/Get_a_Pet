import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "./Dashboard.module.css";

const MyPets = () => {
  const [pets, setPets] = useState([]);
  return (
    <section>
      <div className={styles.petslist_header}>
        <h1>Meus pets</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div className={styles.petslist_container}>
        {pets.length > 0 && <p>Meus pets cadastrados</p>}
        {pets.length === 0 && <p>Não há pets cadastrados</p>}
      </div>
    </section>
  );
};

export default MyPets;
