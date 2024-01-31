import styles from "./AddPet.module.css";

import { registerPet } from "./registerPet";

import PetForm from "../../../form/PetForm";
import { useNavigate } from "react-router-dom";

const AddPet = () => {
  const navigate = useNavigate();
  const register = async (data) => {
    try {
      await registerPet(data, navigate);
    } catch (error) {
      console.log(error)
    }
  };
  
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponivel para adoção</p>
      </div>
      <br />
      <PetForm btnText="Cadastrar Pet" onSubmit={register} />
    </section>
  );
};

export default AddPet;
