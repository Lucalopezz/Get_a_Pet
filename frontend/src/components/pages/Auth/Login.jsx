import { useContext } from "react";
import Input from "../../form/Input";
import { Link, useNavigate } from "react-router-dom";

import styles from "../../form/Form.module.css";



import { Context } from "../../../context/UserContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
  });


  const { login } = useContext(Context);
  const navigate = useNavigate()

  const onSubmit = (user) => {
    login(user, navigate)
  };

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <input type="submit" value="Entrar" />
      </form>
      <p>
        Não tem uma conta? <Link to="/login">Crie uma aqui.</Link>
      </p>
    </section>
  );
};

export default Login;
