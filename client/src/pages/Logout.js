import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import '../style/dashboard.css'
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const confirmLogout = () => {
    confirmAlert({
      title: "Confirm to logout",
      message: "Are you sure you want to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleLogout(),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };
  return (
    <>
      <button className="logout-btn" onClick={confirmLogout}>
      <i className="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </>
  );
};

export default Logout;
