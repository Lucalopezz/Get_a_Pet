import { useState } from "react";

import { useForm, Controller } from "react-hook-form";

import formStyles from "./Form.module.css";

import Input from "./Input";

const imageURL = 'http://localhost:5000/'


const PetForm = ({ onSubmit, petData, btnText }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [pet, setPet] = useState(petData || {});
  const colors = ["Branco", "Preto", "Cinza", "Caramelo"];



  return (
    <form className={formStyles.form_container} onSubmit={handleSubmit(onSubmit)}>
        <div className={formStyles.preview_pet_images} >
            {pet.images  && (
                pet.images.map((image, index) => <img src={`${imageURL}images/pets/${image} `}  alt={pet.name} key={`${pet.name}+${index}`}  /> )
            )}
        </div>
      <Input
        text="Foto dos Pets"
        type="file"
        name="images"
        {...register("images")}
        accept="image/png,image/jpeg"
        multiple={true}
      />
      <Input
        value={pet.name || ""}
        text="Nome do Pet"
        type="text"
        name="name"
        placeholder="Digite o nome do seu Pet"
        {...register("name")}
        d
      />
      <Input
        text="Idade do Pet"
        type="text"
        name="age"
        placeholder="Digite a idade do seu Pet"
        {...register("age")}
        value={pet.age || ""}
      />
      <Input
        text="Peso do Pet"
        type="text"
        name="weight"
        placeholder="Digite o peso do seu Pet"
        {...register("weight")}
        value={pet.weight || ""}
      />
      <div className={formStyles.form_control_select}>
      <Controller 
        name="color"
        control={control}
        defaultValue={pet.color || ''}
        render={({ field }) => (
          <select {...field}>
            <option value="" disabled>Selecione uma cor</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        )}
      />
      </div>

      <input type="submit" value={btnText} />
    </form>
  );
};

export default PetForm;
