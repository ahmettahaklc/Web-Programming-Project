import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './style.css';
import { useNavigate } from "react-router-dom";

const TopBar = ({ user, setUser }) => {
  const targetRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const targetElement = targetRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.isIntersecting
            ? entry.target.classList.add("active")
            : entry.target.classList.remove("active");
        });
      },
      { threshold: 0.01 }
    );
    if (targetElement) observer.observe(targetElement);
    return () => {
      if (targetElement) observer.unobserve(targetElement);
    };
  }, []);

  return (
    <div className="topbar">
      <div className="wrapper target" ref={targetRef}>
        <div className="center">
          {user && (
            <>
              <a href="/Dashboard">Ana Sayfa</a>
              <a href="/CaseManagementPage">Davalar</a>
              <a href="/ClientManagementPage">Müvekkiller</a>
            </>
          )}
          <a href="/Comunication">İletişim</a>
          {user ? (
            <>
              <a href="#" onClick={(e) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    navigate('/');    
  }}>Çıkış Yap</a>
            </>
          ) : (
            <>
              <a href="/Login">Giriş Yap</a>
              <a href="/SignIn">Kaydol</a>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default TopBar;
