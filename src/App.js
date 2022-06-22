import React, { useState } from "react";
import "./index.css";

import Header from "./components/Header";
import Dropdown from "./components/Dropdown";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="col-md-4 d-flex justify-content-center align-items-center flex-column m-auto container">
        <Header />
        <Dropdown />
        <Footer />
      </div>
    </>
  );
}

export default App;
