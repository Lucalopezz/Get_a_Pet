import React from "react";
import Input from "../../form/Input";

import styles from "../../form/Form.module.css";

import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

const CreateMemoryFormSchema = z
  .object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email("E-mail inválido!"),
    password: z.string(),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "As senhas não conferem!",
    path: ["confirmpassword"]
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateMemoryFormSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <section>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form_container}>
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
