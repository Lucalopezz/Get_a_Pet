import formStyles from "../../form/Form.module.css";
import styles from "./Profile.module.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../form/Input";

import { useState, useEffect } from "react";

import api from "../../../utils/api";

import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layout/RoundedImage";

const imageURL = 'http://localhost:5000/'

const imageUserSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  password: z.string(),
  confirmpassword: z.string(),
  image: z.instanceof(FileList),
});

const Profile = () => {
  const [user, setUser] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(imageUserSchema),
  });

  const onSubmit = async (userData) => {
    console.log(user);
    let msgType = "success";
    const formData = new FormData();

    Object.keys(user).forEach((key) => {
      formData.append(key, userData[key] || user[key]); //update the data whitch was updated, and include the data witch isnt updated
    });

    if (userData.password) {
      formData.append("password", userData.password); //add the password camp to the resquest
    }
    if (userData.confirmpassword) {
      formData.append("confirmpassword", userData.confirmpassword);
    }
    if (userData.image[0] instanceof File) {
      formData.append("image", userData.image[0]);
    }

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
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
        console.log(err);
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  };
  return (
    <section>
     
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {user.image && (
          <RoundedImage src={`${imageURL}images/users/${user.image}`}  alt={user.name}/>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={formStyles.form_container}
      >
        <Input
          text="Imagem"
          type="file"
          name="image"
          {...register("image")}
          helperText={errors?.image?.message}
          accept="image/png,image/jpeg"
        />

        <Input
          text="Nome"
          value={user.name || ""}
          type="text"
          name="name"
          placeholder="Digite seu nome"
          {...register("name")}
          helperText={errors?.name?.message}
        />
        <Input
          text="Telefone"
          value={user.phone || ""}
          type="text"
          name="phone"
          placeholder="Digite seu telefone"
          {...register("phone")}
          helperText={errors?.phone?.message}
        />
        <Input
          text="E-mail"
          value={user.email || ""}
          type="email"
          name="email"
          placeholder="Digite seu E-mail"
          {...register("email")}
          helperText={errors?.email?.message}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          {...register("password")}
          helperText={errors?.password?.message}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmpassword"
          placeholder="Digite a sua senha novamente"
          {...register("confirmpassword")}
          helperText={errors?.confirmpassword?.message}
        />
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
};

export default Profile;
