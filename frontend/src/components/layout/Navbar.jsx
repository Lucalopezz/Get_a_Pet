import { Link, useNavigate } from "react-router-dom";

import styles from "./Navbar.module.css";

import Logo from "../../assets/img/logo.png";
import { Context } from "../../context/UserContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, logout } = useContext(Context);
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <img src={Logo} alt="Get A Pet" />
        <h2>Get A Pet</h2>
      </div>
      <ul>
        {authenticated ? (
          <>
            <li>
              <Link to="/">Adotar</Link>
            </li>
            <li>
              <Link to="/user/profile">Perfil</Link>
            </li>
            <li>
              <Link to="/pet/mypets">Meus Pets</Link>
            </li>
            <li>
              <Link to="/pet/myadoptions">Adoções</Link>
            </li>

            <li onClick={(e) => logout(navigate)}>Sair</li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Entrar</Link>
            </li>
            <li>
              <Link to="/register">Cadastrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
