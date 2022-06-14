import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import LogoDN from "../assets/logo-dn.png";

const Header = () => {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center flex-column title-abs">
        {/* logo */}
        <img src={LogoDN} className="img-logo" alt="logo-dn-7"></img>

        {/* title */}
        <h2> DIES NATALIS VII</h2>
        <h3>Politeknik Keuangan Negara STAN</h3>
      </div>
    </>
  );
};

export default Header;
