import React, { useContext } from "react";
import Input from "../../form/Input";

import styles from "../../form/Form.module.css";

import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Context } from "../../../context/UserContext";

import { useNavigate } from "react-router-dom";

const RegisterFormSchema = z
  .object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    password: z.string(),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "As senhas não conferem!",
    path: ["confirmpassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterFormSchema),
  });
  const { register: registerContext } = useContext(Context);
  const navigate = useNavigate(); //pass the navigate through the props

  const onSubmit = async (data) => {
    registerContext(data, navigate);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_container}>
        <h1>Registrar</h1>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite seu nome"
          {...register("name")}
          helperText={errors?.name?.message}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite seu telefone"
          {...register("phone")}
          helperText={errors?.phone?.message}
        />
        <Input
          text="E-mail"
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
        <input type="submit" value="Cadastrar" />
        <p>
          Já tem conta? <Link to="/login">Clique aqui.</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
