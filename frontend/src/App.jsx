import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navbar />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}

export default App;
