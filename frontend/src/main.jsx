import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider, Routes } from "react-router-dom";

//Context
import { UserProvider } from "./context/UserContext.jsx";


import Home from "./components/pages/Home.jsx";
import Register from "./components/pages/Auth/Register.jsx";
import Login from "./components/pages/Auth/Login.jsx";
import Profile from "./components/pages/User/Profile.jsx";
import MyPets from "./components/pages/Pet/MyPets.jsx";
import AddPet from "./components/pages/Pet/AddPet.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/user/profile",
        element: <Profile />,
      },
      {
        path: "/pet/mypets",
        element: <MyPets/>
      },
      {
        path: "/pet/add",
        element: <AddPet/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
