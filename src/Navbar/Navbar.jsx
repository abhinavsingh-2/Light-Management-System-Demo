import React from "react";
import { Building2 } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="brand-logo" id="logo">
          <div className="brand-icon">
            <Building2 size={18} color="#870047" />
          </div>
          <span className="brand-title">SmartSpace 3D</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
